'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DisputeRecord } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  AlertTriangle, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Phone, 
  Eye, 
  Video, 
  CreditCard,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([
    {
      id: 'disp-101',
      orderNumber: 'SP-ESCROW-782190',
      raisedBy: 'BUYER',
      partyName: 'Rahul Sharma (Urban Vintage Thrift)',
      partyPhone: '+91 98112 34567',
      reason: 'Tare Weight Discrepancy',
      disputeAmount: 33000,
      description: 'Buyer weighed bale on receiving at Delhi shop: tare scale showed 78.4 kg vs Panipat godown tare certificate of 81.4 kg (3.0 kg variance). Requesting ₹1,200 weight adjustment settlement.',
      godownVideoUrl: 'https://pub-sourcepanipat.r2.dev/godown-walkthrough.mp4',
      inspectorTarePhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      buyerEvidenceUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
      sellerMaskedId: '#PNP-001 (Gupta Syndicate)',
      inspectorCode: '#PNP-INSP-01 (Vikram S.)',
      status: 'OPEN_INVESTIGATION',
      createdAt: '29 Aug 2026, 11:20 AM',
    },
    {
      id: 'disp-102',
      orderNumber: 'SP-ESCROW-410923',
      raisedBy: 'SELLER',
      partyName: 'Haryana Overseas (#PNP-002)',
      partyPhone: '+91 98234 56789',
      reason: 'Delayed Dispatch',
      disputeAmount: 48000,
      description: 'V-Trans Panipat hub delayed LR issue due to rain. Buyer requested immediate escrow refund before transporter loaded.',
      godownVideoUrl: 'https://pub-sourcepanipat.r2.dev/godown-walkthrough.mp4',
      inspectorTarePhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      sellerMaskedId: '#PNP-002',
      inspectorCode: '#PNP-INSP-02',
      status: 'SETTLED_RELEASED_SELLER',
      createdAt: '27 Aug 2026, 04:00 PM',
    },
  ]);

  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);
  const [partialAmount, setPartialAmount] = useState('1200');
  const [resolutionNote, setResolutionNote] = useState('');

  const handleResolve = (action: 'SELLER_RELEASE' | 'BUYER_REFUND' | 'PARTIAL') => {
    if (!selectedDispute) return;

    let newStatus: DisputeRecord['status'] = 'OPEN_INVESTIGATION';
    if (action === 'SELLER_RELEASE') newStatus = 'SETTLED_RELEASED_SELLER';
    if (action === 'BUYER_REFUND') newStatus = 'SETTLED_REFUNDED_BUYER';
    if (action === 'PARTIAL') newStatus = 'PARTIAL_SETTLEMENT';

    setDisputes(prev => prev.map(d => {
      if (d.id === selectedDispute.id) {
        return { ...d, status: newStatus };
      }
      return d;
    }));

    setSelectedDispute(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const openCount = disputes.filter(d => d.status === 'OPEN_INVESTIGATION').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Global Dispute & Escrow Resolution Desk
            </h1>
            {openCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-xs">
                {openCount} Open Dispute Hold
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-verify inspector tare photos against buyer claim weights and execute ICICI escrow partial releases or refunds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500">
            Escrow Shield Protection Rate: <strong className="text-emerald-700 font-bold">100%</strong>
          </div>
        </div>
      </div>

      {/* Disputes Cards List */}
      <div className="space-y-4">
        {disputes.map((disp) => (
          <div
            key={disp.id}
            className={`p-5 rounded-2xl bg-white border shadow-xs space-y-4 transition-all ${
              disp.status === 'OPEN_INVESTIGATION' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
            }`}
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                  {disp.orderNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px]">
                  {disp.reason}
                </span>
                <span className="text-xs text-slate-400">Raised by {disp.raisedBy}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-mono font-bold text-slate-900">
                  Escrow Hold: {formatINR(disp.disputeAmount)}
                </div>
                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                  disp.status === 'OPEN_INVESTIGATION'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {disp.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
              
              <div className="lg:col-span-8 space-y-2">
                <div className="font-semibold text-slate-800">
                  Claimant: <strong className="text-slate-900">{disp.partyName}</strong> ({disp.partyPhone})
                </div>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  "{disp.description}"
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Seller: <strong>{disp.sellerMaskedId}</strong></span>
                  <span>•</span>
                  <span>Field Inspector: <strong>{disp.inspectorCode}</strong></span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-700">Audit Evidence Pack</div>
                  <div className="text-[10.5px] text-slate-500">
                    Godown opening video, Inspector tare scale photo, and Destination scale proof.
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDispute(disp)}
                  className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Evidence & Resolve</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* DISPUTE RESOLUTION MODAL / EVIDENCE VIEWER */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedDispute.orderNumber}
                  </span>
                  <h3 className="font-bold text-sm text-white">
                    Dispute Desk: {selectedDispute.reason}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Escrow Amount in Dispute: {formatINR(selectedDispute.disputeAmount)}
                </div>
              </div>

              <button
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Evidence Comparison Grid */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-700" />
                <span>Side-by-Side Video & Tare Weight Evidence Comparison</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Panipat Godown Verified Tare Weight */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">1. Inspector Tare Audit</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified 81.4 KG
                    </span>
                  </div>

                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-200">
                    <Image
                      src={selectedDispute.inspectorTarePhotoUrl}
                      alt="Inspector Tare Photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Inspector: {selectedDispute.inspectorCode} at Sanoli Road Yard
                  </div>
                </div>

                {/* 2. Destination Received Photo */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">2. Buyer Destination Scale</span>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Weighed 78.4 KG
                    </span>
                  </div>

                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-200">
                    <Image
                      src={selectedDispute.buyerEvidenceUrl || selectedDispute.inspectorTarePhotoUrl}
                      alt="Buyer Tare Photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Claimant: {selectedDispute.partyName} (3.0 kg variation)
                  </div>
                </div>

              </div>

              {/* Settlement Actions Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Execute Binding ICICI Escrow Resolution</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  
                  {/* Action 1: Full Release */}
                  <button
                    onClick={() => handleResolve('SELLER_RELEASE')}
                    className="p-3 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-left transition-colors space-y-1"
                  >
                    <div className="font-bold text-slate-900 text-xs">Release to Seller</div>
                    <div className="text-[10px] text-slate-500">Pay 100% funds ({formatINR(selectedDispute.disputeAmount)}) to #PNP-001</div>
                  </button>

                  {/* Action 2: Partial Adjustment */}
                  <button
                    onClick={() => handleResolve('PARTIAL')}
                    className="p-3 rounded-lg bg-white border border-amber-400 bg-amber-100/40 text-left transition-colors space-y-1"
                  >
                    <div className="font-bold text-slate-900 text-xs">Partial Settlement</div>
                    <div className="text-[10px] text-slate-600">Refund ₹1,200 (3kg deficit) to Buyer, Release balance to Seller</div>
                  </button>

                  {/* Action 3: Full Refund */}
                  <button
                    onClick={() => handleResolve('BUYER_REFUND')}
                    className="p-3 rounded-lg bg-white border border-slate-300 hover:border-rose-500 text-left transition-colors space-y-1"
                  >
                    <div className="font-bold text-rose-700 text-xs">Full Refund to Buyer</div>
                    <div className="text-[10px] text-slate-500">Reverse full amount to buyer account</div>
                  </button>

                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Resolution automatically closes escrow dispute lock.
              </span>
              <button
                onClick={() => setSelectedDispute(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
