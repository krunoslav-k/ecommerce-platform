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
import { EllipsisVertical, SquarePen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteDropdownItem from './_components/DeleteDropdownItem';

export default async function AdminCategoriesPage() {
  const [categoryCount] = await Promise.all([db.category.count()]);

  return (
    <>
      <div className="flex">
        <PageHeader
          title="Categories"
          number={categoryCount}
          subtitle="Manage catagories of your products"
        />

        <Button asChild>
          <Link href="/admin/categories/new">Add Category</Link>
        </Button>
      </div>

      <CategoriesTable />
    </>
  );
}

async function CategoriesTable() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Products in category</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((category) => {
          return (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>

              <TableCell>{category.slug}</TableCell>

              <TableCell>{category._count.products}</TableCell>

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
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="flex items-center gap-1.5"
                      >
                        <SquarePen /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                      id={category.id}
                      disabled={category._count.products > 0}
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
