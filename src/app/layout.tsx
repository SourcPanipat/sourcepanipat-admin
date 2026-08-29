import type { Metadata } from 'next';
import './globals.css';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';

export const metadata: Metadata = {
  title: 'SourcePanipat Admin • Master Operations & Escrow Command Center',
  description: 'Internal operations dashboard for Panipat godown vetting, tare weight QC inspectors, and ICICI escrow releases.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/logo-icon.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo-icon.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex selection:bg-amber-500 selection:text-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-900 min-h-screen">
          <AdminHeader />
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
