import { AddProductState } from '@/app/admin/_actions/products';
import { useState } from 'react';

type FormFields =
  | 'name'
  | 'description'
  | 'slug'
  | 'priceInCents'
  | 'stock'
  | 'categoryId'
  | 'images';

export function useFieldErrorHiding(state: AddProductState) {
  const [prevState, setPrevState] = useState(state);
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  if (state !== prevState) {
    setPrevState(state);
    setModifiedFields(new Set());
  }

  function markAsModified(fieldName: string) {
    if (modifiedFields.has(fieldName)) return;
    setModifiedFields((prev) => new Set(prev).add(fieldName));
  }

  function getFieldError(fieldName: FormFields) {
    const errors = state.errors as Record<string, string[] | undefined>;

    return !modifiedFields.has(fieldName) ? errors?.[fieldName] : undefined;
  }

  return { markAsModified, getFieldError };
}
