import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { subCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { SubCategoryItem } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, name, slug, isActive = true } = body;

    if (!categoryId || !name) {
      return NextResponse.json({ success: false, error: 'CategoryId and Name required' }, { status: 400 });
    }

    const id = slug || `${categoryId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isDatabaseConfigured()) {
      await db.insert(subCategories).values({
        id,
        categoryId,
        name,
        slug: finalSlug,
        defaultMoq: 25,
        isActive: Boolean(isActive),
      });
    }

    const newSub: SubCategoryItem = {
      id,
      categoryId,
      name,
      slug: finalSlug,
      isActive: Boolean(isActive),
    };

    return NextResponse.json({ success: true, subCategory: newSub });
  } catch (error: any) {
    console.error('Error creating sub-category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'SubCategory ID required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      await db.update(subCategories).set(updateData).where(eq(subCategories.id, id));
    }

    return NextResponse.json({ success: true, message: 'Sub-category updated' });
  } catch (error: any) {
    console.error('Error updating sub-category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'SubCategory ID required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      await db.delete(subCategories).where(eq(subCategories.id, id));
    }

    return NextResponse.json({ success: true, message: 'Sub-category deleted' });
  } catch (error: any) {
    console.error('Error deleting sub-category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
