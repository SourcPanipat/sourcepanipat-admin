'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminBaleListingItem, ListingStatus } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Play, 
  Film, 
  ShieldCheck, 
  Building2, 
  Tag, 
  Layers, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight,
  Sparkles,
  Users,
  ChevronRight,
  ExternalLink,
  Check,
  X
} from 'lucide-react';

const INITIAL_ADMIN_LOTS: AdminBaleListingItem[] = [
  {
    id: 'bale-001',
    slug: 'heavy-puffers-bale-001',
    sellerId: 'pnp-001',
    sellerMaskedCode: '#PNP-001',
    sellerFullName: 'Rajesh Gupta',
    sellerBusinessName: 'Gupta Synthetic & Woollens',
    categoryId: 'winter-jackets-outerwear',
    subCategoryId: 'heavy-puffers',
    categoryLabel: 'Winter Jackets & Outerwear',
    title: 'Korean Heavy Goose-Down Puffers (Grade A Cream Lot)',
    shortDescription: 'Fresh container arrival from Incheon. 80kg sealed iron hoop bale with 75-80 goose-down puffer parkas.',
    sourcingMode: 'both',
    originCountry: 'South Korea',
    originFlag: 'KR',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
    ],
    weightKg: 80,
    estimatedPieceCount: 75,
    sealedBalePrice: 32000,
    curatedPiecePrice: 480,
    curatedMoq: 25,
    gradeA: 85,
    gradeB: 12,
    gradeC: 3,
    videos: [
      {
        id: 'v1',
        type: 'opening_inspection',
        grade: 'Grade A',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        durationSeconds: 30,
        label: '30s Raw Bale Opening Inspection',
        description: 'Live unboxing sample inspection at Sanoli Road Godown Hub.'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
    ],
    godownBatchId: 'BATCH-SANOLI-2026-W09',
    qcVerified: true,
    inStockCount: 6,
    garmentType: 'Puffers',
    targetGender: 'Unisex',
    primaryFabric: 'Heavy Down & Nylon',
    fabricComposition: 'Heavy Down & Nylon Fill',
    expectedGrossMargin: '3.5x - 5.0x Margin',
    status: 'pending_approval',
    createdAt: '2026-08-29T14:30:00Z',
  },
  {
    id: 'bale-002',
    slug: 'vintage-denim-jackets-002',
    sellerId: 'pnp-004',
    sellerMaskedCode: '#PNP-004',
    sellerFullName: 'Anil Batra',
    sellerBusinessName: 'Batra Global Export Yard',
    categoryId: 'jeans-denim-workwear',
    subCategoryId: 'vintage-denim',
    categoryLabel: 'Denim & Workwear',
    title: 'Vintage USA Duck Canvas & Heavy Denim Trucker Jackets',
    shortDescription: 'USA imported heavy denim and chore jackets. 100kg bale with genuine aged patina.',
    sourcingMode: 'bale_only',
    originCountry: 'USA',
    originFlag: 'US',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    weightKg: 100,
    estimatedPieceCount: 110,
    sealedBalePrice: 44000,
    curatedPiecePrice: 520,
    curatedMoq: 25,
    gradeA: 90,
    gradeB: 8,
    gradeC: 2,
    videos: [
      {
        id: 'v2',
        type: 'opening_inspection',
        grade: 'Grade A',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        durationSeconds: 30,
        label: '30s Denim Tare & Bale Audit',
        description: 'Tare weighment and fabric check at Barsat Road Sorting Yard.'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    godownBatchId: 'BATCH-BARSAT-2026-B02',
    qcVerified: true,
    inStockCount: 4,
    garmentType: 'Denim / Jeans',
    targetGender: 'Men',
    primaryFabric: 'Heavy Denim / Twill',
    fabricComposition: '100% Cotton 14oz Denim & Duck Canvas',
    expectedGrossMargin: '4.0x - 6.0x Margin',
    status: 'pending_approval',
    isEdited: true,
    createdAt: '2026-08-29T16:15:00Z',
  },
  {
    id: 'bale-003',
    slug: 'heavyweight-fleece-hoodies-003',
    sellerId: 'pnp-002',
    sellerMaskedCode: '#PNP-002',
    sellerFullName: 'Vikram Sharma',
    sellerBusinessName: 'Sharma Sorting Corp',
    categoryId: 'fleece-sweatshirts',
    subCategoryId: 'heavy-hoodies',
    categoryLabel: 'Fleece & Sweatshirts',
    title: '450+ GSM Heavyweight Graphic Hoodies & Sweatshirts (Japan)',
    shortDescription: 'Japanese premium 450 GSM winter fleece lot with embroidery and collegiate graphic prints.',
    sourcingMode: 'both',
    originCountry: 'Japan',
    originFlag: 'JP',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    weightKg: 80,
    estimatedPieceCount: 90,
    sealedBalePrice: 26000,
    curatedPiecePrice: 340,
    curatedMoq: 20,
    gradeA: 80,
    gradeB: 15,
    gradeC: 5,
    videos: [
      {
        id: 'v3',
        type: 'opening_inspection',
        grade: 'Grade A',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        durationSeconds: 30,
        label: '30s Fleece Unboxing Inspection',
        description: 'Opening inspection at Noorwala Industrial Hub.'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    godownBatchId: 'BATCH-NOORWALA-2026-F03',
    qcVerified: true,
    inStockCount: 8,
    garmentType: 'Sweatshirts & Hoodies',
    targetGender: 'Unisex',
    primaryFabric: '100% Cotton Fleece',
    fabricComposition: '450 GSM Heavy Cotton Fleece',
    expectedGrossMargin: '3.0x - 4.5x Margin',
    status: 'pending_approval',
    createdAt: '2026-08-30T06:00:00Z',
  }
];

export default function ListingApprovalsPage() {
  const [lots, setLots] = useState<AdminBaleListingItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLot, setSelectedLot] = useState<AdminBaleListingItem | null>(null);
  
  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeLotForAction, setActiveLotForAction] = useState<AdminBaleListingItem | null>(null);

  // Sync from localStorage
  useEffect(() => {
    let combined = [...INITIAL_ADMIN_LOTS];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_seller_lots');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const mappedParsed = parsed.map((p: any) => ({
            ...p,
            sellerMaskedCode: p.sellerMaskedCode || '#PNP-001',
            sellerFullName: p.sellerFullName || 'Rajesh Gupta',
            sellerBusinessName: p.sellerBusinessName || 'Gupta Syndicate',
            status: p.status || 'pending_approval',
          }));
          combined = [...mappedParsed, ...INITIAL_ADMIN_LOTS];
        } catch (e) {
          console.error(e);
        }
      }
    }
    setLots(combined);
  }, []);

  const saveLots = (updated: AdminBaleListingItem[]) => {
    setLots(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_seller_lots', JSON.stringify(updated));
    }
  };

  const handleApprove = (lot: AdminBaleListingItem) => {
    const updated = lots.map((l) => {
      if (l.id === lot.id) {
        return {
          ...l,
          status: 'approved' as ListingStatus,
          statusUpdatedAt: new Date().toISOString(),
          rejectionReason: undefined,
          isEdited: false,
        };
      }
      return l;
    });
    saveLots(updated);
    if (selectedLot?.id === lot.id) {
      setSelectedLot({
        ...selectedLot,
        status: 'approved',
        statusUpdatedAt: new Date().toISOString(),
        rejectionReason: undefined,
      });
    }
  };

  const handleOpenReject = (lot: AdminBaleListingItem) => {
    setActiveLotForAction(lot);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!activeLotForAction) return;
    const updated = lots.map((l) => {
      if (l.id === activeLotForAction.id) {
        return {
          ...l,
          status: 'rejected' as ListingStatus,
          rejectionReason: rejectReason || 'Quality specs or video criteria not meeting Panipat QC requirements.',
          statusUpdatedAt: new Date().toISOString(),
        };
      }
      return l;
    });
    saveLots(updated);
    if (selectedLot?.id === activeLotForAction.id) {
      setSelectedLot({
        ...selectedLot,
        status: 'rejected',
        rejectionReason: rejectReason || 'Quality specs or video criteria not meeting Panipat QC requirements.',
        statusUpdatedAt: new Date().toISOString(),
      });
    }
    setIsRejectModalOpen(false);
    setActiveLotForAction(null);
  };

  const filteredLots = lots.filter((lot) => {
    if (activeTab === 'pending' && lot.status !== 'pending_approval') return false;
    if (activeTab === 'approved' && lot.status !== 'approved') return false;
    if (activeTab === 'rejected' && lot.status !== 'rejected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lot.title.toLowerCase().includes(q) ||
        lot.sellerMaskedCode?.toLowerCase().includes(q) ||
        lot.categoryLabel?.toLowerCase().includes(q) ||
        lot.garmentType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = lots.filter((l) => l.status === 'pending_approval').length;
  const approvedCount = lots.filter((l) => l.status === 'approved').length;
  const rejectedCount = lots.filter((l) => l.status === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Listing Approvals & Quality Staging
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold border border-amber-300">
              {pendingCount} Staged for Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit newly created seller lots and price edits before publishing live on the Panipat B2B marketplace
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pending'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'pending' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-100 text-amber-900'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'approved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Live Approved</span>
            <span className="text-[10px] text-slate-400">({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'rejected'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Rejected</span>
            <span className="text-[10px] text-slate-400">({rejectedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Lots ({lots.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, seller, garment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-none"
          />
        </div>

      </div>

      {/* Main Listings Grid / Table */}
      <div className="grid grid-cols-1 gap-3">
        {filteredLots.map((lot) => {
          const isPending = lot.status === 'pending_approval';
          const isApproved = lot.status === 'approved';
          const isRejected = lot.status === 'rejected';

          return (
            <div
              key={lot.id}
              className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${
                isPending 
                  ? 'border-amber-200 bg-amber-50/20' 
                  : isRejected 
                  ? 'border-rose-200 bg-rose-50/20' 
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-3.5">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={lot.thumbnailUrl}
                      alt={lot.title}
                      fill
                      className="object-cover"
                    />
                    {lot.videos && lot.videos.length > 0 && (
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] text-amber-400 font-bold flex items-center gap-0.5">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>30s</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10.5px] font-bold">
                        {lot.sellerMaskedCode || '#PNP-001'}
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {lot.categoryLabel}
                      </span>
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold animate-pulse">
                          ● Pending Audit
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Live on Marketplace
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Needs Revision
                        </span>
                      )}
                      {lot.isEdited && (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                          Edited Staging Snapshot
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {lot.title}
                    </h3>

                    {/* Attributes Bar */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
                      <span>Garment: <strong className="text-slate-900">{lot.garmentType || 'Jackets'}</strong></span>
                      <span>•</span>
                      <span>Gender: <strong className="text-slate-900">{lot.targetGender || 'Unisex'}</strong></span>
                      <span>•</span>
                      <span>Fabric: <strong className="text-slate-900">{lot.primaryFabric || 'Export Mix'}</strong></span>
                      <span>•</span>
                      <span>Weight: <strong className="text-slate-900">{lot.weightKg} KG</strong> ({lot.estimatedPieceCount} Pcs)</span>
                    </div>

                    {isRejected && lot.rejectionReason && (
                      <div className="p-2 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-900 mt-1.5 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span><strong>Rejection Feedback:</strong> {lot.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Pricing & Action Controls */}
                <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <div className="text-[11px] text-slate-500 font-medium">Whole Bale Price</div>
                    <div className="text-sm font-black text-slate-900 font-mono">
                      {formatINR(lot.sealedBalePrice)}
                    </div>
                    {lot.sourcingMode !== 'bale_only' && (
                      <div className="text-[10px] text-slate-500 font-medium">
                        Curated: ₹{lot.curatedPiecePrice}/pc (MOQ {lot.curatedMoq})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLot(lot)}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>

                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(lot)}
                          className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => handleOpenReject(lot)}
                          className="px-3 py-2 rounded-lg bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {filteredLots.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-800 text-sm">No listings found in this tab</div>
            <p className="text-xs text-slate-500">All seller submitted lots are audited or no matching search queries.</p>
          </div>
        )}
      </div>

      {/* Review Drawer / Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs font-mono">
                  {selectedLot.sellerMaskedCode || '#PNP-001'}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedLot.title}</h3>
                  <p className="text-[11px] text-slate-500">
                    Category: {selectedLot.categoryLabel} • Mode: {selectedLot.sourcingMode.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLot(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              {/* Media Preview (Video & Photo) */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-slate-700" />
                  <span>30s Raw Opening Inspection Video & Photos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedLot.videos && selectedLot.videos.length > 0 ? (
                    <div className="rounded-xl overflow-hidden bg-black border border-slate-800">
                      <video
                        src={selectedLot.videos[0].videoUrl}
                        controls
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-2 bg-slate-900 text-[10.5px] text-slate-300 flex items-center justify-between">
                        <span>{selectedLot.videos[0].label}</span>
                        <span className="text-amber-400 font-bold font-mono">30s QC Clip</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      No video attached
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 h-48">
                    {selectedLot.galleryImages.map((img, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <Image
                          src={img}
                          alt="Bale photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Lot Attributes Card (Clean muted label & bold value) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-900">Key Lot Attributes & Composition</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10.5px] text-slate-500 font-medium">Garment Type</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">
                      {selectedLot.garmentType || 'Jackets'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10.5px] text-slate-500 font-medium">Target Gender</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">
                      {selectedLot.targetGender || 'Unisex'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10.5px] text-slate-500 font-medium">Primary Fabric</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5 truncate">
                      {selectedLot.primaryFabric || selectedLot.fabricComposition || '100% Export Mix'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Grade Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Audited Grade Distribution</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-white border border-emerald-200">
                    <div className="text-[10.5px] text-emerald-800 font-bold">Grade A (Cream Lot)</div>
                    <div className="text-base font-black text-emerald-950 font-mono mt-0.5">{selectedLot.gradeA}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-amber-200">
                    <div className="text-[10.5px] text-amber-800 font-bold">Grade B (Minor Wear)</div>
                    <div className="text-base font-black text-amber-950 font-mono mt-0.5">{selectedLot.gradeB}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-rose-200">
                    <div className="text-[10.5px] text-rose-800 font-bold">Grade C (Industrial)</div>
                    <div className="text-base font-black text-rose-950 font-mono mt-0.5">{selectedLot.gradeC}%</div>
                  </div>
                </div>
              </div>

              {/* Pricing & Commercial Terms */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10.5px] text-slate-500 font-medium">Gross Weight</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{selectedLot.weightKg} KG</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10.5px] text-slate-500 font-medium">Est. Piece Count</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{selectedLot.estimatedPieceCount} Pcs</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10.5px] text-slate-500 font-medium">Whole Bale Price</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5 font-mono">{formatINR(selectedLot.sealedBalePrice)}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10.5px] text-slate-500 font-medium">Curated Rate</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5 font-mono">₹{selectedLot.curatedPiecePrice}/pc</div>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Status: <strong className="text-slate-900 uppercase">{selectedLot.status.replace('_', ' ')}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedLot(null)}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Close
                </button>

                {selectedLot.status === 'pending_approval' && (
                  <>
                    <button
                      onClick={() => handleOpenReject(selectedLot)}
                      className="px-4 py-2 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-100 flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject & Request Changes</span>
                    </button>

                    <button
                      onClick={() => handleApprove(selectedLot)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish Live</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {isRejectModalOpen && activeLotForAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Reject Lot: {activeLotForAction.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide feedback to the seller ({activeLotForAction.sellerMaskedCode}) on why this lot was not approved.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Rejection Reason / Required Changes:
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Please re-record 30s unboxing inspection with clear lighting and legible scale tare weighment photo."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
