'use client';

import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/app/(store)/_actions/checkout';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutButton() {
  return (
    <Button
      onClick={() => createCheckoutSession()}
      size="lg"
      className="my-4 w-full bg-sky-700 text-white hover:bg-sky-800"
    >
      <ShoppingBag /> Checkout
    </Button>
  );
}
