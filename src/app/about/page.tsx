'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HeartHandshake,
  ArrowRight,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Database,
  Code2,
  Layers,
  Award,
  Globe,
  Radio,
  FileText,
  Building2,
  PhoneCall,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 w-full max-w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition-colors shrink-0">
              <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 block leading-tight truncate">
                Safarku
              </span>
              <span className="text-xs sm:text-sm font-medium text-blue-600 block leading-tight truncate">
                Dokumentasi & Info Juri
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold transition-all shadow-xs"
            >
              <span>Buka Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-10 sm:space-y-12">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-sm sm:text-base font-bold shadow-2xs">
            <Award className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Karya Inovasi FIK FAIR 2026 — Tema: Aksesibilitas untuk Semua</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Pendamping Perjalanan Umrah Ramah Lansia & Inklusif
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
            <strong>Safarku</strong> adalah platform web berbasis <em>zero-barrier</em> yang dirancang khusus untuk menjembatani kesenjangan digital jamaah lansia Indonesia dan keluarganya saat menunaikan ibadah di Tanah Suci.
          </p>
        </div>

        {/* 🎯 SANDBOX & PANDUAN UJI COBA LIVE JURI */}
        <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50/90 to-white shadow-md">
          <div className="flex items-center gap-3 pb-4 border-b border-blue-200">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Panduan Uji Coba Interaktif Juri (Live Sandbox)
              </h2>
              <p className="text-base text-blue-900">
                Pilih salah satu portal di bawah untuk langsung mencoba skenario interaksi 2 arah secara *real-time*:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Opsi 1: Viewer Jamaah */}
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-900 text-sm font-bold">
                  <Eye className="w-4 h-4" />
                  <span>Sisi 1: Layar Jamaah / Keluarga</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Portal Pemantau Jamaah</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Akses tanpa login akun. Cukup pakai kode grup <strong className="text-blue-600">UMR-OKT-01</strong> untuk melihat checkpoint perjalanan, jadwal ibadah, dan tombol bantuan SOS.
                </p>
              </div>

              <Link
                href="/viewer/1"
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors"
              >
                <span>Buka Layar Jamaah</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Opsi 2: Admin Tour Leader */}
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-sm font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sisi 2: Layar Tour Leader (TL)</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Dashboard Petugas Lapangan</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Digunakan Tour Leader untuk memperbarui checkpoint rombongan secara live, menerima tiket SOS darurat, serta mengelola jadwal dan hotel.
                </p>
              </div>

              <Link
                href="/admin"
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
              >
                <span>Buka Dashboard Petugas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-100/70 border border-blue-200">
            <h4 className="text-base font-bold text-blue-950 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Skenario Rekomendasi Pengujian 1 Menit:</span>
            </h4>
            <ol className="list-decimal list-inside text-sm sm:text-base text-blue-900 space-y-1 leading-relaxed">
              <li>Buka Layar Jamaah di HP dan Dashboard Petugas di Laptop.</li>
              <li>Di Dashboard Petugas, ubah checkpoint rombongan menjadi <strong>"Sudah Lewat Imigrasi"</strong>.</li>
              <li>Perhatikan layar HP Jamaah otomatis terupdate secara sinkron dalam 10 detik!</li>
              <li>Tekan tombol merah <strong>"BUTUH BANTUAN SEKARANG"</strong> di HP, dan lihat tiket prioritas langsung masuk ke dashboard laptop petugas.</li>
            </ol>
          </div>
        </Card>

        {/* LATAR BELAKANG MASALAH & URGENSI */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Latar Belakang & Urgensi Masalah
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-1">
              Tantangan nyata yang dihadapi ribuan jamaah umrah Indonesia setiap tahunnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Demografi Lansia Tinggi</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Lebih dari 30% jamaah umrah berusia di atas 60 tahun dengan tingkat literasi digital yang terbatas dan penglihatan yang menurun.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Risiko Terpisah & Darurat</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Bandara dan Masjidil Haram yang sangat padat membuat lansia rentan terpisah, kebingungan pintu keluar, atau mengalami kendala fisik.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Kecemasan Keluarga di Tanah Air</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Keluarga di Indonesia kesulitan memantau posisi orang tua secara langsung tanpa mengganggu proses ibadah atau mengandalkan chat WA yang tenggelam.
              </p>
            </div>
          </div>
        </div>

        {/* 3 FITUR UTAMA & KEUNGGULAN SOLUSI */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              3 Fitur Unggulan Safarku
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-1">
              Desain berpusat pada lansia dengan prinsip <em>Universal Accessibility</em>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3 border-2 border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <MapPin className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">1. Live Journey Tracking</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Pelacakan posisi rombongan otomatis (Check-in, Imigrasi, Gate, Boarding) dengan sinkronisasi tiap 10 detik tanpa perlu login akun rumit.
              </p>
            </Card>

            <Card className="space-y-3 border-2 border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Building2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">2. Jadwal & Hotel Terpadu</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Informasi waktu ibadah, titik kumpul rombongan, dan direct call 1-klik ke nomor telepon hotel di Makkah/Madinah.
              </p>
            </Card>

            <Card className="space-y-3 border-2 border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">3. Tombol Bantuan Darurat (SOS)</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Tombol ekstra besar 1-sentuh saat terpisah rombongan atau butuh bantuan medis, langsung memunculkan peringatan prioritas ke Tour Leader.
              </p>
            </Card>
          </div>
        </div>

        {/* KESESUAIAN DENGAN SUSTAINABLE DEVELOPMENT GOALS (SDGs) */}
        <Card className="bg-white border-2 border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-sm font-bold border border-emerald-200 mb-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Dampak Berkelanjutan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Kesesuaian SDGs (Tujuan Pembangunan Berkelanjutan)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                SDG 3
              </span>
              <h3 className="text-lg font-bold text-emerald-950">Good Health & Well-being</h3>
              <p className="text-sm text-emerald-900 leading-relaxed">
                Mencegah keletihan ekstrem, memastikan pertolongan medis cepat saat jamaah lansia sakit di perjalanan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider">
                SDG 10
              </span>
              <h3 className="text-lg font-bold text-blue-950">Reduced Inequalities</h3>
              <p className="text-sm text-blue-900 leading-relaxed">
                Menghadirkan inklusivitas digital bagi lansia dengan antarmuka teks besar, kontras tinggi, dan tanpa password.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider">
                SDG 16
              </span>
              <h3 className="text-lg font-bold text-indigo-950">Peace, Justice & Strong Institutions</h3>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Meningkatkan transparansi, akuntabilitas, dan keamanan layanan travel umrah kepada jamaah dan keluarga.
              </p>
            </div>
          </div>
        </Card>

        {/* ARSITEKTUR & TECH STACK */}
        <Card className="bg-slate-900 text-white border-2 border-slate-800">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
            <Code2 className="w-7 h-7 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Arsitektur & Tech Stack</h2>
              <p className="text-sm text-slate-400">Fondasi teknologi modern yang andal dan skalabel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <h3 className="text-white font-bold text-base">Next.js 16 (Turbopack)</h3>
              <p className="text-sm text-slate-400">App Router, Route Handlers, dan Server Components performa tinggi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <h3 className="text-white font-bold text-base">TiDB Cloud Serverless</h3>
              <p className="text-sm text-slate-400">Database MySQL terdistribusi dengan enkripsi TLS 1.2 SSL.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <h3 className="text-white font-bold text-base">Repository Pattern</h3>
              <p className="text-sm text-slate-400">Arsitektur terisolasi dengan Prepared Statements & sanitasi query.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <h3 className="text-white font-bold text-base">Lucide Flat Icons & Tailwind</h3>
              <p className="text-sm text-slate-400">Design system ramah lansia dengan font Plus Jakarta Sans.</p>
            </div>
          </div>
        </Card>

        {/* CTA BOTTOM */}
        <div className="text-center py-6 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Siap Menguji Pengalaman Ibadah Umrah yang Lebih Tenang?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md transition-all"
            >
              <span>Mulai Coba Aplikasi Safarku</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 py-6 px-4 text-center">
        <p className="text-sm font-medium text-slate-600">
          © 2026 Safarku — Dikembangkan untuk Hackathon FIK FAIR 2026 (Akses untuk Semua)
        </p>
      </footer>
    </div>
  );
}
