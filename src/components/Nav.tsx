'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export default function Nav({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex justify-center gap-2 px-4 py-2 text-sm">
        {children}
      </nav>
      <hr />
    </>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        'p-2 text-[1rem] font-medium outline-none md:text-sm',
        'text-gray-500 hover:text-black focus-visible:text-black',
        'transition-colors duration-300 ease-in-out',
        pathname === props.href ? 'text-black' : 'text-gray-500'
      )}
    />
  );
}
