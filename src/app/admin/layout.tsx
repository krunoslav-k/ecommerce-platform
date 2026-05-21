import Nav from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/', label: 'Store' },
  ];
  return (
    <>
      <Nav
        items={adminNavItems}
        logo={<div className="text-lg font-bold">Admin</div>}
      ></Nav>
      <div className="p-4 px-14">{children}</div>
    </>
  );
}
