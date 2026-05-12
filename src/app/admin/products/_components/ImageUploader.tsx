'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ImagePreview = {
  file: File;
  preview: string;
};

export default function ImageUploader() {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const imagesRef = useRef<ImagePreview[]>([]);

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const newImages = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  }

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="images">Images</Label>

        <Input
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-25 w-25 overflow-hidden rounded-lg border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={image.preview}
              alt={image.file.name}
              className="h-full w-full object-cover"
            />

            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              className="absolute top-1 right-1 z-10"
              onClick={() => {
                URL.revokeObjectURL(image.preview);

                setImages((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
