'use client';

import generateSlug from '@/lib/generateSlug';
import { useEffect, useState } from 'react';

type UseSlugFormProps = {
  initialName?: string;
  initialSlug?: string;
  checkEndpoint: string;
  type: 'product' | 'category';
};

export function useForm({
  initialName = '',
  initialSlug = '',
  checkEndpoint,
  type,
}: UseSlugFormProps) {
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [apiSlugExists, setApiSlugExists] = useState(false);

  const isEditMode = Boolean(initialSlug);

  const slugExists = apiSlugExists && (!isEditMode || slug !== initialSlug);

  useEffect(() => {
    if (!slug || slug === initialSlug) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${checkEndpoint}?slug=${slug}&type=${type}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        setApiSlugExists(data.exists);
      } catch {}
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug, initialSlug, checkEndpoint, type]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setName(value);

    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(value));
    }

    setIsSlugManuallyEdited(false);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(e.target.value));
  }

  return {
    name,
    setName,
    slug,
    setSlug,
    handleNameChange,
    handleSlugChange,
    slugExists,
  };
}
