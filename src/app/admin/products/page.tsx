import { Button } from '@/components/ui/button';
import PageHeader from '../_components/PageHeader';
import Link from 'next/link';
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminProducts() {
  return (
    <>
      <div className="flex">
        <PageHeader
          title="Products"
          number={3}
          subtitle="Manage store's products"
        />
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <ProductsTable></ProductsTable>
    </>
  );
}

function ProductsTable() {
  return (
    <Table>
      <TableCaption>Products</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="hidden md:table-cell">Created</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  );
}
