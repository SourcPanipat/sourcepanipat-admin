import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { categories, subCategories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { CategoryItem } from '@/types';

export async function GET() {
  try {
    if (isDatabaseConfigured()) {
      const catRows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
      const subRows = await db.select().from(subCategories);

      const result = catRows.map((cat) => {
        const subs = subRows.filter((s) => s.categoryId === cat.id);
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          iconName: cat.iconName,
          logoUrl: cat.logoUrl || undefined,
          sortOrder: cat.sortOrder,
          isActive: Boolean(cat.isActive),
          subCategoriesCount: subs.length,
          subCategories: subs.map((s) => ({
            id: s.id,
            categoryId: s.categoryId,
            name: s.name,
            slug: s.slug,
            isActive: Boolean(s.isActive),
          })),
        };
      });

      return NextResponse.json({ success: true, categories: result, source: 'turso_db' });
    }

    return NextResponse.json({ success: true, categories: [], source: 'fallback' });
  } catch (error: any) {
    console.error('Error fetching categories in admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, iconName = 'Layers', logoUrl, sortOrder = 1, isActive = true } = body;

    const id = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalSlug = slug || id;

    if (isDatabaseConfigured()) {
      await db.insert(categories).values({
        id,
        name,
        slug: finalSlug,
        iconName,
        logoUrl: logoUrl || null,
        sortOrder: Number(sortOrder) || 1,
        isActive: Boolean(isActive),
      });
    }

    const created: CategoryItem = {
      id,
      name,
      slug: finalSlug,
      iconName,
      logoUrl,
      sortOrder: Number(sortOrder) || 1,
      isActive: Boolean(isActive),
      subCategoriesCount: 0,
    };

    return NextResponse.json({ success: true, category: created });
  } catch (error: any) {
    console.error('Error creating category in admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, iconName, logoUrl, sortOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (iconName !== undefined) updateData.iconName = iconName;
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
      if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      await db.update(categories).set(updateData).where(eq(categories.id, id));
    }

    return NextResponse.json({ success: true, message: 'Category updated successfully' });
  } catch (error: any) {
    console.error('Error updating category in admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      // Delete sub-categories first
      await db.delete(subCategories).where(eq(subCategories.categoryId, id));
      await db.delete(categories).where(eq(categories.id, id));
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category in admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
