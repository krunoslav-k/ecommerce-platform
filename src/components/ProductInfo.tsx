'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingCart, Pencil } from 'lucide-react';
import Link from 'next/link';
import { addToCart } from '@/app/(store)/_actions/cart';

type ProductInfoProps = {
  product: {
    id: string;
    name: string;
    description: string | null;
    priceInCents: number;
    stock: number;
  };

  quantityOfProductInCart?: number;
};

export default function ProductInfo({
  product,
  quantityOfProductInCart,
}: ProductInfoProps) {
  const isEditMode = quantityOfProductInCart === undefined;
  const isInStock =
    quantityOfProductInCart !== undefined
      ? quantityOfProductInCart < product.stock
      : true;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

          {isInStock ? (
            <Badge variant="secondary">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        <p className="text-4xl font-bold">
          {formatCurrency(product.priceInCents / 100)}
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Description</h2>

        <p className="text-muted-foreground leading-7">
          {product.description || 'No description available.'}
        </p>
      </div>

      <div className="pt-4">
        {isEditMode ? (
          <Button asChild size="lg" className="p-5">
            <Link href={`${product.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit product
            </Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className="p-5 hover:bg-gray-800"
            disabled={quantityOfProductInCart >= product.stock}
            onClick={() => {
              addToCart(product.id);
              toast.success(`Item ${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
