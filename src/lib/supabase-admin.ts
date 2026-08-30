import { createClient } from '@supabase/supabase-js';
import { SellerApplicant, AdminBaleListingItem, VerificationStatus, AccountStatus, ListingStatus } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqkbiugtxpnjmkeigdnl.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxa2JpdWd0eHBuam1rZWlnZG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NTUyMTcsImV4cCI6MjEwMzUzMTIxN30.Fy_2E6qi0HA0n3qQohHFXi1X3zFQhzpKI3jj8lUZmpY';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Map DB seller row to SellerApplicant
export function mapDbSellerToApplicant(row: any): SellerApplicant {
  return {
    id: row.id,
    maskedCode: row.masked_code || '#PNP-PENDING',
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    businessName: row.business_name,
    godownZone: row.godown_zone,
    yardAddress: row.yard_address,
    primaryInventoryTypes: Array.isArray(row.primary_inventory_types)
      ? row.primary_inventory_types
      : (typeof row.primary_inventory_types === 'string' ? JSON.parse(row.primary_inventory_types) : []),
    gstin: row.gstin,
    isGstinRegistered: Boolean(row.is_gstin_registered),
    bankAccountNumber: row.bank_account_number || '',
    bankIfscCode: row.bank_ifsc_code || '',
    accountHolderName: row.account_holder_name || '',
    bankName: row.bank_name || '',
    gstDocUrl: row.gst_doc_url,
    yardPhotoUrl: row.yard_photo_url,
    verificationStatus: row.verification_status || 'pending_approval',
    accountStatus: row.account_status || 'active',
    rejectionReason: row.rejection_reason,
    rating: row.rating ?? 5.0,
    totalDispatchedBales: row.total_dispatched_bales ?? 0,
    repeatBuyerRate: row.repeat_buyer_rate ?? 100,
    createdAt: row.created_at || new Date().toISOString(),
    appliedAt: row.created_at || new Date().toISOString(),
  };
}

// Map DB listing row to AdminBaleListingItem
export function mapDbListingToAdminItem(row: any, sellerRow?: any): AdminBaleListingItem {
  return {
    id: row.id,
    slug: row.slug,
    sellerId: row.seller_id,
    sellerMaskedCode: sellerRow?.masked_code || row.seller_masked_code || '#PNP-001',
    sellerFullName: sellerRow?.full_name || row.seller_full_name || 'Panipat Trader',
    sellerBusinessName: sellerRow?.business_name || row.seller_business_name || 'Panipat Godown Syndicate',
    categoryId: row.category_id || 'winter-jackets-outerwear',
    subCategoryId: row.sub_category_id || 'heavy-puffers',
    categoryLabel: row.category_label || 'Wholesale Textiles',
    title: row.title,
    shortDescription: row.short_description || '',
    sourcingMode: row.sourcing_mode || 'both',
    originCountry: row.origin_country || 'South Korea',
    originFlag: row.origin_flag || 'KR',
    thumbnailUrl: row.thumbnail_url || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    weightKg: row.weight_kg ?? 80,
    estimatedPieceCount: row.estimated_piece_count ?? 70,
    sealedBalePrice: row.sealed_bale_price ?? 30000,
    curatedPiecePrice: row.curated_piece_price ?? 450,
    curatedMoq: row.curated_moq ?? 25,
    gradeA: row.grade_a ?? 85,
    gradeB: row.grade_b ?? 12,
    gradeC: row.grade_c ?? 3,
    videos: Array.isArray(row.videos) ? row.videos : [],
    photos: Array.isArray(row.photos) ? row.photos : [],
    godownBatchId: row.godown_batch_id || 'BATCH-SANOLI-2026',
    qcVerified: Boolean(row.qc_verified),
    inStockCount: row.in_stock_count ?? 1,
    fabricComposition: row.fabric_composition || 'Premium Graded Fabric',
    expectedGrossMargin: row.expected_gross_margin || '3.5x - 5.0x Margin',
    status: row.status || 'pending_approval',
    pendingEditJson: typeof row.pending_edit_json === 'string' ? row.pending_edit_json : JSON.stringify(row.pending_edit_json),
    rejectionReason: row.rejection_reason,
    isEdited: Boolean(row.pending_edit_json),
    statusUpdatedAt: row.updated_at,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// ADMIN ACTIONS: SELLERS
// -------------------------------------------------------------

export async function getAllSellersFromDb(limit = 100): Promise<SellerApplicant[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching all sellers in admin:', error);
      return [];
    }
    return (data || []).map(mapDbSellerToApplicant);
  } catch (err) {
    console.error('getAllSellersFromDb exception:', err);
    return [];
  }
}

