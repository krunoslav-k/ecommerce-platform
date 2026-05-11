'use server';

import { db } from '@/db/prisma';
import fs from 'fs/promises';
import path from 'path';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const imageSchema = z
  .instanceof(File, { message: 'Image is required' })
  .refine((file) => file.type.startsWith('image/'), 'File must be an image')
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'Image must be smaller than 5MB'
  );

const addProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  description: z.string().min(1, 'Description is required'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format'),

  priceInCents: z.coerce.number().int().min(1, 'Price must be at least 1 cent'),

  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),

  categoryId: z.string().min(1, 'Category is required'),

  images: z.array(imageSchema).min(1, 'At least one image is required'),
});

export type AddProductState = {
  errors?: {
    name?: string[];
    description?: string[];
    slug?: string[];
    priceInCents?: string[];
    stock?: string[];
    categoryId?: string[];
    images?: string[];
  };
};

export async function addProduct(
  prevState: AddProductState,
  formData: FormData
): Promise<AddProductState> {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    slug: formData.get('slug'),
    priceInCents: formData.get('priceInCents'),
    stock: formData.get('stock'),
    categoryId: formData.get('categoryId'),
    images: formData.getAll('images'),
  };

  const result = addProductSchema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  const existingProduct = await db.product.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingProduct) {
    return {
      errors: {
        slug: ['Slug already exists'],
      },
    };
  }

  await fs.mkdir('public/products', {
    recursive: true,
  });

  const imageUrls: string[] = [];

  for (const image of data.images) {
    const fileName = `${crypto.randomUUID()}-${image.name}`;

    const filePath = path.join(process.cwd(), 'public/products', fileName);

    await fs.writeFile(filePath, Buffer.from(await image.arrayBuffer()));

    imageUrls.push(`/products/${fileName}`);
  }

  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      slug: data.slug,
      priceInCents: data.priceInCents,
      stock: data.stock,
      categoryId: data.categoryId,

      images: {
        create: imageUrls.map((url) => ({
          url,
        })),
      },
    },
  });

  redirect('/admin/products');
}
