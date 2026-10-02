'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

interface NavbarProps {
  role?: 'viewer' | 'admin';
  groupName?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role = 'viewer', groupName, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition-colors">
            <HeartHandshake className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 block leading-tight">
              Safarku
            </span>
            <span className="text-sm font-medium text-blue-600 block leading-tight">
              Pendamping Umrah Lansia
            </span>
          </div>
        </Link>

        {/* Right Info / Action */}
        <div className="flex items-center gap-3">
          {role === 'admin' ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 text-base font-semibold border border-blue-200">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Tour Leader / Admin
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-base font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                >
                  Keluar
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="tel:+6281234567801"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-base font-bold transition-colors"
                title="Kontak Darurat Petugas"
              >
                <PhoneCall className="w-5 h-5 text-blue-600" />
                <span className="hidden sm:inline">Kontak TL:</span>
                <span className="text-blue-700">0812-3456-7801</span>
              </a>
            </div>
          )}
        </div>
      </div>
      {groupName && (
        <div className="bg-blue-50/70 border-t border-blue-100 py-1.5 px-4 text-center">
          <p className="text-base font-medium text-blue-900">
            Rombongan: <strong className="font-bold text-slate-900">{groupName}</strong>
          </p>
        </div>
      )}
    </header>
  );
};
