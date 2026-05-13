import PageHeader from '@/app/admin/_components/PageHeader';
import ProductForm from '../../_components/ProductForm';
import { db } from '@/db/prisma';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  return (
    <>
      <PageHeader
        title="Edit product"
        subtitle="Manage product details and inventory"
      ></PageHeader>

      <ProductForm product={product} categories={categories} />
    </>
  );
}
