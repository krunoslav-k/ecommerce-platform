'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../_actions/cart';
import { toast } from 'sonner';

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  productStock: number;
  quantityOfProductInCart: number;
};

export default function AddToCartButton({
  productId,
  productName,
  productStock,
  quantityOfProductInCart,
  ...props
}: AddToCartButtonProps) {
  function handleAddToCart(productId: string) {
    addToCart(productId);
    toast.success(`Item ${productName || ''} added to cart`);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="hover:bg-gray-800"
          disabled={quantityOfProductInCart >= productStock}
          onClick={() => handleAddToCart(productId)}
          {...props}
        >
          <ShoppingCart />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to cart</p>
      </TooltipContent>
    </Tooltip>
  );
}
