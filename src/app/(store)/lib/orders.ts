import { db } from '@/db/prisma';

export async function getOrders(userId: string) {
  return db.order.findMany({
    where: {
      clerkUserId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
}
