'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type InitialImage = {
  id: string;
  url: string;
};

type ImagePreview = {
  id?: string;
  file?: File;
  preview: string;
};

export default function ImageUploader({
  initialImages = [],
}: {
  initialImages?: InitialImage[];
}) {
  const [images, setImages] = useState<ImagePreview[]>(() =>
    initialImages.map((img) => ({ id: img.id, preview: img.url }))
  );
  const imagesRef = useRef<ImagePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (!image.id) URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const newImages = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const existingImages = prev.filter((img) => img.id);
      const previousNewImages = prev.filter((img) => !img.id);

      const mergedNew = [...previousNewImages, ...newImages];

      const finalImages = [...existingImages, ...mergedNew];

      syncInputFiles(mergedNew.map((img) => img.file as File));

      return finalImages;
    });
  }

  function handleRemoveImage(indexToRemove: number) {
    setImages((prev) => {
      const imageToRemove = prev[indexToRemove];

      if (!imageToRemove.id) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const updatedImages = prev.filter((_, i) => i !== indexToRemove);

      const remainingNewFiles = updatedImages
        .filter((img) => img.file)
        .map((img) => img.file as File);

      syncInputFiles(remainingNewFiles);

      return updatedImages;
    });
  }

  function syncInputFiles(files: File[]) {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
  }

  return (
    <div className="space-y-4.5">
      <div className="space-y-4">
        <Label htmlFor="images">Images</Label>

        <label
          htmlFor="images"
          className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-100"
        >
          <span className="flex items-center justify-center gap-1.5">
            <ImagePlus size={18} /> {'Upload images'}
          </span>
        </label>

        <Input
          ref={inputRef}
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          className="hidden"
        />

        {images.map((img) =>
          img.id ? (
            <input
              key={img.id}
              type="hidden"
              name="existingImageIds"
              value={img.id}
            />
          ) : null
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,100px)] gap-3">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="relative h-25 w-25 overflow-hidden rounded-lg border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={image.preview}
              alt={image.file?.name || 'Product image'}
              className="h-full w-full object-cover"
            />

            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              className="absolute top-1 right-1 z-10"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
