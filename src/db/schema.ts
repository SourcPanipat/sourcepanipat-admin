import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  iconName: text('icon_name').notNull(),
  logoUrl: text('logo_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
});

export const subCategories = sqliteTable('sub_categories', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  defaultMoq: integer('default_moq').default(25).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
});

export const sellerProfiles = sqliteTable('seller_profiles', {
  id: text('id').primaryKey(),
  maskedCode: text('masked_code').notNull().unique(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email').notNull().unique(),
  businessName: text('business_name').notNull(),
  godownZone: text('godown_zone').notNull(),
  yardAddress: text('yard_address').notNull(),
  primaryInventoryTypes: text('primary_inventory_types').notNull(),
  gstin: text('gstin'),
  isGstinRegistered: integer('is_gstin_registered', { mode: 'boolean' }).default(true),
  bankAccountNumber: text('bank_account_number').notNull(),
  bankIfscCode: text('bank_ifsc_code').notNull(),
  accountHolderName: text('account_holder_name').notNull(),
  bankName: text('bank_name').notNull(),
  gstDocUrl: text('gst_doc_url'),
  yardPhotoUrl: text('yard_photo_url'),
  verificationStatus: text('verification_status').notNull().default('pending_approval'),
  rejectionReason: text('rejection_reason'),
  approvedAt: text('approved_at'),
  rating: real('rating').default(4.9),
  totalDispatchedBales: integer('total_dispatched_bales').default(0),
  repeatBuyerRate: integer('repeat_buyer_rate').default(92),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bales = sqliteTable('bales', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  sellerId: text('seller_id').notNull(),
  title: text('title').notNull(),
  weightKg: real('weight_kg').notNull(),
  sealedBalePrice: integer('sealed_bale_price').notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  buyerId: text('buyer_id'),
  baleId: text('bale_id').notNull(),
  sellerId: text('seller_id').notNull(),
  totalAmount: integer('total_amount').notNull(),
  escrowStatus: text('escrow_status').notNull().default('ESCROW_LOCKED'),
  currentStageIndex: integer('current_stage_index').default(0).notNull(),
});
