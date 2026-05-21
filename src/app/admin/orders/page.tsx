import { db } from '@/db/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatCurrency } from '@/lib/formatters';
import PageHeader from '../_components/PageHeader';

export default async function OrdersPage() {
  const orders = await db.order.findMany({
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

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle="" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>

                <TableCell>{order.status}</TableCell>

                <TableCell className="font-mono text-xs">
                  {order.clerkUserId}
                </TableCell>

                <TableCell>
                  {formatCurrency(order.totalInCents / 100)}
                </TableCell>

                <TableCell>
                  {order.orderItems.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}
                </TableCell>

                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
