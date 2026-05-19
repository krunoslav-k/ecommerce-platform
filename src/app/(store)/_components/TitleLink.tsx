'use client';

import Link from 'next/link';

type TitleLinkProps = {
  children: React.ReactNode;
  href: string;
};

export default function TitleLink({ children, href }: TitleLinkProps) {
  return (
    <div className="mb-8 w-fit">
      <Link href={href}>
        <h1 className="text-2xl font-bold">{children}</h1>
      </Link>
    </div>
  );
}
