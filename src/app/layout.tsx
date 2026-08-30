import type { Metadata } from 'next';
import './globals.css';
import { AdminLayoutClient } from '@/components/AdminLayoutClient';

export const dynamic = 'force-dynamic';

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
      <body>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
