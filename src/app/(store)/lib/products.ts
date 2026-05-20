import { db } from '@/db/prisma';
import { getCurrentUser } from '@/lib/auth';
import { cache } from '@/lib/cache';
import { getCart } from '@/lib/cart';

export const getAllProducts = cache(
  () => {
    return db.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { name: 'asc' },
      include: { images: { take: 1 } },
    });
  },
  ['/products', 'getProducts'],
  { revalidate: 60 * 60 * 24 }
);

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

export async function getQuantityOfProductInCart(productId: string) {
  const userId = await getCurrentUser();
  const cart = await getCart(userId);
  if (!cart) return;

  return await db.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
    select: { quantity: true },
  });
}
