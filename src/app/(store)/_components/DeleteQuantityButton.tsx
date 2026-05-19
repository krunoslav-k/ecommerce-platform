'use client';

import { Button } from '@/components/ui/button';
import { Minus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteButton() {
  return (
    <Button
      className="flex h-7 w-7 items-center justify-center bg-white transition-colors hover:bg-slate-50"
      onClick={() => toast.error('Item removed from cart')}
    >
      <Minus className="h-3.5 w-3.5 text-slate-600" />
    </Button>
  );
}
