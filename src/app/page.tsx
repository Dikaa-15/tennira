'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ArrowRight, Shield, Sparkles, PhoneCall, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showErrorAlert } from '@/utils/sweetAlert';

export default function HomePage() {
  const router = useRouter();
  const [kodeGrup, setKodeGrup] = useState<string>('UMR-OKT-01');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMasukViewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeGrup.trim()) {
      showErrorAlert('Perhatian', 'Mohon masukkan Kode Grup Keberangkatan Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/viewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kode_grup: kodeGrup.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Kode grup tidak ditemukan');
      }

      // Navigate to viewer page
      router.push(`/viewer/${data.keberangkatan_id}`);
    } catch (err: any) {
      showErrorAlert('Gagal Masuk', err.message || 'Kode grup tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (kode: string) => {
    setKodeGrup(kode);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Safarku
              </h1>
              <p className="text-sm font-semibold text-blue-600">
                Pendamping Perjalanan Umrah Ramah Lansia
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-600 text-base font-bold transition-all bg-white cursor-pointer"
          >
            <Shield className="w-5 h-5" />
            <span>Portal Petugas (TL)</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Banner Kartu Utama */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-800 text-base font-bold border border-blue-200 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Pantau Perjalanan Tanpa Perlu Akun</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Selamat Datang di Portal Jamaah & Keluarga
          </h2>

          <p className="text-lg sm:text-xl text-slate-700 mt-3 leading-relaxed">
            Masukkan kode grup keberangkatan dari pihak travel untuk memantau status rombongan, jadwal ibadah, dan bantuan darurat.
          </p>

          {/* Form Input Kode */}
          <form onSubmit={handleMasukViewer} className="mt-8 space-y-4 text-left">
            <div>
              <label
                htmlFor="kode_grup"
                className="block text-lg font-bold text-slate-900 mb-2"
              >
                Kode Akses Rombongan:
              </label>
              <input
                id="kode_grup"
                type="text"
                value={kodeGrup}
                onChange={(e) => setKodeGrup(e.target.value.toUpperCase())}
                placeholder="Contoh: UMR-OKT-01"
                className="w-full h-14 min-h-[56px] px-5 rounded-2xl border-2 border-slate-300 text-xl font-bold text-slate-900 uppercase tracking-wider focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all"
                autoComplete="off"
              />
            </div>

            {/* Quick Demo Preset */}
            <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200">
              <p className="text-base font-semibold text-blue-900 mb-2">
                💡 Kode Contoh Demo Penjurian:
              </p>
              <button
                type="button"
                onClick={() => handleQuickDemo('UMR-OKT-01')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 text-base font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>UMR-OKT-01 (Rombongan Barokah)</span>
              </button>
            </div>

            <Button
              type="submit"
              size="large"
              className="w-full text-xl"
              isLoading={isLoading}
            >
              <span>Lihat Status Perjalanan</span>
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </form>
        </div>

        {/* 3 Keunggulan Ramah Lansia */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
            <div className="text-2xl mb-1">🔍</div>
            <h3 className="text-lg font-bold text-slate-900">Tulisan Besar & Jelas</h3>
            <p className="text-base text-slate-600 mt-1">
              Didesain khusus ramah lansia, nyaman dibaca tanpa kacamata pembesar.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <h3 className="text-lg font-bold text-slate-900">Update Berkala Otomatis</h3>
            <p className="text-base text-slate-600 mt-1">
              Layar memperbarui posisi rombongan otomatis setiap 10–15 detik.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
            <div className="text-2xl mb-1">🚨</div>
            <h3 className="text-lg font-bold text-slate-900">Tombol Bantuan Cepat</h3>
            <p className="text-base text-slate-600 mt-1">
              Satu kali sentuh saat terpisah rombongan atau butuh bantuan darurat.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 py-6 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-base font-medium text-slate-600">
            © 2026 Safarku — Hackathon FIK FAIR 2026 (Akses untuk Semua)
          </p>
          <div className="flex items-center gap-4 text-base font-bold text-slate-700">
            <a href="tel:+6281234567801" className="flex items-center gap-1.5 hover:text-blue-600">
              <PhoneCall className="w-5 h-5 text-blue-600" />
              <span>Bantuan Travel: 0812-3456-7801</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
