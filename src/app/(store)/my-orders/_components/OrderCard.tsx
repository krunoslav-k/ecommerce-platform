'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function getStatusVariant(status: string) {
  switch (status) {
    case 'PAID':
      return 'default';

    case 'FAILED':
      return 'destructive';

    case 'PENDING':
      return 'secondary';

    default:
      return 'outline';
  }
}

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
      };
    };
  };
}>;

type OrderCardProps = {
  order: OrderWithItems;
  total: number;
};

export default function OrderCard({ order, total }: OrderCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-xl border bg-white shadow-sm"
    >
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            'flex items-center justify-between rounded-xl p-4 text-left transition hover:bg-gray-50',
            open && 'rounded-t-xl rounded-b-none bg-gray-100'
          )}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold">Order #{order.id.slice(-6)}</h2>

              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </div>

            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>

              <p className="font-bold">{formatCurrency(total / 100)}</p>
            </div>

            <ChevronDown
              className={cn(
                'size-5 text-gray-500 transition-transform',
                open && 'rotate-180'
              )}
            />
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-4 border-t p-4">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-3"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-gray-100">
                  <Image
                    src={item.product.images[0]?.url ?? ''}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-medium">{item.product.name}</h3>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    Price paid: {formatCurrency(item.pricePaidInCents / 100)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Item total</p>

                <p className="font-semibold">
                  {formatCurrency(
                    (item.pricePaidInCents * item.quantity) / 100
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
