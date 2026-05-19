import { db } from '@/db/prisma';
import TitleLink from '../_components/TitleLink';
import ProductGrid from '../_components/ProductGrid';
import { getProductsByCategory } from '../lib/products';

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <TitleLink href={`/categories/${category.slug}`}>
            {category.name}
          </TitleLink>

          <ProductGrid
            productsFetcher={() => getProductsByCategory(category.id)}
          />
        </div>
      ))}
    </div>
  );
}
