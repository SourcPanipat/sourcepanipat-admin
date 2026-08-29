export type VerificationStatus = 'pending_approval' | 'approved' | 'rejected';

export type EscrowStatus = 
  | 'ESCROW_LOCKED' 
  | 'INSPECTOR_ASSIGNED' 
  | 'QC_APPROVAL_PENDING' 
  | 'DISPATCHED_BILTI_UPLOADED' 
  | 'DELIVERED_SETTLED'
  | 'DISPUTE_HOLD';

export interface SellerApplicant {
  id: string;
  maskedCode: string; // '#PNP-001'
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  godownZone: string;
  yardAddress: string;
  primaryInventoryTypes: string[];
  gstin?: string;
  isGstinRegistered: boolean;
  bankAccountNumber: string;
  bankIfscCode: string;
  accountHolderName: string;
  bankName: string;
  gstDocUrl?: string;
  yardPhotoUrl?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  rating: number;
  totalDispatchedBales: number;
  repeatBuyerRate: number;
  createdAt: string;
  appliedAt: string;
}

export interface InspectorFieldAgent {
  id: string;
  code: string; // '#PNP-INSP-01'
  name: string;
  phone: string;
  assignedZone: string; // 'Sanoli Road Godown Hub', 'Noorwala', etc.
  activeInspectionsCount: number;
  completedInspectionsCount: number;
  rating: number;
  status: 'available' | 'on_ground' | 'offline';
  payoutPending: number;
  joinedDate: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  logoUrl?: string;
  sortOrder: number;
  isActive: boolean;
  subCategoriesCount?: number;
}

export interface SubCategoryItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface DisputeRecord {
  id: string;
  orderNumber: string;
  raisedBy: 'BUYER' | 'SELLER';
  partyName: string;
  partyPhone: string;
  reason: 'Tare Weight Discrepancy' | 'Grade / Fabric Mismatch' | 'Transit Damage' | 'Delayed Dispatch';
  disputeAmount: number;
  description: string;
  godownVideoUrl: string;
  inspectorTarePhotoUrl: string;
  buyerEvidenceUrl?: string;
  sellerMaskedId: string;
  inspectorCode: string;
  status: 'OPEN_INVESTIGATION' | 'SETTLED_RELEASED_SELLER' | 'SETTLED_REFUNDED_BUYER' | 'PARTIAL_SETTLEMENT';
  createdAt: string;
}

export interface AdminOrderRecord {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  buyerBusinessName: string;
  buyerCity: string;
  sellerMaskedCode: string;
  sellerBusinessName: string;
  godownZone: string;
  baleTitle: string;
  weightKg: number;
  quantity: number;
  buyMode: 'sealed_bale' | 'curated_lot';
  totalAmount: number;
  escrowStatus: EscrowStatus;
  currentStageIndex: number;
  inspectorCode?: string;
  inspectorName?: string;
  verifiedTareWeightKg?: number;
  biltiLrNumber?: string;
  transporterName?: string;
  createdAt: string;
}
