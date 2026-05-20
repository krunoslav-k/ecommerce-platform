'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Separator } from './ui/separator';

type NavProps = {
  items: { href: string; label: string }[];
  cartButton?: React.ReactNode;
  logo?: React.ReactNode;
};

export default function Nav({ items, cartButton, logo }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="relative flex h-16 items-center justify-between px-4">
        {/* MOBILE */}
        <div className="flex flex-1 items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="pt-12">
              <SheetTitle className="sr-only">Navigation</SheetTitle>

              <div className="flex flex-col">
                {items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block w-full px-6 py-5 font-medium transition-colors',
                          'border-b border-gray-100 hover:bg-gray-50 hover:text-black',
                          isActive ? 'bg-gray-100 text-black' : 'text-gray-500'
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          <div className="absolute left-1/2 -translate-x-1/2">{logo}</div>
        </div>

        {/* DESKTOP LOGO */}
        <div className="hidden flex-1 md:flex">{logo}</div>

        {/* DESKTOP NAV */}
        <div className="hidden flex-1 justify-center gap-2 text-sm md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'p-2 font-medium text-nowrap transition-colors',
                pathname === item.href
                  ? 'text-black'
                  : 'text-gray-500 hover:text-black'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Show when="signed-out">
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>

            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            {cartButton ? cartButton : ''}
            <UserButton />
          </Show>
        </div>
      </nav>

      <hr />
    </>
  );
}
