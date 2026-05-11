import { db } from '@/db/prisma';
import PageHeader from '../../_components/PageHeader';
import ProductForm from '../_components/ProductForm';

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <>
      <PageHeader
        title="Create product"
        subtitle="Add a new product"
      ></PageHeader>

      <ProductForm categories={categories} />
    </>
  );
}
