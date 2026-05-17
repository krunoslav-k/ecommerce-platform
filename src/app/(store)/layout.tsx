import Nav, { NavLink } from '@/components/Nav';
import CartNavbarButton from './_components/CartNavButton';

export const dynamic = 'force-dynamic';

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav cartButton={<CartNavbarButton></CartNavbarButton>}>
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
