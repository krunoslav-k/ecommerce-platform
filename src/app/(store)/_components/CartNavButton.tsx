import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { getCart } from '@/lib/cart';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default async function CartNavbarButton() {
  const userId = await getCurrentUser();

  const cart = await getCart(userId);

  const count =
    cart?.items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0) ?? 0;

  return (
    <Button variant="ghost" asChild>
      <Link href="/cart">
        <ShoppingCart /> {count}{' '}
      </Link>
    </Button>
  );
}
