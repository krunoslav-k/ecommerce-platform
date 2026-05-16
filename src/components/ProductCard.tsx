import { formatCurrency } from '@/lib/formatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type ProductCardProps = {
  name: string;
  description: string;
  priceInCents: number;
  imagePath: string;
};

export default function ProductCard({
  name,
  description,
  priceInCents,
  imagePath,
}: ProductCardProps) {
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
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon">
                <ShoppingCart />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to cart</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
