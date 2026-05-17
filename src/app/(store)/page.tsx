import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { db } from '@/db/prisma';
import { cache } from '@/lib/cache';
import { Product, ProductImage } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { orderItems: { _count: 'desc' } },
      include: { images: { take: 1 } },
      take: 6,
    });
  },
  ['/', 'getMostPopularProducts'],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      include: { images: { take: 1 } },
      take: 6,
    });
  },
  ['/', 'getNewestProducts'],
  { revalidate: 60 * 60 * 24 }
);

export default function Home() {
  return (
    <main className="space-y-8">
      <ProductGridSection
        productsFetcher={getMostPopularProducts}
        title="Most Popular"
      />

      <ProductGridSection productsFetcher={getNewestProducts} title="Newest" />
    </main>
  );
}

type ProductGridSectionProps = {
  productsFetcher: () => Promise<(Product & { images: ProductImage[] })[]>;
  title: string;
};

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="ghost" asChild>
          <Link href="/products">
            View all <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

export async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<(Product & { images: ProductImage[] })[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard
      key={product.id}
      {...product}
      productId={product.id}
      imagePath={product.images[0]?.url}
    />
  ));
}
