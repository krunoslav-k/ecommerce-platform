'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
//prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';
import { useActionState, useState } from 'react';
import { addProduct } from '../../_actions/products';
import { useFormStatus } from 'react-dom';
import ImageUploader from './ImageUploader';
import ErrorMessage from './FormError';
import { useProductForm } from '@/hooks/useProductForm';
import { cn } from '@/lib/utils';
import { useFieldErrorHiding } from '@/hooks/useFieldErrorHiding';
import { Product, ProductImage } from '@prisma/client';

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
  product?: (Product & { images: { id: string; url: string }[] }) | null;
};

export default function ProductForm({ categories, product }: ProductFormProps) {
  const [priceInCents, setPriceInCents] = useState(
    product?.priceInCents.toString()
  );
  const [categoryId, setCategoryId] = useState(product?.categoryId);
  const [state, formAction] = useActionState(addProduct, {});

  const { productName, handleNameChange, slug, handleSlugChange, slugExists } =
    useProductForm(product?.name, product?.slug);
  const { markAsModified, getFieldError } = useFieldErrorHiding(state);

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {/* NAME */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={productName}
            onChange={(e) => {
              handleNameChange(e);
              markAsModified('name');
              markAsModified('slug');
            }}
            required
          />
          <ErrorMessage error={getFieldError('name')} />
        </div>

        {/* SLUG */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              handleSlugChange(e);
              markAsModified('slug');
            }}
          />
          <ErrorMessage error={getFieldError('slug')} />

          {slugExists && (
            <p className="ml-2 text-xs text-red-500">
              This slug already exists
            </p>
          )}

          {!slugExists && slug && (
            <p className="ml-2 text-xs text-green-600">Slug is available</p>
          )}
        </div>

        {/* STOCK */}
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            name="stock"
            required
            onChange={() => markAsModified('stock')}
            defaultValue={product?.stock}
          />
          <ErrorMessage error={getFieldError('stock')} />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            onChange={() => markAsModified('description')}
            defaultValue={product?.description}
          />
          <ErrorMessage error={getFieldError('description')} />
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <Label htmlFor="priceInCents">Price</Label>
          <Input
            type="number"
            min="0"
            value={priceInCents}
            onChange={(e) => {
              setPriceInCents(e.target.value);
              markAsModified('priceInCents');
            }}
            id="priceInCents"
            name="priceInCents"
            required
          />
          <p className="ml-2 text-sm text-gray-500">
            {formatCurrency(priceInCents ? Number(priceInCents) / 100 : 0)}
          </p>
          <ErrorMessage error={getFieldError('priceInCents')} />
        </div>

        {/* CATEGORY */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={categoryId || ''}
            onValueChange={(val) => {
              setCategoryId(val);
              markAsModified('categoryId');
            }}
          >
            <SelectTrigger
              className={cn(
                'w-full',
                getFieldError('categoryId') && 'border-red-500'
              )}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent className="mt-1 p-1.5">
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="p-1.5">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="categoryId" value={categoryId} />
          <ErrorMessage error={getFieldError('categoryId')} />
        </div>
      </div>

      {/* IMAGES */}
      <div
        className="w-full space-y-2"
        onChange={() => markAsModified('images')}
      >
        <ImageUploader initialImages={product?.images} />
        <ErrorMessage error={getFieldError('images')} />
      </div>

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="hover:bg-gray-700">
      {pending ? 'Creating...' : 'Create product'}
    </Button>
  );
}
