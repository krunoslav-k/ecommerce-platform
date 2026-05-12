import { NextResponse } from 'next/server';
import { db } from '@/db/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ exists: false });
  }

  const product = await db.product.findUnique({
    where: { slug },
  });

  return NextResponse.json({ exists: !!product });
}
