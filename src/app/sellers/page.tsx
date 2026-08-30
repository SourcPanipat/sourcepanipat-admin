'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SellerApplicant, VerificationStatus, AccountStatus } from '@/types';
import { 
  getAllSellersFromDb, 
  approveSellerInDb, 
  rejectSellerInDb, 
  updateSellerAccountStatusInDb 
} from '@/lib/supabase-admin';
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
  Filter,
  Lock,
  Unlock,
  Ban,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function AdminSellersPage() {
  const [filterTab, setFilterTab] = useState<VerificationStatus | 'all'>('pending_approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<SellerApplicant | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [sellersList, setSellersList] = useState<SellerApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSellers = async () => {
    setIsLoading(true);
    try {
      const sellers = await getAllSellersFromDb();
      setSellersList(sellers);
    } catch (err) {
      console.error('Failed to load sellers from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  // Actions: Approve / Reject
  const handleApproveSeller = async (sellerId: string) => {
    setActionLoading(true);
    try {
      const nextCodeNumber = sellersList.filter(s => s.maskedCode && s.maskedCode.startsWith('#PNP-') && !s.maskedCode.includes('PENDING')).length + 1;
      const assignedCode = `#PNP-${String(nextCodeNumber).padStart(3, '0')}`;

      const updated = await approveSellerInDb(sellerId, assignedCode);
      if (updated) {
        setSellersList(prev => prev.map(s => s.id === sellerId ? updated : s));
        if (selectedSeller && selectedSeller.id === sellerId) {
          setSelectedSeller(updated);
        }
      }
    } catch (err: any) {
      alert('Failed to approve seller in database: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSeller = async () => {
    if (!selectedSeller) return;
    setActionLoading(true);
    try {
      const reason = rejectionReasonInput || 'Invalid godown yard documentation or inactive Panipat trade license.';
      const updated = await rejectSellerInDb(selectedSeller.id, reason);
      if (updated) {
        setSellersList(prev => prev.map(s => s.id === selectedSeller.id ? updated : s));
        setSelectedSeller(updated);
      }
      setIsRejectModalOpen(false);
      setRejectionReasonInput('');
    } catch (err: any) {
      alert('Failed to reject seller: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  // Actions: Account Status (Activate / Deactivate / Freeze)
  const handleSetAccountStatus = async (sellerId: string, status: AccountStatus) => {
    setActionLoading(true);
    try {
      const updated = await updateSellerAccountStatusInDb(sellerId, status);
      if (updated) {
        setSellersList(prev => prev.map(s => s.id === sellerId ? updated : s));
        if (selectedSeller && selectedSeller.id === sellerId) {
          setSelectedSeller(updated);
        }
      }
    } catch (err: any) {
      alert('Failed to update seller account status: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
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
  const approvedCount = sellersList.filter(s => s.verificationStatus === 'approved').length;
  const frozenCount = sellersList.filter(s => s.accountStatus === 'frozen').length;
  const deactivatedCount = sellersList.filter(s => s.accountStatus === 'deactivated').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Panipat Godowns & KYC Verification Desk
            </h1>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full">
              Live Supabase Database
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit importer premises, verify GST certificates, assign masked trader IDs, and manage account statuses (Deactivate/Freeze).
          </p>
        </div>

        <button
          onClick={loadSellers}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'pending_approval', label: 'Pending KYC Review', count: pendingCount, color: 'text-amber-800 bg-amber-50' },
            { key: 'approved', label: 'Approved Godowns', count: approvedCount, color: 'text-emerald-800 bg-emerald-50' },
            { key: 'rejected', label: 'Declined Applications', count: sellersList.filter(s => s.verificationStatus === 'rejected').length, color: 'text-rose-800 bg-rose-50' },
            { key: 'all', label: 'All Registered', count: sellersList.length, color: 'text-slate-800 bg-slate-100' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                filterTab === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                filterTab === tab.key ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search firm name, owner, phone, or #PNP ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>

      </div>

      {/* Sellers List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Trader Firm & Code</th>
                <th className="py-3 px-4">Godown Yard & Zone</th>
                <th className="py-3 px-4">Owner & Phone</th>
                <th className="py-3 px-4">GSTIN & Bank</th>
                <th className="py-3 px-4">KYC Vetting</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500 mb-2" />
                    <span>Loading verified godowns from Supabase database...</span>
                  </td>
                </tr>
              ) : filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="font-bold text-slate-700 text-xs">No seller records found</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      When sellers register on the Godown Portal, their live applications appear here for verification.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Trader Firm & Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                          seller.maskedCode.startsWith('#PNP-') && !seller.maskedCode.includes('PENDING')
                            ? 'bg-slate-900 text-amber-400 border-slate-800'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}>
                          {seller.maskedCode}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1">
                        {seller.businessName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {seller.id}
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
                      <div className="text-slate-400 text-[10px]">{seller.email}</div>
                    </td>

                    {/* GSTIN & Bank */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-slate-800">{seller.gstin || 'No GST (Composition)'}</div>
                      <div className="text-slate-400 text-[10px]">{seller.bankName || 'HDFC Bank'}</div>
                    </td>

                    {/* KYC Vetting Badge */}
                    <td className="py-3.5 px-4">
                      {seller.verificationStatus === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Approved
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
                          Declined
                        </span>
                      )}
                    </td>

                    {/* Account Status Badge */}
                    <td className="py-3.5 px-4">
                      {seller.accountStatus === 'active' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          ● Active
                        </span>
                      )}
                      {seller.accountStatus === 'frozen' && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <Lock className="w-3 h-3" />
                          Frozen
                        </span>
                      )}
                      {seller.accountStatus === 'deactivated' && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <Ban className="w-3 h-3" />
                          Deactivated
                        </span>
                      )}
                    </td>

                    {/* Review Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Audit KYC →
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC AUDIT DRAWER / MODAL */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {selectedSeller.maskedCode}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {selectedSeller.businessName}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Applied on {new Date(selectedSeller.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Hub: {selectedSeller.godownZone}
                </div>
              </div>

              <button
                onClick={() => setSelectedSeller(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              
              {/* Account Controls Banner */}
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    <span>Master Account Controls</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Status: <strong className="uppercase">{selectedSeller.accountStatus || 'ACTIVE'}</strong> (Control visibility & editing permissions)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSeller.accountStatus !== 'active' && (
                    <button
                      onClick={() => handleSetAccountStatus(selectedSeller.id, 'active')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Unlock className="w-3 h-3" />
                      <span>Activate</span>
                    </button>
                  )}

                  {selectedSeller.accountStatus !== 'frozen' && (
                    <button
                      onClick={() => handleSetAccountStatus(selectedSeller.id, 'frozen')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-xs"
                      title="Freeze seller: hides lots from marketplace and locks editing in seller portal"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Freeze Account</span>
                    </button>
                  )}

                  {selectedSeller.accountStatus !== 'deactivated' && (
                    <button
                      onClick={() => handleSetAccountStatus(selectedSeller.id, 'deactivated')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                      title="Deactivate seller: hides lots and prevents login"
                    >
                      <Ban className="w-3 h-3" />
                      <span>Deactivate</span>
                    </button>
                  )}
                </div>
              </div>

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
                  <div className="text-slate-700"><strong>GSTIN:</strong> {selectedSeller.gstin || 'N/A (Composition Scheme)'}</div>
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
                  <div className="border border-slate-200 rounded-xl overflow-hidden p-2.5 bg-slate-50 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">Panipat Godown Yard Photo</div>
                    <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-200">
                      {selectedSeller.yardPhotoUrl ? (
                        <Image
                          src={selectedSeller.yardPhotoUrl}
                          alt="Godown Yard"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                          No yard photo uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden p-2.5 bg-slate-50 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">GST Certificate / Trade Registration</div>
                    <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-200">
                      {selectedSeller.gstDocUrl ? (
                        <Image
                          src={selectedSeller.gstDocUrl}
                          alt="GST Certificate"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                          No GST document uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Actions */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Decision syncs instantly to live Supabase database and Godown Desk.
              </div>

              <div className="flex items-center gap-2">
                {selectedSeller.verificationStatus !== 'rejected' && (
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                  >
                    Reject Application
                  </button>
                )}

                {selectedSeller.verificationStatus !== 'approved' && (
                  <button
                    onClick={() => handleApproveSeller(selectedSeller.id)}
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 text-xs shadow-xl">
            <h4 className="font-bold text-sm text-slate-900">
              Reject Godown Application
            </h4>
            <p className="text-slate-600">
              Please state the reason for rejecting <strong>{selectedSeller?.businessName}</strong>:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Yard photo did not match registered Panipat municipal zone / Trade license invalid."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSeller}
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
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
