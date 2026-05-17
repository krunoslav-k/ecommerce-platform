'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';

type NavProps = {
  children: React.ReactNode;
  cartButton: React.ReactNode;
};

export default function Nav({ children, cartButton }: NavProps) {
  return (
    <>
      <nav className="flex min-h-16 items-center justify-between px-4 py-2">
        <div className="flex-1"></div>

        <div className="flex justify-center gap-2 text-sm">{children}</div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Show when="signed-out">
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>

            <SignUpButton>
              <Button className="text-sm hover:bg-gray-700">Sign Up</Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            {cartButton}
            <UserButton />
          </Show>
        </div>
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
