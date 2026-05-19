import { Product, ProductImage } from '@prisma/client';
import ProductCard from './ProductCard';

export async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<(Product & { images: ProductImage[] })[]>;
}) {
  const products = await productsFetcher();

  return products.map((product) => (
    <ProductCard
      key={product.id}
      productId={product.id}
      name={product.name}
      description={product.description}
      priceInCents={product.priceInCents}
      stock={product.stock}
      imagePath={product.images[0]?.url ?? ''}
    />
  ));
}
