import { db } from '@/db/prisma';
import { cache } from '@/lib/cache';

export const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { orderItems: { _count: 'desc' } },
      include: { images: { take: 1 } },
      take: 6,
    });
  },
  ['/', 'getMostPopularProducts'],
  { revalidate: 60 * 60 * 24 }
);

export const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      include: { images: { take: 1 } },
      take: 6,
    });
  },
  ['/', 'getNewestProducts'],
  { revalidate: 60 * 60 * 24 }
);

export const getProductsByCategory = (categoryId: string) =>
  cache(
    () => {
      return db.product.findMany({
        where: { categoryId },
        take: 6,
        include: { images: { take: 1 } },
      });
    },
    [`categories/${categoryId}`, 'getProductsByCategory'],
    { revalidate: 60 * 60 * 24 }
  )();
