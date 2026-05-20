import ProductGallery from '@/components/ProductGallery';
import { notFound } from 'next/navigation';
import { getProductById } from '../../lib/products';
import ProductInfo from '@/components/ProductInfo';

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="w-full md:w-1/2 lg:w-4/10">
          <ProductGallery images={product.images} />
        </div>

        <div className="w-full md:w-1/2 lg:w-4/10">
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
