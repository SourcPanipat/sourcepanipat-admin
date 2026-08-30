'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex">
        <div className="w-64 bg-slate-900 min-h-screen hidden sm:block" />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-900 min-h-screen">
          <div className="h-12 bg-white border-b border-slate-200" />
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex selection:bg-amber-500 selection:text-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-900 min-h-screen">
        <AdminHeader />
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayoutClient;
