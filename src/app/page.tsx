'use client';

import React from 'react';
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
  FileCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const kpis = [
    {
      title: 'Total Escrow Funds Held',
      value: formatINR(14280000),
      subtitle: 'ICICI Nodal Locked',
      icon: Lock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Pending Godown KYC',
      value: '2 Applications',
      subtitle: 'Requires Yard Audit',
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
      title: 'Open Dispute Claims',
      value: '1 Active Claim',
      subtitle: 'Tare Weight Discrepancy',
      icon: AlertTriangle,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      link: '/disputes',
    },
  ];

  const urgentActions = [
    {
      id: 'act-1',
      title: 'Godown Application: Mittal Woollen Mill (#PNP-APP-07)',
      type: 'KYC Review',
      desc: 'Sanoli Road Godown Hub • GSTIN & Yard photo uploaded. Needs approval.',
      href: '/sellers',
      cta: 'Review Application',
      priority: 'HIGH',
    },
    {
      id: 'act-2',
      title: 'Tare Scale Discrepancy: Order SP-ESCROW-782190',
      type: 'Dispute Hold',
      desc: 'Buyer reported 78.2kg received vs 81.4kg billed. Inspector photo attached.',
      href: '/disputes',
      cta: 'Review Evidence',
      priority: 'URGENT',
    },
    {
      id: 'act-3',
      title: 'Assign Inspector: Order SP-ESCROW-551980',
      type: 'Inspector Queue',
      desc: '100kg Heavy Fleece Hoodies at Noorwala Yard ready for 30s video.',
      href: '/inspectors',
      cta: 'Allocate Inspector',
      priority: 'NORMAL',
    },
  ];

  const recentOrders = [
    {
      orderNumber: 'SP-ESCROW-782190',
      lot: 'Korean Heavy Puffer Jackets (80kg)',
      seller: '#PNP-001 (Gupta Syndicate)',
      buyer: 'Urban Vintage Thrift (Delhi NCR)',
      amount: 33000,
      stage: 'QC Tare Weight Approved',
      statusColor: 'bg-amber-50 text-amber-900 border-amber-300',
    },
    {
      orderNumber: 'SP-ESCROW-640192',
      lot: 'Vintage Heavy Denim Jackets (100kg)',
      seller: '#PNP-002 (Haryana Mill)',
      buyer: 'Pop Thrift Studio (Mumbai)',
      amount: 89000,
      stage: 'Dispatched (Bilti LR Uploaded)',
      statusColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      orderNumber: 'SP-ESCROW-551980',
      lot: 'Double-Ply Heavy Mink Blankets (100kg)',
      seller: '#PNP-004 (Shree Ganesh)',
      buyer: 'Himalayan Thrift (Guwahati)',
      amount: 28000,
      stage: 'Inspector Assigned (#PNP-INSP-01)',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-200',
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
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Review KYC Applications (2)
          </Link>
          <Link
            href="/disputes"
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors"
          >
            Disputes Desk
          </Link>
        </div>
      </div>

      {/* 4 Main Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-xs text-slate-500 font-medium">{kpi.title}</div>
                <div className="text-xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-slate-600 font-semibold">{kpi.subtitle}</div>
                {kpi.link && (
                  <Link href={kpi.link} className="text-[11px] text-slate-900 hover:underline font-bold inline-block pt-1">
                    Manage Module →
                  </Link>
                )}
              </div>
              <div className={`p-2.5 rounded-lg ${kpi.bg} ${kpi.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Urgent Action Queue & Live Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Urgent Action Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Urgent Operations Action Queue</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-semibold">3 Items Require Attention</span>
          </div>

          <div className="space-y-3">
            {urgentActions.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-amber-400 font-mono text-[10px] font-bold">
                      {act.type}
                    </span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                      act.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {act.priority}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {act.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {act.desc}
                  </p>
                </div>

                <Link
                  href={act.href}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 self-start sm:self-center shadow-xs transition-colors"
                >
                  {act.cta} →
                </Link>
              </div>
            ))}
          </div>

          {/* Panipat Hub Yard Sourcing Strip */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Panipat Wholesale Hub Verification Grid</span>
              </span>
              <span className="text-[10px] text-slate-400">4 Active Hubs</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2 rounded bg-slate-800 border border-slate-700">
                <div className="text-[10px] text-slate-400">Sanoli Road</div>
                <div className="font-bold text-white">12 Godowns</div>
              </div>
              <div className="p-2 rounded bg-slate-800 border border-slate-700">
                <div className="text-[10px] text-slate-400">Noorwala Area</div>
                <div className="font-bold text-white">8 Godowns</div>
              </div>
              <div className="p-2 rounded bg-slate-800 border border-slate-700">
                <div className="text-[10px] text-slate-400">Barsat Road</div>
                <div className="font-bold text-white">6 Godowns</div>
              </div>
              <div className="p-2 rounded bg-slate-800 border border-slate-700">
                <div className="text-[10px] text-slate-400">G.T. Road Bilti</div>
                <div className="font-bold text-white">4 Transporters</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Live Escrow Orders Ledger (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>Live Escrow Orders Tracking</span>
            </h2>
            <Link href="/orders" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.orderNumber}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                  <span className="font-bold text-slate-900">{formatINR(ord.amount)}</span>
                </div>

                <div className="font-semibold text-slate-800 line-clamp-1">{ord.lot}</div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Seller: <strong className="text-slate-700">{ord.seller}</strong></div>
                  <div>Buyer: <strong className="text-slate-700">{ord.buyer}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ord.statusColor}`}>
                    {ord.stage}
                  </span>
                  <Link
                    href={`/orders?q=${ord.orderNumber}`}
                    className="font-bold text-slate-900 hover:underline text-[11px]"
                  >
                    Manage State →
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
