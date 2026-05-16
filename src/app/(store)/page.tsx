import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { db } from '@/db/prisma';
import { Product, ProductImage } from '@prisma/client';
import { Suspense } from 'react';

function getMostPopularProducts() {
  return db.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },
    orderBy: {
      orderItems: {
        _count: 'desc',
      },
    },
    include: {
      images: {
        take: 1,
      },
    },
    take: 6,
  });
}

function getNewestProducts() {
  return db.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: {
        take: 1,
      },
    },
    take: 6,
  });
}

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
      <div className="flex gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
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
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<(Product & { images: ProductImage[] })[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard
      key={product.id}
      {...product}
      imagePath={product.images[0]?.url}
    />
  ));
}
