'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type ProductImage = {
  id: string;
  url: string;
};

type ProductGalleryProps = {
  images: ProductImage[];
};

const FALLBACK_IMAGE = 'https://placehold.co/1000x1000/png';

export default function ProductGallery({ images }: ProductGalleryProps) {
  const imageUrls = useMemo(() => {
    if (images.length === 0) {
      return [FALLBACK_IMAGE];
    }

    return images.map((image) => image.url);
  }, [images]);

  const [selectedImage, setSelectedImage] = useState(imageUrls[0]);

  return (
    <div className="space-y-4">
      <Card className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={selectedImage}
          alt="Product image"
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </Card>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-3">
          {imageUrls.map((url, index) => {
            const isActive = selectedImage === url;

            return (
              <button
                key={`${url}-${index}`}
                type="button"
                aria-label={`Select product image ${index + 1}`}
                onClick={() => setSelectedImage(url)}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  isActive ? 'border-primary' : 'border-muted'
                }`}
              >
                <Image
                  src={url}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            );
          })}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
