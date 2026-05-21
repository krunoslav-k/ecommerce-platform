import { db } from '@/db/prisma';
import PageHeader from '../../../_components/PageHeader';
import CategoryForm from '../../_components/CategoryForm';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await db.category.findUnique({
    where: { id },
  });

  return (
    <>
      <PageHeader
        title="Edit category"
        subtitle="Manage category's details"
      ></PageHeader>
      <CategoryForm category={category} />
    </>
  );
}
