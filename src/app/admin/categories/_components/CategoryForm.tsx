'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useFieldErrorHiding } from '@/hooks/useFieldErrorHiding';
import { Category } from '@prisma/client';
import ErrorMessage from '../../_components/FormError';
import { addCategory, editCategory } from '../../_actions/categories';
import { useForm } from '@/hooks/useForm';

type CategoryFormProps = {
  category?: Category | null;
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const initialState = {
    errors: {
      name: undefined,
      slug: undefined,
    },
  };

  const [state, formAction] = useActionState(
    category?.id ? editCategory.bind(null, category.id) : addCategory,
    initialState
  );

  const { markAsModified, getFieldError } = useFieldErrorHiding(state);

  const {
    name: categoryName,
    handleNameChange,
    slug,
    handleSlugChange,
    slugExists,
  } = useForm({
    initialName: category?.name,
    initialSlug: category?.slug,
    checkEndpoint: '/api/check-slug',
  });

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* NAME */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            required
            value={categoryName}
            onChange={(e) => {
              handleNameChange(e);

              markAsModified('name');
              markAsModified('slug');
            }}
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

          {slugExists && slug !== category?.slug && (
            <p className="ml-2 text-xs text-red-500">
              This slug already exists
            </p>
          )}

          {!slugExists && slug && (
            <p className="ml-2 text-xs text-green-600">Slug is available</p>
          )}
        </div>
      </div>

      <SubmitButton isEditing={!!category} />
    </form>
  );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="hover:bg-gray-700">
      {pending
        ? isEditing
          ? 'Updating...'
          : 'Creating...'
        : isEditing
          ? 'Update category'
          : 'Create category'}
    </Button>
  );
}
