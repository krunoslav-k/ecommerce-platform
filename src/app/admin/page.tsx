import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { getSalesData } from './lib/sales';
import { getCustomersData } from './lib/customers';
import { getProductData } from './lib/products';

export default async function AdminDashboard() {
  const [salesData, customersData, productData] = await Promise.all([
    getSalesData(),
    getCustomersData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Sales"
        description={`${formatNumber(salesData.numberOfSales)} orders`}
        body={`Total revenue: ${formatCurrency(salesData.amount)}`}
      />
      <DashboardCard
        title="Customers"
        description={`${customersData.numberOfCustomers} customers`}
        body={`Each customer spends ${formatCurrency(customersData.averageSpentPerCustomer)} on average`}
      />
      <DashboardCard
        title="Products in stock"
        description={`${productData.outOfStock} products out of stock`}
        body={`${productData.inStock} products are currently in stock`}
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
