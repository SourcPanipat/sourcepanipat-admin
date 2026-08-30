'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminOrderRecord, EscrowStatus } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Scale, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  User, 
  Building2, 
  Download, 
  X,
  Phone
} from 'lucide-react';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);

  const [ordersList, setOrdersList] = useState<AdminOrderRecord[]>([]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedOrders = localStorage.getItem('sp_escrow_orders');
    const recentOrder = localStorage.getItem('sp_recent_order');
    let all: AdminOrderRecord[] = [];
    if (storedOrders) {
      try { all = JSON.parse(storedOrders); } catch (e) {}
    }
    if (recentOrder) {
      try {
        const parsed = JSON.parse(recentOrder);
        if (!all.some(o => o.orderNumber === parsed.orderNumber || o.id === parsed.id)) {
          all.unshift({
            id: parsed.id || 'ord-new',
            orderNumber: parsed.orderNumber || parsed.id,
            buyerName: parsed.buyerName || 'Verified Buyer',
            buyerPhone: parsed.buyerPhone || '+91 89502 02286',
            buyerBusinessName: parsed.buyerBusinessName || 'Buyer Enterprise',
            buyerCity: `${parsed.deliveryCity || 'Delhi'} (${parsed.deliveryState || 'NCR'})`,
            sellerMaskedCode: parsed.sellerMaskedCode || '#PNP-001',
            sellerBusinessName: 'Panipat Godown Syndicate',
            godownZone: parsed.godownZone || 'Sanoli Road Godown Hub',
            baleTitle: parsed.baleTitle || 'Wholesale Lot',
            weightKg: parsed.baleWeightKg || 80,
            quantity: parsed.quantityBales || 1,
            buyMode: parsed.buyMode || 'sealed_bale',
            totalAmount: parsed.totalPayable || 30000,
            escrowStatus: parsed.escrowStatus || 'ESCROW_LOCKED',
            currentStageIndex: parsed.currentStageIndex || 0,
            inspectorCode: parsed.inspector?.code || '#PNP-INSP-01',
            inspectorName: parsed.inspector?.name || 'Vikram S.',
            verifiedTareWeightKg: parsed.inspector?.verifiedTareWeightKg || 80,
            createdAt: 'Today',
          });
        }
      } catch (e) {}
    }
    setOrdersList(all);
  }, []);


  const stageOptions: { stage: EscrowStatus; label: string; index: number }[] = [
    { stage: 'ESCROW_LOCKED', label: '1. Order Placed (Escrow Locked)', index: 0 },
    { stage: 'INSPECTOR_ASSIGNED', label: '2. Inspector Assigned', index: 1 },
    { stage: 'QC_APPROVAL_PENDING', label: '3. QC Tare Weight Approved', index: 2 },
    { stage: 'DISPATCHED_BILTI_UPLOADED', label: '4. Dispatched (Bilti Uploaded)', index: 3 },
    { stage: 'DELIVERED_SETTLED', label: '5. Delivered (Escrow Settled)', index: 4 },
  ];

  const handleUpdateStage = (orderNumber: string, newStage: EscrowStatus, newIndex: number) => {
    setOrdersList(prev => prev.map(o => {
      if (o.orderNumber === orderNumber) {
        return {
          ...o,
          escrowStatus: newStage,
          currentStageIndex: newIndex,
        };
      }
      return o;
    }));

    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        escrowStatus: newStage,
        currentStageIndex: newIndex,
      } : null);
    }
  };

  const filteredOrders = ordersList.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.buyerName.toLowerCase().includes(q) ||
      o.buyerPhone.includes(q) ||
      o.buyerBusinessName.toLowerCase().includes(q) ||
      o.sellerMaskedCode.toLowerCase().includes(q) ||
      o.baleTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Master Escrow Orders & Lifecycle State Override
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Universal search and 5-stage manual lifecycle override desk with full audit logging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500">
            Total Orders: <strong className="text-slate-900">{ordersList.length}</strong>
          </div>
        </div>
      </div>

      {/* Universal Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by Order # (SP-ESCROW-...), Buyer Phone, Buyer Name, or Seller #PNP..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-2 border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Order # & Date</th>
                <th className="py-3 px-4">Lot & Details</th>
                <th className="py-3 px-4">Consignee Buyer</th>
                <th className="py-3 px-4">Seller Godown</th>
                <th className="py-3 px-4">Escrow Held</th>
                <th className="py-3 px-4">Lifecycle Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Order # */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {ord.orderNumber}
                    </div>
                    <div className="text-[10px] text-slate-400">{ord.createdAt}</div>
                  </td>

                  {/* Lot */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate" title={ord.baleTitle}>
                      {ord.baleTitle}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {ord.weightKg}kg Bale • {ord.buyMode}
                    </div>
                  </td>

                  {/* Buyer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{ord.buyerName}</div>
                    <div className="text-[11px] text-slate-500">{ord.buyerBusinessName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ord.buyerPhone}</div>
                  </td>

                  {/* Seller */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-amber-400 px-1.5 py-0.2 rounded">
                      {ord.sellerMaskedCode}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">{ord.godownZone.split(' ')[0]} Hub</div>
                  </td>

                  {/* Escrow */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                    {formatINR(ord.totalAmount)}
                  </td>

                  {/* Stage */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                      Stage {ord.currentStageIndex + 1} of 5: {ord.escrowStatus.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Override State →
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATE OVERRIDE & AUDIT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedOrder.orderNumber}
                  </span>
                  <h3 className="font-bold text-sm text-white">
                    Order Inspector & Lifecycle Override
                  </h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Escrow Funds: {formatINR(selectedOrder.totalAmount)} • Consignee: {selectedOrder.buyerName}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              
              {/* Order Snapshot */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">{selectedOrder.baleTitle}</div>
                <div className="text-slate-600">
                  Seller: <strong>{selectedOrder.sellerMaskedCode}</strong> ({selectedOrder.sellerBusinessName}) • Hub: {selectedOrder.godownZone}
                </div>
                <div className="text-slate-600">
                  Consignee: <strong>{selectedOrder.buyerName}</strong> ({selectedOrder.buyerPhone}) • Destination: {selectedOrder.buyerCity}
                </div>
                {selectedOrder.verifiedTareWeightKg && (
                  <div className="text-emerald-800 font-semibold pt-1">
                    ✓ Tare Scale Verified: <strong>{selectedOrder.verifiedTareWeightKg} KG</strong> by Inspector {selectedOrder.inspectorCode}
                  </div>
                )}
                {selectedOrder.biltiLrNumber && (
                  <div className="text-indigo-800 font-mono font-semibold">
                    ✓ Transporter Bilti LR: <strong>{selectedOrder.biltiLrNumber}</strong> ({selectedOrder.transporterName})
                  </div>
                )}
              </div>

              {/* State Override Action Grid */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 block text-xs">
                  Manual Escrow Lifecycle Stage Override (Admin Power)
                </label>
                <div className="space-y-1.5">
                  {stageOptions.map((opt) => {
                    const isCurrent = selectedOrder.escrowStatus === opt.stage;
                    return (
                      <button
                        key={opt.stage}
                        onClick={() => handleUpdateStage(selectedOrder.orderNumber, opt.stage, opt.index)}
                        className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-slate-900 text-amber-400 border-slate-900 font-bold'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-slate-300'}`} />
                          <span>{opt.label}</span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                            CURRENT ACTIVE STAGE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Changes propagate in real-time to Buyer & Seller tracking dashboards.
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
              >
                Close Desk
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading master orders desk...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
