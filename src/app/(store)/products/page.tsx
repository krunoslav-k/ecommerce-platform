import { ProductCardSkeleton } from '@/components/ProductCard';
import { Suspense } from 'react';
import { ProductSuspense } from '../page';
import { db } from '@/db/prisma';

function getProducts() {
  return db.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { name: 'asc' },
    include: { images: { take: 1 } },
  });
}

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
