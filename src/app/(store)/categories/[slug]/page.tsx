import { db } from '@/db/prisma';
import { Suspense } from 'react';
import { ProductCardSkeleton } from '../../_components/ProductCard';
import { ProductSuspense } from '../../_components/ProductSuspense';
import PageHeader from '@/app/admin/_components/PageHeader';
import { getProductsByCategory } from '../../lib/products';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await db.category.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!category) {
    return <h1>Kategorija nije pronađena</h1>;
  }

  return (
    <div>
      <PageHeader
        title={category.name}
        subtitle="Explore all the products in this category"
      />

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense
            productsFetcher={() => getProductsByCategory(category.id)}
          />
        </Suspense>
      </div>
    </div>
  );
}
