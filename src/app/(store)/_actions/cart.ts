'use server';

import { db } from '@/db/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getCart, getOrCreateCart } from '@/lib/cart';
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

export async function deleteItemFromCart(productId: string) {
  const userId = await getCurrentUser();
  const cart = await getCart(userId);

  if (!cart) return;

  const existingItem = await db.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await db.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    revalidatePath('/cart');
  }
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
) {
  const userId = await getCurrentUser();
  const cart = await getCart(userId);

  if (!cart) return;

  if (quantity <= 0) {
    await db.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
  } else {
    await db.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
  }

  revalidatePath('/cart');
}
