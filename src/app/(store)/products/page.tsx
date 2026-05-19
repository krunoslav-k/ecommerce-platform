import { ProductCardSkeleton } from '@/app/(store)/_components/ProductCard';
import { Suspense } from 'react';
import { db } from '@/db/prisma';
import { cache } from '@/lib/cache';
import { ProductSuspense } from '../_components/ProductSuspense';

const getProducts = cache(
  () => {
    return db.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { name: 'asc' },
      include: { images: { take: 1 } },
    });
  },
  ['/products', 'getProducts'],
  { revalidate: 60 * 60 * 24 }
);

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
        <ProductSuspense productsFetcher={getProducts} />
      </Suspense>
    </div>
  );
}
