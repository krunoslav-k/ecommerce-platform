import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/db/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const clerkUserId = session.metadata?.clerkUserId;

    if (!clerkUserId) {
      return new Response('Missing user id', { status: 400 });
    }

    const cart = await db.cart.findUnique({
      where: {
        clerkUserId,
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
      return new Response('Cart not found', { status: 404 });
    }

    const order = await db.order.create({
      data: {
        clerkUserId,

        status: 'PAID',

        totalInCents: cart.items.reduce((acc, item) => {
          return acc + item.product.priceInCents * item.quantity;
        }, 0),

        stripeSessionId: session.id,

        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,

            quantity: item.quantity,

            pricePaidInCents: item.product.priceInCents,
          })),
        },
      },
    });

    for (const item of cart.items) {
      await db.product.update({
        where: {
          id: item.productId,
        },

        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    console.log('Order created:', order.id);
  }

  return new Response(null, { status: 200 });
}
