'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteButton() {
  return (
    <Button
      type="submit"
      size="icon-sm"
      variant="destructive"
      onClick={() => toast.error('Item removed from cart')}
    >
      <X />
    </Button>
  );
}
