'use server';

import { db } from '@/db/prisma';
import { redirect } from 'next/navigation';

export async function addCategory(prevState: unknown, formData: FormData) {
  const name = formData.get('name')?.toString();
  const slug = formData.get('slug')?.toString();

  if (!name || !slug) {
    return {
      errors: {
        name: !name ? ['Name is required'] : undefined,
        slug: !slug ? ['Slug is required'] : undefined,
      },
    };
  }

  await db.category.create({
    data: {
      name,
      slug,
    },
  });

  redirect('/admin/categories');
}

export async function editCategory(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const name = formData.get('name')?.toString();
  const slug = formData.get('slug')?.toString();

  if (!name || !slug) {
    return {
      errors: {
        name: !name ? ['Name is required'] : undefined,
        slug: !slug ? ['Slug is required'] : undefined,
      },
    };
  }

  await db.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
    },
  });

  redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
  if (!id) {
    throw new Error('Category id is required');
  }

  await db.category.deleteMany({
    where: {
      id,
    },
  });

  redirect('/admin/categories');
}
