import { db } from '@/db/prisma';
import PageHeader from '@/app/admin/_components/PageHeader';
import { getProductsByCategory } from '../../lib/products';
import ProductGrid from '../../_components/ProductGrid';
import { getCategoryBySlug } from '../../lib/categories';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <h1>Kategorija nije pronađena</h1>;
  }

  return (
    <div>
      <PageHeader
        title={category.name}
        subtitle="Explore all the products in this category"
      />
      <ProductGrid productsFetcher={() => getProductsByCategory(category.id)} />
    </div>
  );
}
