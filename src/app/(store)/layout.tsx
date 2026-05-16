import Nav, { NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/categories">Categories</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/my-orders">My Orders</NavLink>
        <NavLink href="/admin">Admin</NavLink> {/* placeholder button */}
      </Nav>
      <div className="p-4 px-14">{children}</div>
    </>
  );
}
