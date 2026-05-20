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
import { EllipsisVertical, ScanEye, SquarePen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteDropdownItem from './_components/DeleteDropdownItem';

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
            <TableRow key={product.id} className="max-h-16">
              <TableCell>
                <Image
                  src={product.images[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-md object-cover"
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

              {/* DROPDOWN ACTIONS */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none focus:outline-none">
                    <EllipsisVertical
                      size={18}
                      className="mr-4 opacity-60 transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-100"
                    />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="mt-2 mr-4 p-1.5">
                    <DropdownMenuItem className="mb-1" asChild>
                      <Link href={`products/${product.id}`}>
                        <ScanEye /> View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-1.5"
                      >
                        <SquarePen /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                      id={product.id}
                      disabled={product._count.orderItems > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
