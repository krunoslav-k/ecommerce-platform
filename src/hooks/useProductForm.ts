'use client';

import generateSlug from '@/lib/generateSlug';
import { useEffect, useState } from 'react';

export function useProductForm(enteredName?: string, enteredSlug?: string) {
  const [productName, setProductName] = useState(enteredName || '');
  const [slug, setSlug] = useState(enteredSlug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [apiSlugExists, setApiSlugExists] = useState(false);
  const slugExists = slug !== enteredSlug && apiSlugExists;

  useEffect(() => {
    if (!slug || slug === enteredSlug) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-slug?slug=${slug}`, {
          signal: controller.signal,
        });

        const data = await res.json();

        setApiSlugExists(data.exists);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {}
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug, enteredSlug]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setProductName(value);

    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(value));
    }
    setIsSlugManuallyEdited(false);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSlugManuallyEdited(true);

    const value = generateSlug(e.target.value);
    setSlug(value);
  }

  return { productName, handleNameChange, slug, handleSlugChange, slugExists };
}
