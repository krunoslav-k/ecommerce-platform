import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-4 self-center rounded-lg p-6 shadow-md lg:max-w-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
        <Check color="white" className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-bold">Payment Successful</h2>
      <p className="text-center text-gray-600">
        Thank you for your payment. Your order will be processed shortly.
      </p>
      <Button size="lg" asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
