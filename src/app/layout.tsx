import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Safarku — Pendamping Perjalanan Umrah Ramah Lansia',
  description:
    'Platform pendamping perjalanan umrah terpadu dan ramah lansia: Live journey status, pusat info perjalanan, dan tombol bantuan darurat cepat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
