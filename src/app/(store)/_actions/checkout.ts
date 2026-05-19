'use server';

import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/prisma';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const cart = await db.cart.findUnique({
    where: {
      clerkUserId: userId,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    payment_method_types: ['card'],

    line_items: cart.items.map((item) => ({
      quantity: item.quantity,

      price_data: {
        currency: 'eur',

        unit_amount: item.product.priceInCents,

        product_data: {
          name: item.product.name,
          description: item.product.description,
        },
      },
    })),

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,

    metadata: {
      clerkUserId: userId,
    },
  });

  redirect(session.url!);
}
