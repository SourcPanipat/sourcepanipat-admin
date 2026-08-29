'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  User, 
  Lock, 
  ExternalLink,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export function AdminHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/orders?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Global Universal Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order #, Seller #PNP, Buyer Mobile, or Inspector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none"
            />
          </div>
        </form>

        {/* Right Status Badges & Admin Profile */}
        <div className="flex items-center gap-3 text-xs">
          
          {/* Nodal Escrow Connection Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ICICI Escrow Active</span>
          </div>

          {/* Panipat Hub Sourcing Desk */}
          <div className="hidden lg:flex items-center gap-1 text-slate-600 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Panipat Central Yard Desk</span>
          </div>

          {/* Admin User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs">
              AD
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="font-bold text-slate-900 text-xs">Admin Desk</div>
              <div className="text-[10px] text-slate-500 font-mono">#PNP-ADMIN-01</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
