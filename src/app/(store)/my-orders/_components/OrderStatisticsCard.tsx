import { db } from '@/db/prisma';
import { auth } from '@clerk/nextjs/server';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function OrderStatisticsCard() {
  const { userId } = await auth();

  if (!userId) return null;

  const orders = await db.order.findMany({
    where: {
      clerkUserId: userId,
    },
    include: {
      orderItems: true,
    },
  });

  const totalOrders = orders.length;

  const totalSpentInCents = orders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.pricePaidInCents * item.quantity;
    }, 0);

    return acc + orderTotal;
  }, 0);

  const averageOrderValue =
    totalOrders > 0 ? totalSpentInCents / totalOrders : 0;

  const paidOrders = orders.filter((o) => o.status === 'PAID').length;

  const lastOrder = orders[0];

  return (
    <Card className="h-fit w-full py-5">
      <CardHeader>
        <CardTitle>Order Statistics</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total orders</p>
          <p className="font-semibold">{totalOrders}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total spent</p>
          <p className="font-semibold">
            {formatCurrency(totalSpentInCents / 100)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Average order</p>
          <p className="font-semibold">
            {formatCurrency(averageOrderValue / 100)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Paid orders</p>
          <Badge variant="default">{paidOrders}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Last order</p>
          <p className="text-sm font-medium">
            {lastOrder
              ? new Date(lastOrder.createdAt).toLocaleDateString()
              : '—'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
