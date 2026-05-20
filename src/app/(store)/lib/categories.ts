import { db } from '@/db/prisma';

export async function getCategoryBySlug(slug: string) {
  return await db.category.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });
}
