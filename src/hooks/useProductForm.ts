'use client';

import generateSlug from '@/lib/generateSlug';
import { useEffect, useState } from 'react';

export function useProductForm() {
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-slug?slug=${slug}`, {
          signal: controller.signal,
        });

        const data = await res.json();

        setSlugExists(data.exists);
      } catch (err) {}
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setProductName(value);

    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(value));
      setSlugExists(false);
    }
    setIsSlugManuallyEdited(false);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSlugManuallyEdited(true);

    const value = generateSlug(e.target.value);
    setSlug(value);

    setSlugExists(false);
  }

  return { productName, handleNameChange, slug, handleSlugChange, slugExists };
}
