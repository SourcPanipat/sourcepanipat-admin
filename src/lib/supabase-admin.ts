import { turso } from './turso';
import { createClient } from '@supabase/supabase-js';
import { SellerApplicant, AdminBaleListingItem, AccountStatus, DashboardKpiMetrics } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqkbiugtxpnjmkeigdnl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// Helper: map Turso row to SellerApplicant
export function mapDbSellerToApplicant(row: any): SellerApplicant {
  let primaryTypes: string[] = [];
  try {
    if (typeof row.primary_inventory_types === 'string') {
      primaryTypes = JSON.parse(row.primary_inventory_types);
    } else if (Array.isArray(row.primary_inventory_types)) {
      primaryTypes = row.primary_inventory_types;
    }
  } catch (e) {}

  return {
    id: row.id,
    fullName: row.full_name || '',
    phone: row.phone || '',
    email: row.email || '',
    businessName: row.business_name || '',
    godownZone: row.godown_zone || 'Sanoli Road Godown Hub',
    yardAddress: row.yard_address || '',
    primaryInventoryTypes: primaryTypes,
    logoUrl: row.logo_url || undefined,
    gstin: row.gstin || undefined,
    isGstinRegistered: Boolean(row.is_gstin_registered),
    bankAccountNumber: row.bank_account_number || '',
    bankIfscCode: row.bank_ifsc_code || '',
    accountHolderName: row.account_holder_name || '',
    bankName: row.bank_name || '',
    gstDocUrl: row.gst_doc_url || undefined,
    yardPhotoUrl: row.yard_photo_url || undefined,
    verificationStatus: row.verification_status || 'pending_approval',
    accountStatus: (row.account_status as AccountStatus) || 'active',
    rejectionReason: row.rejection_reason || undefined,
    approvedAt: row.approved_at || undefined,
    maskedCode: row.masked_code || '#PNP-001',
    assignedMaskedCode: row.masked_code || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    appliedAt: row.created_at || new Date().toISOString(),
  };
}


// Helper: map Turso row to AdminBaleListingItem
export function mapDbListingToAdminItem(row: any, sellerRow?: any): AdminBaleListingItem {
  let gallery: string[] = [];
  let videos: string[] = [];
  let photos: string[] = [];

  try {
    if (typeof row.gallery_images === 'string') gallery = JSON.parse(row.gallery_images);
    else if (Array.isArray(row.gallery_images)) gallery = row.gallery_images;
  } catch (e) {}

  try {
    if (typeof row.videos === 'string') videos = JSON.parse(row.videos);
    else if (Array.isArray(row.videos)) videos = row.videos;
  } catch (e) {}

  try {
    if (typeof row.photos === 'string') photos = JSON.parse(row.photos);
    else if (Array.isArray(row.photos)) photos = row.photos;
  } catch (e) {}

  const seller = sellerRow ? mapDbSellerToApplicant(sellerRow) : undefined;

  return {
    id: row.id,
    slug: row.slug,
    sellerId: row.seller_id,
    sellerMaskedCode: seller?.assignedMaskedCode || row.masked_code || '#PNP-001',
    sellerBusinessName: seller?.businessName || row.business_name || 'Panipat Godown Hub',
    sellerGodownZone: seller?.godownZone || row.godown_zone || 'Sanoli Road Godown Hub',
    categoryId: row.category_id || 'winter-jackets-outerwear',
    subCategoryId: row.sub_category_id || 'heavy-puffers',
    categoryLabel: row.category_label || 'Wholesale Textiles',
    title: row.title,
    shortDescription: row.short_description || '',
    sourcingMode: row.sourcing_mode || 'both',
    originCountry: row.origin_country || 'South Korea',
    originFlag: row.origin_flag || 'KR',
    thumbnailUrl: row.thumbnail_url || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    galleryImages: gallery,
    weightKg: row.weight_kg ?? 80,
    estimatedPieceCount: row.estimated_piece_count ?? 70,
    sealedBalePrice: row.sealed_bale_price ?? 30000,
    curatedPiecePrice: row.curated_piece_price ?? 450,
    curatedMoq: row.curated_moq ?? 25,
    gradeA: row.grade_a ?? 85,
    gradeB: row.grade_b ?? 12,
    gradeC: row.grade_c ?? 3,
    videos: videos.map((url, idx) => ({
      id: `vid-${idx}`,
      type: 'opening_inspection' as const,
      grade: 'Grade A' as const,
      videoUrl: url,
      durationSeconds: 30,
      label: idx === 0 ? 'Bale Wire-Cut Inspection' : 'Core Stack Quality Check',
      description: 'Verified 30s uncut Panipat godown opening preview',
    })),
    photos: photos,
    godownBatchId: row.godown_batch_id || 'BATCH-SANOLI-2026',
    qcVerified: Boolean(row.qc_verified),
    inStockCount: row.in_stock_count ?? 1,
    fabricComposition: row.fabric_composition || 'Premium Graded Fabric',
    expectedGrossMargin: row.expected_gross_margin || '3.5x - 5.0x Margin',
    status: row.status || 'pending_approval',
    pendingEditJson: typeof row.pending_edit_json === 'string' ? row.pending_edit_json : JSON.stringify(row.pending_edit_json || null),
    rejectionReason: row.rejection_reason || undefined,
    isEdited: Boolean(row.pending_edit_json),
    statusUpdatedAt: row.updated_at,
    createdAt: row.created_at || new Date().toISOString(),
  };
}


