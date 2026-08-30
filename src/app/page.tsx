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
  Package,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { 
  getDashboardKpiMetricsFromDb, 
  getAllSellersFromDb, 
  getAllListingsForAdminFromDb 
} from '@/lib/supabase-admin';

export default function AdminDashboardPage() {
  const [pendingSellersCount, setPendingSellersCount] = useState(0);
  const [pendingLotsCount, setPendingLotsCount] = useState(0);
  const [totalEscrowHeld, setTotalEscrowHeld] = useState(0);
  const [totalSellersCount, setTotalSellersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [urgentActions, setUrgentActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [kpiMetrics, sellers, listings] = await Promise.all([
        getDashboardKpiMetricsFromDb(),
        getAllSellersFromDb(),
        getAllListingsForAdminFromDb(),
      ]);

      const pendingSellers = sellers.filter(s => s.verificationStatus === 'pending_approval');
      const pendingLots = listings.filter(l => l.status === 'pending_approval');

      setPendingSellersCount(pendingSellers.length);
      setPendingLotsCount(pendingLots.length);
      setTotalSellersCount(sellers.length);
      setTotalEscrowHeld(kpiMetrics.totalEscrowHeld);
      setRecentOrders(kpiMetrics.recentOrders);

      // Build Urgent Actions
      const actions: any[] = [];
      pendingSellers.forEach(s => {
        actions.push({
          id: `kyc-${s.id}`,
          title: `Godown Application: ${s.businessName || s.fullName} (${s.maskedCode || 'PENDING'})`,
          type: 'KYC Review',
          desc: `${s.godownZone || 'Panipat Godown Hub'} • GSTIN & premises submitted. Needs audit.`,
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
          desc: `New lot staged with 30s opening unboxing video & QC grades. Needs audit.`,
          href: '/listings',
          cta: 'Review & Publish',
          priority: 'URGENT',
        });
      });

      setUrgentActions(actions);
    } catch (err) {
      console.error('Error loading admin dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const kpis = [
    {
      title: 'Pending Godown KYC Audits',
      value: pendingSellersCount.toString(),
      subtext: `${totalSellersCount} total registered godowns`,
      icon: Building2,
      trend: pendingSellersCount > 0 ? `${pendingSellersCount} requires action` : 'All caught up',
      trendColor: pendingSellersCount > 0 ? 'text-amber-800 bg-amber-50' : 'text-emerald-800 bg-emerald-50',
      href: '/sellers',
    },
    {
      title: 'Pending Listing Approvals',
      value: pendingLotsCount.toString(),
      subtext: 'Staged wholesale bales and price edits',
      icon: Layers,
      trend: pendingLotsCount > 0 ? `${pendingLotsCount} staged` : '0 staged',
      trendColor: pendingLotsCount > 0 ? 'text-amber-800 bg-amber-50' : 'text-emerald-800 bg-emerald-50',
      href: '/listings',
    },
    {
      title: 'Total Escrow Held',
      value: formatINR(totalEscrowHeld),
      subtext: 'Nodal ICICI escrow holding balance',
      icon: Lock,
      trend: '100% Protected',
      trendColor: 'text-emerald-800 bg-emerald-50',
      href: '/orders',
    },
    {
      title: 'Active Field QC Inspectors',
      value: '4 Active',
      subtext: 'Sanoli, Noorwala & Barsat Road hubs',
      icon: Scale,
      trend: 'Live on ground',
      trendColor: 'text-emerald-800 bg-emerald-50',
      href: '/inspectors',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Master Operations Command Desk
            </h1>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Escrow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Panipat textile godown vetting, tare weight QC dispatch approvals, and ICICI escrow nodal settlements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.href}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.title}</span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {kpi.subtext}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${kpi.trendColor}`}>
                  {kpi.trend}
                </span>
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Action Required Feed + Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Urgent Action Approvals Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Approvals Queue ({urgentActions.length})</span>
                </h2>
                <p className="text-xs text-slate-500">Live godown vetting applications & staged bale listings</p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Real-time DB Sync</span>
            </div>

            {urgentActions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-slate-800 text-xs">All Audits Up to Date</div>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  There are no pending godown applications or staged listing approvals awaiting audit.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {urgentActions.map((action) => (
                  <div key={action.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          action.priority === 'URGENT' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {action.type}
                        </span>
                        <span className="font-bold text-slate-900">{action.title}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{action.desc}</p>
                    </div>

                    <Link
                      href={action.href}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 shadow-xs"
                    >
                      {action.cta} →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Operations Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Operations Hubs & Quick Links
            </h2>
            
            <div className="space-y-2 text-xs font-semibold">
              <Link
                href="/sellers"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>Review KYC Applications ({pendingSellersCount})</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/listings"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>Audit Staged Bale Listings ({pendingLotsCount})</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/orders"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-600" />
                  <span>Inspect Dispatches & Bilti Uploads</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/inspectors"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-slate-600" />
                  <span>Field QC Coordinator Agent Desk</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
