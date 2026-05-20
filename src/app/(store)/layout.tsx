import Nav from '@/components/Nav';
import { isCurrentUserAdmin } from './lib/users';
import CartNavbarButton from './_components/CartNavButton';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isCurrentUserAdmin();
  const navItems = (isAdmin: boolean) => [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/products', label: 'Products' },
    { href: '/my-orders', label: 'My Orders' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <>
      <Nav
        items={navItems(isAdmin)}
        logo={<div className="text-lg font-bold">TechStore</div>}
        cartButton={<CartNavbarButton />}
      ></Nav>

      <div className="flex flex-col p-4 px-14">{children}</div>
    </>
  );
}
