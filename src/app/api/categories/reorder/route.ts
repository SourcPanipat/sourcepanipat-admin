import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { items } = body; // Array of { id: string, sortOrder: number }

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Items array required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      for (const item of items) {
        if (item.id && item.sortOrder !== undefined) {
          await db
            .update(categories)
            .set({ sortOrder: Number(item.sortOrder) })
            .where(eq(categories.id, item.id));
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Category rankings updated successfully' });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