// -------------------------------------------------------------
// ADMIN ACTIONS: DASHBOARD KPIS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function getDashboardKpiMetricsFromDb(): Promise<DashboardKpiMetrics> {
  try {
    const [sellersRes, listingsRes, ordersRes] = await Promise.all([
      turso.execute("SELECT verification_status, account_status FROM sellers;"),
      turso.execute("SELECT status FROM listings;"),
      turso.execute("SELECT escrow_status, total_amount, platform_fee FROM escrow_orders;"),
    ]);

    const totalSellers = sellersRes.rows.length;
    const pendingSellers = sellersRes.rows.filter(r => r.verification_status === 'pending_approval').length;
    const approvedSellers = sellersRes.rows.filter(r => r.verification_status === 'approved').length;

    const totalListings = listingsRes.rows.length;
    const pendingListings = listingsRes.rows.filter(r => r.status === 'pending_approval').length;
    const approvedListings = listingsRes.rows.filter(r => r.status === 'approved').length;

    const totalOrders = ordersRes.rows.length;
    let totalEscrowVolume = 0;
    let totalPlatformRevenue = 0;

    ordersRes.rows.forEach((r: any) => {
      totalEscrowVolume += Number(r.total_amount || 0);
      totalPlatformRevenue += Number(r.platform_fee || 0);
    });

    return {
      totalSellers,
      pendingSellers,
      approvedSellers,
      totalListings,
      pendingListings,
      approvedListings,
      totalOrders,
      totalEscrowVolume,
      totalPlatformRevenue,
      escrowLockedCount: ordersRes.rows.filter((r: any) => r.escrow_status === 'ESCROW_LOCKED').length,
    };
  } catch (err) {
    console.error('getDashboardKpiMetricsFromDb Turso exception:', err);
    return {
      totalSellers: 0,
      pendingSellers: 0,
      approvedSellers: 0,
      totalListings: 0,
      pendingListings: 0,
      approvedListings: 0,
      totalOrders: 0,
      totalEscrowVolume: 0,
      totalPlatformRevenue: 0,
      escrowLockedCount: 0,
    };
  }
}

// -------------------------------------------------------------
// ADMIN ACTIONS: SELLERS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function getAllSellersFromDb(limit = 100): Promise<SellerApplicant[]> {
  try {
    const res = await turso.execute({
      sql: 'SELECT * FROM sellers ORDER BY created_at DESC LIMIT :limit;',
      args: { limit },
    });
    return res.rows.map(mapDbSellerToApplicant);
  } catch (err) {
    console.error('getAllSellersFromDb Turso exception:', err);
    return [];
  }
}

export async function approveSellerInDb(sellerId: string, assignedMaskedCode: string): Promise<SellerApplicant | null> {
  const now = new Date().toISOString();
  await turso.execute({
    sql: `
      UPDATE sellers SET
        verification_status = 'approved',
        masked_code = :masked_code,
        approved_at = :approved_at,
        rejection_reason = NULL
      WHERE id = :id;
    `,
    args: {
      id: sellerId,
      masked_code: assignedMaskedCode,
      approved_at: now,
    },
  });

  const res = await turso.execute({
    sql: 'SELECT * FROM sellers WHERE id = :id LIMIT 1;',
    args: { id: sellerId },
  });

  return res.rows.length > 0 ? mapDbSellerToApplicant(res.rows[0]) : null;
}

export async function rejectSellerInDb(sellerId: string, rejectionReason: string): Promise<SellerApplicant | null> {
  await turso.execute({
    sql: `
      UPDATE sellers SET
        verification_status = 'rejected',
        rejection_reason = :rejection_reason
      WHERE id = :id;
    `,
    args: {
      id: sellerId,
      rejection_reason: rejectionReason,
    },
  });

  const res = await turso.execute({
    sql: 'SELECT * FROM sellers WHERE id = :id LIMIT 1;',
    args: { id: sellerId },
  });

  return res.rows.length > 0 ? mapDbSellerToApplicant(res.rows[0]) : null;
}

