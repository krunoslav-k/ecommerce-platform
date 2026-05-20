import { db } from '@/db/prisma';

export async function getCustomersData() {
  const [revenueData, uniqueCustomers] = await Promise.all([
    db.order.aggregate({
      where: { status: 'PAID' },
      _sum: { totalInCents: true },
    }),

    db.order.findMany({
      where: { status: 'PAID' },
      select: { clerkUserId: true },
      distinct: ['clerkUserId'],
    }),
  ]);

  const totalRevenue = revenueData._sum.totalInCents ?? 0;
  const numberOfCustomers = uniqueCustomers.length;

  return {
    numberOfCustomers,
    averageSpentPerCustomer:
      numberOfCustomers > 0 ? totalRevenue / numberOfCustomers / 100 : 0,
  };
}
