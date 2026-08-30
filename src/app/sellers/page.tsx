'use client';

import React, { useState, useEffect } from 'react';


import Image from 'next/image';
import { SellerApplicant, VerificationStatus } from '@/types';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  FileText, 
  Phone, 
  Mail, 
  ShieldCheck, 
  X, 
  CreditCard,
  ExternalLink,
  Filter
} from 'lucide-react';

export default function AdminSellersPage() {
  const [filterTab, setFilterTab] = useState<VerificationStatus | 'all'>('pending_approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<SellerApplicant | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Clean Sellers State for real testing
  const [sellersList, setSellersList] = useState<SellerApplicant[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_registered_sellers');
      const activeSeller = localStorage.getItem('sp_active_seller');
      let combined: SellerApplicant[] = [];
      if (stored) {
        try {
          combined = JSON.parse(stored);
        } catch (e) {}
      }
      if (activeSeller) {
        try {
          const parsed = JSON.parse(activeSeller);
          if (!combined.some(s => s.id === parsed.id || s.email === parsed.email)) {
            combined.push(parsed);
          }
        } catch (e) {}
      }
      setSellersList(combined);
    }
  }, []);

  // Actions: Approve / Reject
  const handleApproveSeller = (sellerId: string) => {
    const nextCodeNumber = sellersList.filter(s => s.maskedCode && s.maskedCode.startsWith('#PNP-')).length + 1;
    const assignedCode = `#PNP-${String(nextCodeNumber).padStart(3, '0')}`;

    const updated = sellersList.map(s => {
      if (s.id === sellerId) {
        const approvedSeller = {
          ...s,
          maskedCode: assignedCode,
          verificationStatus: 'approved' as VerificationStatus,
        };
        // Sync back to active seller if matches
        if (typeof window !== 'undefined') {
          const activeSeller = localStorage.getItem('sp_active_seller');
          if (activeSeller) {
            try {
              const active = JSON.parse(activeSeller);
              if (active.id === sellerId || active.email === s.email) {
                localStorage.setItem('sp_active_seller', JSON.stringify(approvedSeller));
              }
            } catch (e) {}
          }
        }
        return approvedSeller;
      }
      return s;
    });

    setSellersList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_registered_sellers', JSON.stringify(updated));
    }


    if (selectedSeller && selectedSeller.id === sellerId) {
      setSelectedSeller(prev => prev ? { ...prev, maskedCode: assignedCode, verificationStatus: 'approved' } : null);
    }
  };

  const handleRejectSeller = () => {
    if (!selectedSeller) return;

    setSellersList(prev => prev.map(s => {
      if (s.id === selectedSeller.id) {
        return {
          ...s,
          verificationStatus: 'rejected',
          rejectionReason: rejectionReasonInput || 'Invalid godown yard documentation or inactive Panipat trade license.',
        };
      }
      return s;
    }));

    setSelectedSeller(prev => prev ? { 
      ...prev, 
      verificationStatus: 'rejected', 
      rejectionReason: rejectionReasonInput || 'Invalid godown yard documentation' 
    } : null);

    setIsRejectModalOpen(false);
    setRejectionReasonInput('');
  };

  // Filtered List
  const filteredSellers = sellersList.filter(s => {
    const matchesTab = filterTab === 'all' || s.verificationStatus === filterTab;
    const matchesSearch = 
      s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.maskedCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.godownZone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = sellersList.filter(s => s.verificationStatus === 'pending_approval').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Panipat Godown Sellers & KYC Review
            </h1>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit godown yard photos, GSTIN certificates, and assign auto-masked codes (`#PNP-00X`) for verified listing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500">
            Total Sellers: <strong className="text-slate-900">{sellersList.length}</strong>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 border border-slate-300 text-xs font-bold">
          <button
            onClick={() => setFilterTab('pending_approval')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === 'pending_approval'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === 'approved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved ({sellersList.filter(s => s.verificationStatus === 'approved').length})</span>
          </button>

          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === 'rejected'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected ({sellersList.filter(s => s.verificationStatus === 'rejected').length})</span>
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({sellersList.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search firm, yard zone, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-800 focus:outline-none"
          />
        </div>

      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Masked ID / Firm</th>
                <th className="py-3 px-4">Godown Yard & Hub</th>
                <th className="py-3 px-4">Contact & Phone</th>
                <th className="py-3 px-4">GSTIN & Bank</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Masked ID & Firm */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        seller.maskedCode.startsWith('#PNP-')
                          ? 'bg-slate-900 text-amber-400'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {seller.maskedCode}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1">
                      {seller.businessName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Applied: {seller.appliedAt}
                    </div>
                  </td>

                  {/* Godown Yard & Hub */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{seller.godownZone}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                      {seller.yardAddress}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{seller.fullName}</div>
                    <div className="text-slate-500 text-[11px]">{seller.phone}</div>
                  </td>

                  {/* GSTIN & Bank */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-800">{seller.gstin || 'No GST (Composition)'}</div>
                    <div className="text-slate-400 text-[10px]">{seller.bankName}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {seller.verificationStatus === 'approved' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Approved & Live
                      </span>
                    )}
                    {seller.verificationStatus === 'pending_approval' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        Review Pending
                      </span>
                    )}
                    {seller.verificationStatus === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Review Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedSeller(seller)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Audit KYC →
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC AUDIT DRAWER / MODAL */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedSeller.maskedCode}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {selectedSeller.businessName}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Applied on {selectedSeller.appliedAt} • Hub: {selectedSeller.godownZone}
                </div>
              </div>

              <button
                onClick={() => setSelectedSeller(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              
              {/* Section 1: Godown Location & Categories */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-700" />
                  <span>Panipat Godown Yard Address</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedSeller.yardAddress}
                </p>
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold self-center">Inventory Specialization:</span>
                  {selectedSeller.primaryInventoryTypes.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-semibold text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 2: Contact & Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Owner & Contact Info</span>
                  </div>
                  <div className="text-slate-700"><strong>Name:</strong> {selectedSeller.fullName}</div>
                  <div className="text-slate-700"><strong>Phone:</strong> {selectedSeller.phone}</div>
                  <div className="text-slate-700"><strong>Email:</strong> {selectedSeller.email}</div>
                  <div className="text-slate-700"><strong>GSTIN:</strong> {selectedSeller.gstin || 'N/A'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-700" />
                    <span>ICICI Escrow Payout Bank</span>
                  </div>
                  <div className="text-slate-700"><strong>A/C Holder:</strong> {selectedSeller.accountHolderName}</div>
                  <div className="text-slate-700 font-mono"><strong>A/C No:</strong> {selectedSeller.bankAccountNumber}</div>
                  <div className="text-slate-700 font-mono"><strong>IFSC:</strong> {selectedSeller.bankIfscCode}</div>
                  <div className="text-slate-700"><strong>Bank:</strong> {selectedSeller.bankName}</div>
                </div>
              </div>

              {/* Section 3: KYC Media Proofs (Cloudflare R2) */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>Uploaded KYC & Yard Verification Photos</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700">Panipat Godown Yard Photo</div>
                    <div className="relative h-36 w-full rounded-lg overflow-hidden bg-slate-200">
                      <Image
                        src={selectedSeller.yardPhotoUrl || '/placeholder.jpg'}
                        alt="Godown Yard"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700">GST Certificate / Trade Registration</div>
                    <div className="relative h-36 w-full rounded-lg overflow-hidden bg-slate-200">
                      <Image
                        src={selectedSeller.gstDocUrl || '/placeholder.jpg'}
                        alt="GST Certificate"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Actions */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Decision will trigger instant WhatsApp & Email notification to owner.
              </div>

              <div className="flex items-center gap-2">
                {selectedSeller.verificationStatus !== 'rejected' && (
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                  >
                    Reject Application
                  </button>
                )}

                {selectedSeller.verificationStatus !== 'approved' && (
                  <button
                    onClick={() => handleApproveSeller(selectedSeller.id)}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Assign #PNP ID</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-slate-900">
              Reject Seller Application
            </h4>
            <p className="text-slate-600">
              Please state the reason for rejecting <strong>{selectedSeller?.businessName}</strong>:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Yard photo did not match registered Panipat municipal zone / Trade license invalid."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSeller}
                className="px-4 py-1.5 rounded bg-rose-600 text-white font-bold"
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
