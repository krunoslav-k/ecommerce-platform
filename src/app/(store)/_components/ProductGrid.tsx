import { Suspense } from 'react';
import { FiveProductCardSkeletons } from './ProductCard';
import { ProductSuspense } from './ProductSuspense';
import { Product, ProductImage } from '@prisma/client';

export default function ProductGrid({
  productsFetcher,
}: {
  productsFetcher: () => Promise<(Product & { images: ProductImage[] })[]>;
}) {
  return (
    <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Suspense fallback={<FiveProductCardSkeletons />}>
        <ProductSuspense productsFetcher={productsFetcher} />
      </Suspense>
    </div>
  );
}
