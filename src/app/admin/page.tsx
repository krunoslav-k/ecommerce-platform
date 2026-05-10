import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/db/prisma';
import { formatCurrency, formatNumber } from '@/lib/formatters';

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { totalInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.totalInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { totalInCents: true },
    }),
  ]);

  return {
    userCount,
    averageSpentPerUser:
      userCount === 0
        ? 0
        : (orderData._sum.totalInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [inStock, outOfStock] = await Promise.all([
    db.product.count({ where: { stock: { gt: 0 } } }),
    db.product.count({ where: { stock: 0 } }),
  ]);

  return { inStock, outOfStock };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Sales"
        description={`${formatNumber(salesData.numberOfSales)} orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        description={`${userData.userCount} customers`}
        body={`Each customer spends ${formatCurrency(userData.averageSpentPerUser)} on average`}
      />
      <DashboardCard
        title="Products in stock"
        description={`${productData.outOfStock} products out of stock`}
        body={`${productData.inStock}`}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  description: string;
  body: string;
};

function DashboardCard({ title, description, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>{body}</CardContent>
    </Card>
  );
}
