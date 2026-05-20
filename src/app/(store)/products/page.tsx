import ProductGrid from '../_components/ProductGrid';
import { getAllProducts } from '../lib/products';

export default function ProductsPage() {
  return <ProductGrid productsFetcher={getAllProducts} />;
}
