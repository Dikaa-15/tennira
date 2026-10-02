'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, PhoneCall, Info } from 'lucide-react';

interface NavbarProps {
  role?: 'viewer' | 'admin';
  groupName?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role = 'viewer', groupName, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition-colors shrink-0">
            <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 block leading-tight truncate">
              Safarku
            </span>
            <span className="text-xs sm:text-sm font-medium text-blue-600 block leading-tight truncate">
              Pendamping Lansia
            </span>
          </div>
        </Link>

        {/* Right Info / Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Link Tentang / Info Juri */}
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs sm:text-sm font-bold border border-blue-200 transition-colors"
            title="Dokumentasi & Info Juri Hackathon"
          >
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Info Juri</span>
            <span className="sm:hidden">Info</span>
          </Link>

          {role === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 text-sm sm:text-base font-semibold border border-blue-200">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Tour Leader
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                >
                  Keluar
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="tel:+6281234567801"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-base font-bold transition-colors shrink-0"
                title="Kontak Darurat Petugas"
              >
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                <span className="hidden md:inline">Kontak TL:</span>
                <span className="text-blue-700">0812-3456-7801</span>
              </a>
            </div>
          )}
        </div>
      </div>
      {groupName && (
        <div className="bg-blue-50/80 border-t border-blue-100 py-1 px-3 sm:px-4 text-center">
          <p className="text-xs sm:text-base font-medium text-blue-900 break-words leading-snug">
            Rombongan: <strong className="font-bold text-slate-900">{groupName}</strong>
          </p>
        </div>
      )}
    </header>
  );
};
