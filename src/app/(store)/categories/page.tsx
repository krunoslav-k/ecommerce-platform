import { ProductCardSkeleton } from '@/app/(store)/_components/ProductCard';
import { Suspense } from 'react';
import { ProductSuspense } from '../_components/ProductSuspense';
import { db } from '@/db/prisma';
import TitleLink from '../_components/TitleLink';

async function getProductsByCategory(categoryId: string) {
  return db.product.findMany({
    where: {
      categoryId,
    },
    take: 6,
    include: {
      images: {
        take: 1,
      },
    },
  });
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <TitleLink href={`/categories/${category.slug}`}>
            {category.name}
          </TitleLink>

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
      ))}
    </div>
  );
}
