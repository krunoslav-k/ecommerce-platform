import { Button } from '@/components/ui/button';
import { Product, ProductImage } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getMostPopularProducts, getNewestProducts } from './lib/products';
import ProductGrid from './_components/ProductGrid';

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

      <ProductGrid productsFetcher={productsFetcher} />
    </div>
  );
}
