'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { 
  Building2, 
  Scale, 
  AlertTriangle, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  MapPin,
  FileCheck,
  Package
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [pendingSellersCount, setPendingSellersCount] = useState(0);
  const [pendingLotsCount, setPendingLotsCount] = useState(0);
  const [totalEscrowHeld, setTotalEscrowHeld] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [urgentActions, setUrgentActions] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Pending Sellers
    const storedSellers = localStorage.getItem('sp_registered_sellers');
    const activeSeller = localStorage.getItem('sp_active_seller');
    let allSellers: any[] = [];
    if (storedSellers) {
      try { allSellers = JSON.parse(storedSellers); } catch (e) {}
    }
    if (activeSeller) {
      try {
        const parsed = JSON.parse(activeSeller);
        if (!allSellers.some(s => s.id === parsed.id || s.email === parsed.email)) {
          allSellers.push(parsed);
        }
      } catch (e) {}
    }
    const pendingSellers = allSellers.filter(s => s.verificationStatus === 'pending_approval');
    setPendingSellersCount(pendingSellers.length);

    // 2. Pending Lots
    const storedLots = localStorage.getItem('sp_seller_lots');
    let allLots: any[] = [];
    if (storedLots) {
      try { allLots = JSON.parse(storedLots); } catch (e) {}
    }
    const pendingLots = allLots.filter(l => l.status === 'pending_approval');
    setPendingLotsCount(pendingLots.length);

    // 3. Orders & Escrow
    const storedOrders = localStorage.getItem('sp_escrow_orders');
    const recentOrder = localStorage.getItem('sp_recent_order');
    let allOrders: any[] = [];
    if (storedOrders) {
      try { allOrders = JSON.parse(storedOrders); } catch (e) {}
    }
    if (recentOrder) {
      try {
        const parsed = JSON.parse(recentOrder);
        if (!allOrders.some(o => o.orderNumber === parsed.orderNumber || o.id === parsed.id)) {
          allOrders.unshift(parsed);
        }
      } catch (e) {}
    }
    setRecentOrders(allOrders);

    const totalHeld = allOrders.reduce((sum, o) => sum + (Number(o.totalPayable || o.totalAmount || 0)), 0);
    setTotalEscrowHeld(totalHeld);

    // 4. Build Urgent Actions
    const actions: any[] = [];
    pendingSellers.forEach(s => {
      actions.push({
        id: `kyc-${s.id}`,
        title: `Godown Application: ${s.businessName || s.fullName} (${s.maskedCode || 'PENDING'})`,
        type: 'KYC Review',
        desc: `${s.godownZone || 'Panipat Godown Hub'} • GSTIN & documents submitted. Needs verification.`,
        href: '/sellers',
        cta: 'Review Application',
        priority: 'HIGH',
      });
    });

    pendingLots.forEach(l => {
      actions.push({
        id: `lot-${l.id}`,
        title: `Staged Bale Approval: ${l.title} (${l.sellerMaskedCode || '#PNP'})`,
        type: 'Listing Staging',
        desc: `New lot staged with 30s opening video & Grade breakdown. Needs audit.`,
        href: '/listings',
        cta: 'Review & Publish',
        priority: 'URGENT',
      });
    });

    setUrgentActions(actions);
  }, []);

  const kpis = [
    {
      title: 'Total Escrow Funds Held',
      value: totalEscrowHeld > 0 ? formatINR(totalEscrowHeld) : '₹0',
      subtitle: 'ICICI Nodal Locked',
      icon: Lock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Pending Godown KYC',
      value: `${pendingSellersCount} Applications`,
      subtitle: pendingSellersCount > 0 ? 'Requires Yard Audit' : 'All Verified',
      icon: Building2,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      link: '/sellers',
    },
    {
      title: 'Active Panipat Inspectors',
      value: '4 on Ground',
      subtitle: 'Sanoli & Noorwala Hubs',
      icon: Scale,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/inspectors',
    },
    {
      title: 'Pending Lot Approvals',
      value: `${pendingLotsCount} Lots Staged`,
      subtitle: pendingLotsCount > 0 ? 'New & Edited Bales' : 'Queue Clear',
      icon: FileCheck,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      link: '/listings',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Master Operations Command Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Panipat textile godown vetting, tare weight QC dispatch approvals, and ICICI escrow nodal settlements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sellers"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Review KYC Applications</span>
            {pendingSellersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                {pendingSellersCount}
              </span>
            )}
          </Link>
          <Link
            href="/listings"
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Listing Approvals</span>
            {pendingLotsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-white font-black text-[10px]">
                {pendingLotsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xl font-black text-slate-900">{kpi.value}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                  <span>{kpi.subtitle}</span>
                  {kpi.link && (
                    <Link href={kpi.link} className="text-amber-700 font-bold hover:underline">
                      Manage Module →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Urgent Operations Action Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Urgent Operations Action Queue
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {urgentActions.length} Items Require Attention
          </span>
        </div>

        {urgentActions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-bold text-slate-900 text-xs">Action Queue Clear</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              No pending seller applications or staged lots awaiting review. New godown submissions will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {urgentActions.map((action) => (
              <div key={action.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{action.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800">
                      {action.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>

                <Link
                  href={action.href}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 self-start sm:self-center transition-colors"
                >
                  {action.cta} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Hub Vetting & Live Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hub Verification Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-700" />
              <span>Panipat Wholesale Hub Grid</span>
            </h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              4 Active Hubs
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Sanoli Road</div>
                <div className="text-[11px] text-slate-500">Major Synthetic & Imported Bales Hub</div>
              </div>
              <span className="text-xs font-bold text-slate-700">Verified</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Noorwala Area</div>
                <div className="text-[11px] text-slate-500">Fleece, Shoddy & Yarn Recycling Mills</div>
              </div>
              <span className="text-xs font-bold text-slate-700">Verified</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Barsat Road</div>
                <div className="text-[11px] text-slate-500">Graded Sorting & Heavy Blanket Yards</div>
              </div>
              <span className="text-xs font-bold text-slate-700">Verified</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">G.T. Road Bilti Hub</div>
                <div className="text-[11px] text-slate-500">V-Trans, TCI & ARC Transporter Depots</div>
              </div>
              <span className="text-xs font-bold text-slate-700">Verified</span>
            </div>
          </div>
        </div>

        {/* Live Escrow Orders Tracking */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>Live Escrow Orders Tracking</span>
            </h2>
            <Link href="/orders" className="text-xs text-amber-700 font-bold hover:underline">
              View All ({recentOrders.length}) →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-900 text-xs">No live escrow orders placed yet</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Orders placed by buyers will appear here in real time for tare weight verification, inspector dispatch, and transporter bilti release.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id || order.orderNumber} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{order.orderNumber}</span>
                      <span>•</span>
                      <span className="text-emerald-800">{formatINR(order.totalPayable || order.totalAmount || 0)}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {order.baleTitle} • Buyer: {order.buyerBusinessName || order.buyerName || 'Verified Buyer'}
                    </div>
                  </div>

                  <Link
                    href={`/orders?q=${order.orderNumber}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] shrink-0 self-start sm:self-center transition-colors"
                  >
                    Manage Order →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
