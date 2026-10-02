import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sakinah — Pendamping Perjalanan Umrah Ramah Lansia',
  description:
    'Sistem informasi terpadu pemantau status perjalanan dan pendamping jamaah umrah ramah lansia & keluarga.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} font-sans`}>
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
