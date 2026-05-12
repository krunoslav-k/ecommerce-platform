'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mergeDuplicateImages } from '@/lib/mergeDuplicateImages';
import { ImagePlus, X } from 'lucide-react';
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

    setImages((prev) => mergeDuplicateImages(prev, newImages));
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
    <div className="space-y-4.5">
      <div className="space-y-4">
        <Label htmlFor="images">Images</Label>

        <label
          htmlFor="images"
          className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-100"
        >
          <span className="flex items-center justify-center gap-1.5">
            <ImagePlus size={18} /> Upload images
          </span>
        </label>

        <Input
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,100px)] gap-3">
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
