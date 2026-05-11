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

  const [state, formAction] = useActionState(addProduct, {});

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {/* NAME */}
        <div className="space-y-2">
          <Label>Name</Label>
          <Input name="name" required />
          <ErrorMessage error={state.errors?.name} />
        </div>

        {/* SLUG */}
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input name="slug" required />
          <ErrorMessage error={state.errors?.slug} />
        </div>

        {/* STOCK */}
        <div className="space-y-2">
          <Label>Stock</Label>
          <Input type="number" min="0" name="stock" required />
          <ErrorMessage error={state.errors?.stock} />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea name="description" required />
          <ErrorMessage error={state.errors?.description} />
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <Label>Price (€)</Label>
          <Input
            type="number"
            min="0"
            value={priceInCents}
            onChange={(e) => setPriceInCents(e.target.value)}
            name="priceInCents"
            required
          />
          <p className="text-sm text-gray-500">
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

            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
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
