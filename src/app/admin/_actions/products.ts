'use server';

import { db } from '@/db/prisma';
import fs from 'fs/promises';
import path from 'path';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

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

  stock: z
    .string()
    .min(1, 'Stock is required')
    .transform((val) => Number(val))
    .pipe(z.number().int().min(0, 'Stock cannot be negative')),

  categoryId: z.string().trim().min(1, 'Category is required'),

  images: z.array(imageSchema).min(1, 'At least one image is required'),
});

const editProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  priceInCents: z.coerce.number().int().min(1, 'Price must be at least 1 cent'),
  stock: z
    .string()
    .min(1, 'Stock is required')
    .transform((val) => Number(val))
    .pipe(z.number().int().min(0, 'Stock cannot be negative')),
  categoryId: z.string().trim().min(1, 'Category is required'),
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

export async function deleteProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) return notFound();

  for (const image of product.images) {
    const filePath = path.join(process.cwd(), 'public', image.url);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Failed to delete image:', filePath, err);
    }
  }

  await db.product.delete({
    where: { id },
  });
}

export type EditProductState = {
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

export async function editProduct(
  id: string,
  prevState: EditProductState,
  formData: FormData
): Promise<EditProductState> {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    slug: formData.get('slug'),
    priceInCents: formData.get('priceInCents'),
    stock: formData.get('stock'),
    categoryId: formData.get('categoryId'),
  };

  const result = editProductSchema.safeParse(rawData);

  const existingImageIds = formData.getAll('existingImageIds') as string[];
  const rawImages = formData.getAll('images') as File[];

  const newImages = rawImages.filter(
    (file) => file.size > 0 && file.name !== 'undefined'
  );

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  if (existingImageIds.length === 0 && newImages.length === 0) {
    return {
      errors: {
        images: ['At least one image is required'],
      },
    };
  }

  for (const file of newImages) {
    if (!file.type.startsWith('image/')) {
      return { errors: { images: ['All new files must be images'] } };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { errors: { images: ['Image must be smaller than 5MB'] } };
    }
  }

  const data = result.data;

  const product = await db.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) return notFound();

  const existingSlug = await db.product.findFirst({
    where: {
      slug: data.slug,
      id: { not: id },
    },
  });

  if (existingSlug) {
    return { errors: { slug: ['Slug already exists'] } };
  }

  const imagesToDelete = product.images.filter(
    (image) => !existingImageIds.includes(image.id)
  );

  for (const image of imagesToDelete) {
    const filePath = path.join(process.cwd(), 'public', image.url);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Failed to delete old image from disk:', filePath, err);
    }
  }

  const newImageUrls: string[] = [];
  if (newImages.length > 0) {
    await fs.mkdir('public/products', { recursive: true });

    for (const image of newImages) {
      const fileName = `${crypto.randomUUID()}-${image.name}`;
      const filePath = path.join(process.cwd(), 'public/products', fileName);
      await fs.writeFile(filePath, Buffer.from(await image.arrayBuffer()));
      newImageUrls.push(`/products/${fileName}`);
    }
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      slug: data.slug,
      priceInCents: data.priceInCents,
      stock: data.stock,
      categoryId: data.categoryId,
      images: {
        deleteMany: {
          id: {
            in: imagesToDelete.map((img) => img.id),
          },
        },
        create: newImageUrls.map((url) => ({
          url,
        })),
      },
    },
  });

  redirect('/admin/products');
}
