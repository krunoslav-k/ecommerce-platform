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

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
};

export default function ProductForm({ categories }: ProductFormProps) {
  const [priceInCents, setPriceInCents] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [state, formAction] = useActionState(addProduct, {});
  const { productName, handleNameChange, slug, handleSlugChange, slugExists } =
    useProductForm();

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {/* NAME */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={productName}
            onChange={handleNameChange}
            required
          />
          <ErrorMessage error={state.errors?.name} />
        </div>

        {/* SLUG */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={handleSlugChange}
          />
          <ErrorMessage error={state.errors?.slug} />

          {slugExists && !state.errors?.slug?.length && (
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
          <Input id="stock" type="number" min="0" name="stock" required />
          <ErrorMessage error={state.errors?.stock} />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required />
          <ErrorMessage error={state.errors?.description} />
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <Label htmlFor="priceInCents">Price</Label>
          <Input
            type="number"
            min="0"
            value={priceInCents}
            onChange={(e) => setPriceInCents(e.target.value)}
            id="priceInCents"
            name="priceInCents"
            required
          />
          <p className="ml-2 text-sm text-gray-500">
            {formatCurrency(priceInCents ? Number(priceInCents) / 100 : 0)}
          </p>
          <ErrorMessage error={state.errors?.priceInCents} />
        </div>

        {/* CATEGORY */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            name="categoryId"
            value={categoryId}
            onValueChange={setCategoryId}
          >
            <SelectTrigger className="w-full">
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
          <ErrorMessage error={state.errors?.categoryId} />
        </div>
      </div>

      {/* IMAGES */}
      <div className="w-full space-y-2">
        <ImageUploader />
        <ErrorMessage error={state.errors?.images} />
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
