import { formatCurrency } from '@/lib/formatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import Image from 'next/image';
import AddToCartButton from '@/app/(store)/_components/AddToCartButton';
import { db } from '@/db/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getCart } from '@/lib/cart';

async function getQuantityOfProductInCart(productId: string) {
  const userId = await getCurrentUser();
  const cart = await getCart(userId);
  if (!cart) return;

  return await db.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
    select: { quantity: true },
  });
}

type ProductCardProps = {
  productId: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imagePath: string;
};

export default async function ProductCard({
  productId,
  name,
  description,
  priceInCents,
  stock,
  imagePath,
}: ProductCardProps) {
  const quantityOfProductInCart = await getQuantityOfProductInCart(productId);

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="relative aspect-4/3 h-auto w-full">
        <Image src={imagePath} alt={name} fill className="object-cover" />
      </CardHeader>

      <CardContent>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex grow items-center justify-between">
        <div>{formatCurrency(priceInCents / 100)}</div>

        <AddToCartButton
          productId={productId}
          productName={name}
          productStock={stock}
          quantityOfProductInCart={quantityOfProductInCart?.quantity ?? 0}
        />
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden p-4">
      <div className="flex animate-pulse flex-col gap-4">
        <div className="aspect-4/3 w-full rounded-xl bg-gray-200" />

        <div className="h-6 w-2/3 rounded-md bg-gray-200" />

        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-gray-200" />
          <div className="da h-4 w-3/4 rounded-md bg-gray-200" />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="h-5 w-20 rounded-md bg-gray-200" />

          <div className="h-10 w-10 rounded-lg bg-gray-200" />
        </div>
      </div>
    </Card>
  );
}
