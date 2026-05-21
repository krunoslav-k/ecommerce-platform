import { NextResponse } from 'next/server';
import { db } from '@/db/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  if (!slug || !type) {
    return NextResponse.json({ exists: false });
  }

  let exists = false;

  if (type === 'product') {
    exists = !!(await db.product.findUnique({
      where: { slug },
    }));
  }

  if (type === 'category') {
    exists = !!(await db.category.findUnique({
      where: { slug },
    }));
  }

  return NextResponse.json({ exists });
}