export async function approveSellerInDb(sellerId: string, assignedMaskedCode: string): Promise<SellerApplicant | null> {
  const { data, error } = await supabaseAdmin
    .from('sellers')
    .update({
      verification_status: 'approved',
      masked_code: assignedMaskedCode,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq('id', sellerId)
    .select()
    .single();

  if (error) throw error;
  return mapDbSellerToApplicant(data);
}

export async function rejectSellerInDb(sellerId: string, rejectionReason: string): Promise<SellerApplicant | null> {
  const { data, error } = await supabaseAdmin
    .from('sellers')
    .update({
      verification_status: 'rejected',
      rejection_reason: rejectionReason,
    })
    .eq('id', sellerId)
    .select()
    .single();

  if (error) throw error;
  return mapDbSellerToApplicant(data);
}

export async function updateSellerAccountStatusInDb(sellerId: string, accountStatus: AccountStatus): Promise<SellerApplicant | null> {
  const { data, error } = await supabaseAdmin
    .from('sellers')
    .update({
      account_status: accountStatus,
    })
    .eq('id', sellerId)
    .select()
    .single();

  if (error) throw error;
  return mapDbSellerToApplicant(data);
}

// -------------------------------------------------------------
// ADMIN ACTIONS: LISTINGS
// -------------------------------------------------------------

export async function getAllListingsForAdminFromDb(limit = 100): Promise<AdminBaleListingItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*, sellers(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching admin listings:', error);
      return [];
    }

    return (data || []).map((row: any) => mapDbListingToAdminItem(row, row.sellers));
  } catch (err) {
    console.error('getAllListingsForAdminFromDb exception:', err);
    return [];
  }
}


export async function approveListingInDb(listingId: string): Promise<AdminBaleListingItem | null> {
  // If there was a pending edit, apply it
  const { data: current } = await supabaseAdmin.from('listings').select('*').eq('id', listingId).single();
  const pendingUpdates = current?.pending_edit_json || {};

  const updates: any = {
    status: 'approved',
    pending_edit_json: null,
    rejection_reason: null,
    updated_at: new Date().toISOString(),
  };

  if (pendingUpdates.title) updates.title = pendingUpdates.title;
  if (pendingUpdates.sealedBalePrice !== undefined) updates.sealed_bale_price = pendingUpdates.sealedBalePrice;
  if (pendingUpdates.curatedPiecePrice !== undefined) updates.curated_piece_price = pendingUpdates.curatedPiecePrice;
  if (pendingUpdates.inStockCount !== undefined) updates.in_stock_count = pendingUpdates.inStockCount;

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update(updates)
    .eq('id', listingId)
    .select('*, sellers(*)')
    .single();

  if (error) throw error;
  return mapDbListingToAdminItem(data, data.sellers);
}

export async function rejectListingInDb(listingId: string, rejectionReason: string): Promise<AdminBaleListingItem | null> {
  const { data, error } = await supabaseAdmin
    .from('listings')
    .update({
      status: 'rejected',
      rejection_reason: rejectionReason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId)
    .select('*, sellers(*)')
    .single();

  if (error) throw error;
  return mapDbListingToAdminItem(data, data.sellers);
}

// -------------------------------------------------------------
// ADMIN ACTIONS: ORDERS & KPIS
// -------------------------------------------------------------

export async function getAllEscrowOrdersForAdminFromDb(): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('escrow_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin escrow orders:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getAllEscrowOrdersForAdminFromDb exception:', err);
    return [];
  }
}

export async function getDashboardKpiMetricsFromDb() {
  try {
    const [sellersRes, listingsRes, ordersRes] = await Promise.all([
      supabaseAdmin.from('sellers').select('verification_status, account_status'),
      supabaseAdmin.from('listings').select('status'),
      supabaseAdmin.from('escrow_orders').select('total_amount, escrow_status, created_at, order_number, bale_title, buyer_city'),
    ]);

    const allSellers = sellersRes.data || [];
    const allListings = listingsRes.data || [];
    const allOrders = ordersRes.data || [];

    const pendingKYCCount = allSellers.filter(s => s.verification_status === 'pending_approval').length;
    const pendingListingsCount = allListings.filter(l => l.status === 'pending_approval').length;
    const totalEscrowHeld = allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      pendingKYCCount,
      pendingListingsCount,
      totalEscrowHeld,
      totalSellers: allSellers.length,
      activeSellers: allSellers.filter(s => s.verification_status === 'approved' && s.account_status === 'active').length,
      recentOrders: allOrders.slice(0, 5),
    };
  } catch (err) {
    console.error('getDashboardKpiMetricsFromDb exception:', err);
    return {
      pendingKYCCount: 0,
      pendingListingsCount: 0,
      totalEscrowHeld: 0,
      totalSellers: 0,
      activeSellers: 0,
      recentOrders: [],
    };
  }
}
