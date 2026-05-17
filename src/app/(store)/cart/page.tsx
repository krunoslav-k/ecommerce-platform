import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { getCart } from '@/lib/cart';

export default async function CartPage() {
  const userId = await getCurrentUser();

  const cart = await getCart(userId);

  return (
    <>
      <div className="space-y-4">
        {cart?.items.map((item) => (
          <div key={item.id}>
            <Card>
              <CardHeader>
                <CardTitle>{item.product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.quantity}</CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
