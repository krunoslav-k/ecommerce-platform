import { Button } from '@/components/ui/button';
import PageHeader from '../_components/PageHeader';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/db/prisma';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import { EllipsisVertical } from 'lucide-react';

export default async function AdminProducts() {
  const [productCount] = await Promise.all([db.product.count()]);

  return (
    <>
      <div className="flex">
        <PageHeader
          title="Products"
          number={productCount}
          subtitle="Manage store's products"
        />

        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      priceInCents: true,
      stock: true,
      categoryId: true,
      images: true,
      _count: { select: { orderItems: true } },
    },
    orderBy: { name: 'asc' },
  });

  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => {
          return (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.images[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  width={50}
                  height={50}
                />
              </TableCell>

              <TableCell>{product.name}</TableCell>

              <TableCell>
                {categories.find((c) => c.id === product.categoryId)?.name}
              </TableCell>

              <TableCell>
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>

              <TableCell>{product.stock}</TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-4 h-8 w-8 opacity-60 hover:bg-gray-100 hover:opacity-100"
                >
                  <EllipsisVertical size={18} />
                  <span className="sr-only">Actions</span>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
