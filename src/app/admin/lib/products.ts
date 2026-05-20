import { db } from '@/db/prisma';

export async function getProductData() {
  const [inStock, outOfStock] = await Promise.all([
    db.product.count({ where: { stock: { gt: 0 } } }),
    db.product.count({ where: { stock: 0 } }),
  ]);

  return { inStock, outOfStock };
}

export async function getProductById(productId: string) {
  return await db.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
    },
  });
}
