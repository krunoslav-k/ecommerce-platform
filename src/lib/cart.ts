import { db } from '@/db/prisma';

export async function getOrCreateCart(userId: string) {
  if (!userId) {
    return null;
  }

  let cart = await db.cart.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkUserId: userId,
      },
    });
  }

  return cart;
}

export async function getCart(userId: string) {
  if (!userId) {
    return null;
  }

  const cart = await db.cart.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  return cart;
}
