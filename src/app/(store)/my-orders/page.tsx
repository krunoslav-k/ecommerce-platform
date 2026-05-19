import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/prisma';
import PageHeader from '@/app/admin/_components/PageHeader';
import OrderCard from './_components/OrderCard';
import OrderStatisticsCard from './_components/OrderStatisticsCard';

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    return <p>Unauthorized</p>;
  }

  const orders = await db.order.findMany({
    where: {
      clerkUserId: userId,
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: {
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        subtitle="Browse your order history and purchase details"
      />

      <div className="flex w-full flex-col gap-8 md:flex-row md:gap-6 lg:gap-12">
        <div className="flex w-full flex-col gap-5 md:w-2/3 lg:w-3/4">
          {orders.map((order) => {
            const total = order.orderItems.reduce((acc, item) => {
              return acc + item.pricePaidInCents * item.quantity;
            }, 0);

            return <OrderCard key={order.id} order={order} total={total} />;
          })}
        </div>

        <div className="w-full md:w-1/3 lg:w-1/4">
          <OrderStatisticsCard />
        </div>
      </div>
    </div>
  );
}
