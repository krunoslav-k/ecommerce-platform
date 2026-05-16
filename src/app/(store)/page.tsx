import { db } from '@/db/prisma';
import { Product } from '@prisma/client';

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
  productsFetcher: () => Promise<Product[]>;
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
    </div>
  );
}
