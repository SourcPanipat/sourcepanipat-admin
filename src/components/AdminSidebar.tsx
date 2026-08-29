'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  UserCheck, 
  Layers, 
  AlertTriangle, 
  Truck, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Scale
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Operations Command',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Sellers & Godown KYC',
      href: '/sellers',
      icon: Building2,
      badge: '2 Pending',
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      name: 'Field QC Inspectors',
      href: '/inspectors',
      icon: Scale,
      badge: '4 Active',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      name: 'Category & Sub-Tree',
      href: '/categories',
      icon: Layers,
      badge: '8 Trees',
      badgeColor: 'bg-slate-800 text-slate-400',
    },
    {
      name: 'Disputes & Escrow Holds',
      href: '/disputes',
      icon: AlertTriangle,
      badge: '1 Open',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      name: 'Master Orders & Tracking',
      href: '/orders',
      icon: Truck,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen text-slate-300">
      
      <div>
        {/* Logo & Portal Tag */}
        <div className="p-4 border-b border-slate-800 space-y-2.5">
          <Link href="/" className="flex items-center">
            <div className="relative h-9 w-48">
              <Image
                src="/logo-dark-horizontal.png"
                alt="SourcePanipat Admin"
                fill
                priority
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded uppercase">
              Admin Command Desk
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Escrow
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 text-xs font-semibold">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider px-3 py-1 font-bold">
            Master Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* External App Switcher */}
      <div className="p-3 border-t border-slate-800 space-y-2 text-xs">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider px-2 font-bold">
          Portals Switcher
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 flex items-center justify-between transition-colors text-[11px]"
        >
          <span>Buyer Marketplace (Port 3000)</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 flex items-center justify-between transition-colors text-[11px]"
        >
          <span>Seller Godown Desk (Port 3001)</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        <div className="pt-2 text-[10.5px] text-slate-500 px-2 flex items-center justify-between">
          <span>SourcePanipat v2.0</span>
          <span>ICICI Nodal Node</span>
        </div>
      </div>

    </aside>
  );
}
