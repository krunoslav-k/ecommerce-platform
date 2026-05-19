'use client';

import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '../_actions/checkout';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      const res = await createCheckoutSession();

      if ('error' in res) {
        toast.error(res.error);
        return;
      }
    });
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isPending}
      size="lg"
      className="my-4 w-full bg-sky-700 text-white hover:bg-sky-800"
    >
      <ShoppingBag /> Checkout
    </Button>
  );
}
