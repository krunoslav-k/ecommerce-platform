'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../_actions/cart';

type AddToCartButtonProps = {
  productId: string;
  productStock: number;
  quantityOfProductInCart: number;
};

export default function AddToCartButton({
  productId,
  productStock,
  quantityOfProductInCart,
}: AddToCartButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="hover:bg-gray-800"
          disabled={quantityOfProductInCart >= productStock}
          onClick={() => addToCart(productId)}
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
