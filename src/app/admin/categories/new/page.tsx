import PageHeader from '../../_components/PageHeader';
import CategoryForm from '../_components/CategoryForm';

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader
        title="Create category"
        subtitle="Add a new category"
      ></PageHeader>
      <CategoryForm />
    </>
  );
}