export async function updateSellerAccountStatusInDb(sellerId: string, accountStatus: AccountStatus): Promise<SellerApplicant | null> {
  await turso.execute({
    sql: `UPDATE sellers SET account_status = :account_status WHERE id = :id;`,
    args: { id: sellerId, account_status: accountStatus },
  });

  const res = await turso.execute({
    sql: 'SELECT * FROM sellers WHERE id = :id LIMIT 1;',
    args: { id: sellerId },
  });

  return res.rows.length > 0 ? mapDbSellerToApplicant(res.rows[0]) : null;
}

// -------------------------------------------------------------
// ADMIN ACTIONS: LISTINGS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function getAllListingsForAdminFromDb(limit = 100): Promise<AdminBaleListingItem[]> {
  try {
    const res = await turso.execute({
      sql: `
        SELECT l.*, s.masked_code, s.full_name as seller_full_name, s.business_name, s.godown_zone,
               s.rating as seller_rating, s.trust_score as seller_trust_score, s.verification_status, s.account_status
        FROM listings l
        JOIN sellers s ON l.seller_id = s.id
        ORDER BY l.created_at DESC
        LIMIT :limit;
      `,
      args: { limit },
    });

    return res.rows.map((row: any) => {
      const sellerMock = {
        id: row.seller_id,
        assignedMaskedCode: row.masked_code,
        fullName: row.seller_full_name,
        businessName: row.business_name,
        godownZone: row.godown_zone,
        verificationStatus: row.verification_status,
        accountStatus: row.account_status,
      };
      return mapDbListingToAdminItem(row, sellerMock);
    });
  } catch (err) {
    console.error('getAllListingsForAdminFromDb Turso exception:', err);
    return [];
  }
}

export async function approveListingInDb(listingId: string): Promise<AdminBaleListingItem | null> {
  const curRes = await turso.execute({
    sql: 'SELECT * FROM listings WHERE id = :id LIMIT 1;',
    args: { id: listingId },
  });

  const current = curRes.rows[0];
  let pendingUpdates: any = {};
  try {
    if (typeof current?.pending_edit_json === 'string') {
      pendingUpdates = JSON.parse(current.pending_edit_json);
    }
  } catch (e) {}

  const now = new Date().toISOString();
  const fields = [
    "status = 'approved'",
    'pending_edit_json = NULL',
    'rejection_reason = NULL',
    'updated_at = :updated_at',
  ];
  const args: any = { id: listingId, updated_at: now };

  if (pendingUpdates.title) { fields.push('title = :title'); args.title = pendingUpdates.title; }
  if (pendingUpdates.sealedBalePrice !== undefined) { fields.push('sealed_bale_price = :sealed_bale_price'); args.sealed_bale_price = pendingUpdates.sealedBalePrice; }
  if (pendingUpdates.curatedPiecePrice !== undefined) { fields.push('curated_piece_price = :curated_piece_price'); args.curated_piece_price = pendingUpdates.curatedPiecePrice; }
  if (pendingUpdates.inStockCount !== undefined) { fields.push('in_stock_count = :in_stock_count'); args.in_stock_count = pendingUpdates.inStockCount; }

  await turso.execute({
    sql: `UPDATE listings SET ${fields.join(', ')} WHERE id = :id;`,
    args,
  });

  const res = await turso.execute({
    sql: `
      SELECT l.*, s.masked_code, s.business_name, s.godown_zone
      FROM listings l
      JOIN sellers s ON l.seller_id = s.id
      WHERE l.id = :id
      LIMIT 1;
    `,
    args: { id: listingId },
  });

  return res.rows.length > 0 ? mapDbListingToAdminItem(res.rows[0], res.rows[0]) : null;
}

export async function rejectListingInDb(listingId: string, rejectionReason: string): Promise<AdminBaleListingItem | null> {
  const now = new Date().toISOString();
  await turso.execute({
    sql: `
      UPDATE listings SET
        status = 'rejected',
        rejection_reason = :rejection_reason,
        updated_at = :updated_at
      WHERE id = :id;
    `,
    args: { id: listingId, rejection_reason: rejectionReason, updated_at: now },
  });

  const res = await turso.execute({
    sql: `
      SELECT l.*, s.masked_code, s.business_name, s.godown_zone
      FROM listings l
      JOIN sellers s ON l.seller_id = s.id
      WHERE l.id = :id
      LIMIT 1;
    `,
    args: { id: listingId },
  });

  return res.rows.length > 0 ? mapDbListingToAdminItem(res.rows[0], res.rows[0]) : null;
}

// -------------------------------------------------------------
// ADMIN ACTIONS: ESCROW ORDERS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function getAllEscrowOrdersFromDb(limit = 100): Promise<any[]> {
  try {
    const res = await turso.execute({
      sql: 'SELECT * FROM escrow_orders ORDER BY created_at DESC LIMIT :limit;',
      args: { limit },
    });
    return res.rows;
  } catch (err) {
    console.error('getAllEscrowOrdersFromDb Turso exception:', err);
    return [];
  }
}
