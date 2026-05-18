import PageHeader from '@/app/admin/_components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentUser } from '@/lib/auth';
import { getCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/formatters';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import { deleteItemFromCart, updateCartItemQuantity } from '../_actions/cart';
import Link from 'next/link';

export default async function CartPage() {
  const userId = await getCurrentUser();

  const cart = await getCart(userId);

  const subtotalInCents =
    cart?.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.priceInCents;
    }, 0) || 0;

  return (
    <>
      <PageHeader title="My Cart" number={''} subtitle={''}></PageHeader>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex w-full flex-col gap-2.5 lg:w-3/4">
          {cart?.items.map((item) => {
            return (
              <div
                key={item.productId}
                className="grid grid-cols-1 items-center gap-4 rounded-lg border p-4 md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_auto] md:grid-rows-[auto_1fr] md:items-start md:gap-x-4 md:gap-y-1"
              >
                <div className="flex h-full max-h-30 items-center justify-center md:col-span-1 md:col-start-1 md:row-span-2 md:max-h-25 md:self-center">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="max-h-full max-w-full object-contain"
                    height={100}
                    width={100}
                  />
                </div>
                <div className="text-lg font-bold md:col-span-2 md:col-start-2 md:text-base">
                  {item.product.name}
                </div>
                <div className="wrap-break-words line-clamp-3 w-full min-w-0 pr-2 text-sm text-gray-500 md:col-span-2 md:col-start-2">
                  {item.product.description}
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-3 md:mt-0 md:contents md:border-0 md:pt-0">
                  <div className="md:col-start-4">
                    <span className="block text-xs text-gray-400">Each</span>
                    <span className="font-medium md:font-normal">
                      {formatCurrency(item.product.priceInCents / 100)}
                    </span>
                  </div>

                  <div className="md:col-start-5">
                    <span className="block text-xs text-gray-400">
                      Quantity
                    </span>
                    <QuantityPicker
                      quantity={item.quantity}
                      productId={item.productId}
                    />
                  </div>

                  <div className="md:col-start-6">
                    <span className="block text-xs text-gray-400">Total</span>
                    <span className="font-semibold text-black md:font-semibold">
                      {formatCurrency(
                        (item.product.priceInCents / 100) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
                <RemoveFromCartButton productId={item.productId} />
              </div>
            );
          })}
        </div>

        <TotalSummaryCard subtotalInCents={subtotalInCents} />
      </div>
    </>
  );
}

function QuantityPicker({
  quantity,
  productId,
}: {
  quantity: number;
  productId: string;
}) {
  return (
    <div className="flex w-fit items-center overflow-hidden rounded-md border border-slate-200">
      <form action={updateCartItemQuantity.bind(null, productId, quantity - 1)}>
        <Button className="flex h-7 w-7 items-center justify-center bg-white transition-colors hover:bg-slate-50">
          <Minus className="h-3.5 w-3.5 text-slate-600" />
        </Button>
      </form>

      <div className="flex h-7 w-8 items-center justify-center border-x border-slate-200 bg-slate-50 text-sm font-medium text-slate-900">
        {quantity}
      </div>

      <form action={updateCartItemQuantity.bind(null, productId, quantity + 1)}>
        <Button className="flex h-7 w-7 items-center justify-center bg-white transition-colors hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5 text-slate-600" />
        </Button>
      </form>
    </div>
  );
}

function RemoveFromCartButton({ productId }: { productId: string }) {
  return (
    <div className="cursor-pointer justify-self-end p-2 text-center md:col-start-7 md:px-2">
      <form action={deleteItemFromCart.bind(null, productId)}>
        <Button type="submit" size="icon-sm" variant="destructive">
          <X />
        </Button>
      </form>
    </div>
  );
}

function TotalSummaryCard({ subtotalInCents }: { subtotalInCents: number }) {
  return (
    <div className="flex h-fit w-full flex-col items-center gap-4 rounded-lg bg-zinc-50 px-6 py-3.5 text-sm lg:w-1/3">
      <h2 className="mb-4 self-start text-lg font-bold">Summary</h2>

      <div className="border-input bg-background focus-within:ring-ring borderfocus-within:ring-1 flex h-10 w-full max-w-sm items-center overflow-hidden rounded-md">
        <Input
          type="text"
          placeholder="Promo code"
          className="h-full border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button className="h-full rounded-l-none bg-gray-600 text-sm hover:bg-gray-700">
          Submit
        </Button>
      </div>

      <div className="flex w-full items-center justify-between">
        <div>Shipping cost</div>
        <div>3,99€</div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div>Tax</div>
        <div>{formatCurrency((0.25 * subtotalInCents) / 100)}</div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div>Subtotal</div>
        <div>{formatCurrency(subtotalInCents / 100)}</div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div>Discount</div>
        <div>- 0€</div>
      </div>

      <hr className="border-0.25 w-full border-gray-200" />

      <div className="flex w-full items-center justify-between">
        <div>Total</div>
        <div className="font-bold">
          {formatCurrency(subtotalInCents / 100 + 3.99)}
        </div>
      </div>

      <Button
        size="lg"
        className="my-4 w-full bg-sky-700 text-white hover:bg-sky-800"
        asChild
      >
        <Link href="/checkout">
          <ShoppingBag /> Checkout
        </Link>
      </Button>
    </div>
  );
}
