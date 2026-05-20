import { db } from '@/db/prisma';

export async function getSalesData() {
  const [sales, numberOfSales] = await Promise.all([
    db.order.aggregate({
      where: { status: 'PAID' },
      _sum: { totalInCents: true },
    }),

    db.order.count({
      where: { status: 'PAID' },
    }),
  ]);

  return {
    amount: (sales._sum.totalInCents ?? 0) / 100,
    numberOfSales,
  };
}
