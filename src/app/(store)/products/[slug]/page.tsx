import { notFound } from 'next/navigation';

import {
  getProductBySlug,
  getQuantityOfProductInCart,
} from '../../lib/products';
import ProductGallery from '../../../../components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const quantityOfProductInCart = await getQuantityOfProductInCart(product.id);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="w-full md:w-1/2 lg:w-4/10">
          <ProductGallery images={product.images} />
        </div>

        <div className="w-full md:w-1/2 lg:w-4/10">
          <ProductInfo
            product={product}
            quantityOfProductInCart={quantityOfProductInCart?.quantity ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
