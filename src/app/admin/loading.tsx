import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex justify-center py-6">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
}
