'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';
import { useActionState, useState } from 'react';
import { addProduct } from '../../_actions/products';
import { useFormStatus } from 'react-dom';
import ImageUploader from './ImageUploader';

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
};

export default function ProductForm({ categories }: ProductFormProps) {
  const [priceInCents, setPriceInCents] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [state, formAction] = useActionState(addProduct, {});
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
            onChange={(e) => {
              const value = e.target.value;
              setProductName(value);
              if (!isSlugManuallyEdited) {
                setSlug(generateSlug(value));
              }
              setIsSlugManuallyEdited(false);
            }}
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
            onChange={(e) => {
              setIsSlugManuallyEdited(true);
              setSlug(generateSlug(e.target.value));
            }}
          />
          <ErrorMessage error={state.errors?.slug} />
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

        {/* IMAGES */}
        <div className="space-y-2">
          <ImageUploader />
          <ErrorMessage error={state.errors?.images} />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}

function ErrorMessage({ error }: { error?: string[] }) {
  if (!error?.length) return null;

  return <p className="text-sm text-red-500">{error[0]}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create product'}
    </Button>
  );
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'dj')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}
