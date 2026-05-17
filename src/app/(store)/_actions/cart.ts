'use server';

import { db } from '@/db/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getOrCreateCart } from '@/lib/cart';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string) {
  const userId = await getCurrentUser();

  const cart = await getOrCreateCart(userId);

  const existingItem = await db.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
      },
    });
  }

  revalidatePath('/cart');
}
