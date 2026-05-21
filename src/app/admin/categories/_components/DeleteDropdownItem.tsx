'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '../../_actions/categories';

export default function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteCategory(id);
          router.refresh();
        })
      }
    >
      <Trash /> Delete
    </DropdownMenuItem>
  );
}
