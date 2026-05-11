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
import { useState } from 'react';
import { addProduct } from '../../_actions/products';

export default function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<string>('');
  const categories = [
    { name: 'laptops', id: '0' },
    { name: 'phones', id: '1' },
  ]; // dummy data for testing UI

  return (
    <form action={addProduct} className="space-y-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            type="number"
            step="1"
            min="0"
            id="stock"
            name="stock"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceInCents">Price in cents</Label>
          <Input
            type="number"
            step="1"
            min="0"
            id="priceInCents"
            name="priceInCents"
            value={priceInCents}
            onChange={(e) => setPriceInCents(e.target.value)}
            required
          />
          <p className="ml-2.5 text-sm text-gray-500">
            {formatCurrency(priceInCents ? Number(priceInCents) / 100 : 0)}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>

          <Select name="categoryId">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent className="p-1.5">
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="p-1.5"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Images</Label>

          <Input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/*"
            required
          />
        </div>
      </div>

      <Button type="submit">Create product</Button>
    </form>
  );
}
