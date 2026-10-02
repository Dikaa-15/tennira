'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  HeartHandshake,
  Calendar,
  Building2,
  PhoneCall,
  Clock,
  RefreshCw,
  AlertCircle,
  Users,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BantuanModal } from '@/components/BantuanModal';
import { formatTimeOnly, formatDateTime, formatRelativeTime } from '@/utils/dateHelper';

interface JamaahItem {
  id: number;
  nama: string;
  nomor_paspor?: string;
  kontak_keluarga?: string;
  status_terkini?: string;
}

interface ItineraryItem {
  id: number;
  hari_ke: number;
  judul_kegiatan: string;
  waktu: string;
  catatan?: string;
}

interface HotelItem {
  id: number;
  nama_hotel: string;
  kota: string;
  alamat: string;
  kontak: string;
}

interface StatusData {
  status_terkini: string;
  catatan_terkini?: string | null;
  waktu_terkini?: string | null;
  riwayat: {
    id: number;
    checkpoint: string;
    catatan?: string | null;
    dicatat_oleh?: string;
    timestamp: string;
  }[];
}

function ViewerContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const keberangkatanId = Number(params.id);

  const initialTabParam = searchParams.get('tab');
  const isViewAll = searchParams.get('view') === 'all';
  const initialModalParam = searchParams.get('modal') === 'bantuan';

  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [jamaahList, setJamaahList] = useState<JamaahItem[]>([]);
  const [selectedJamaahId, setSelectedJamaahId] = useState<number>(1);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [itineraryList, setItineraryList] = useState<ItineraryItem[]>([]);
  const [hotelList, setHotelList] = useState<HotelItem[]>([]);

  // Active Bantuan Request State
  const [hasActiveBantuan, setHasActiveBantuan] = useState<boolean>(false);
  const [activeBantuanData, setActiveBantuanData] = useState<any>(null);

  const [isBantuanModalOpen, setIsBantuanModalOpen] = useState<boolean>(initialModalParam);
  const [activeTab, setActiveTab] = useState<'status' | 'jadwal' | 'hotel'>(
    initialTabParam === 'jadwal' || initialTabParam === 'hotel' ? initialTabParam : 'status'
  );
  const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync tab change to URL param without hard reload
  const handleTabChange = (tab: 'status' | 'jadwal' | 'hotel') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // 1. Fetch Master Data (Group, Jamaah, Itinerary, Hotel)
  useEffect(() => {
    if (!keberangkatanId) return;

    const fetchInitialData = async () => {
      try {
        // Group & Hotel detail
        const resGroup = await fetch(`/api/keberangkatan/${keberangkatanId}`);
        if (resGroup.ok) {
          const gData = await resGroup.json();
          setGroupInfo(gData);
          if (gData.hotels) setHotelList(gData.hotels);
          if (gData.itinerary) setItineraryList(gData.itinerary);
        }

        // Jamaah list
        const resJamaah = await fetch(`/api/keberangkatan/${keberangkatanId}/jamaah`);
        if (resJamaah.ok) {
          const jData = await resJamaah.json();
          if (jData.data && jData.data.length > 0) {
            setJamaahList(jData.data);
            setSelectedJamaahId(jData.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching initial group data', err);
      }
    };

    fetchInitialData();
  }, [keberangkatanId]);

  // 2. Fetch Status & Active Bantuan for Selected Jamaah (Polling Every 10 Seconds)
  const fetchStatus = useCallback(
    async (isManual = false) => {
      if (!selectedJamaahId) return;
      if (isManual) setIsRefreshing(true);

      try {
        // 1. Fetch Status
        const resStatus = await fetch(`/api/jamaah/${selectedJamaahId}/status`);
        if (resStatus.ok) {
          const data = await resStatus.json();
          setStatusData(data);
          setLastRefreshed(new Date());
        }

        // 2. Check Active Bantuan
        const resBantuan = await fetch(`/api/jamaah/${selectedJamaahId}/bantuan`);
        if (resBantuan.ok) {
          const bData = await resBantuan.json();
          setHasActiveBantuan(bData.has_active_request);
          setActiveBantuanData(bData.active_bantuan || null);
        }
      } catch (err) {
        console.error('Error polling status & bantuan', err);
      } finally {
        if (isManual) setIsRefreshing(false);
      }
    },
    [selectedJamaahId]
  );

  useEffect(() => {
    fetchStatus();
    if (!isPollingActive) return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 10000); // 10s polling

    return () => clearInterval(interval);
  }, [fetchStatus, isPollingActive]);

  const selectedJamaah = jamaahList.find((j) => j.id === selectedJamaahId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      <Navbar
        role="viewer"
        groupName={groupInfo?.nama_grup || 'Rombongan Umrah Barokah'}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex-1 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Tombol Darurat Lansia (Fitur 3) / Banner Status Bantuan Aktif */}
        {hasActiveBantuan ? (
          <div className="bg-amber-50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-sm space-y-3 max-w-full overflow-hidden">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                    Sedang Diproses
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-amber-900">
                    {formatRelativeTime(activeBantuanData?.timestamp)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-amber-950 mt-1 leading-tight">
                  Permintaan Bantuan Sedang Ditangani
                </h2>
                <p className="text-sm sm:text-base text-amber-900 mt-1 leading-relaxed break-words">
                  Laporan kendala <strong className="uppercase font-bold">{activeBantuanData?.kategori?.replace('_', ' ')}</strong> telah diterima oleh Petugas Tour Leader (Ust. Rahmat). Mohon tetap di lokasi agar mudah dijangkau.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="default"
              onClick={() => setIsBantuanModalOpen(true)}
              className="w-full bg-white hover:bg-amber-100/50 border-amber-400 text-amber-950 font-bold text-sm sm:text-base"
            >
              Lihat Detail Status Bantuan
            </Button>
          </div>
        ) : (
          <div className="bg-red-50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-red-300 shadow-sm max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-red-950 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />
                  <span>Tombol Bantuan Darurat Jamaah</span>
                </h2>
                <p className="text-sm sm:text-base text-red-800 mt-0.5">
                  Tekan jika Anda terpisah dari rombongan, tertinggal, atau butuh medis.
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="emergency"
              onClick={() => setIsBantuanModalOpen(true)}
              className="text-lg sm:text-xl font-bold tracking-wide flex items-center justify-center gap-2 sm:gap-3 w-full"
            >
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] shrink-0" />
              <span>BUTUH BANTUAN SEKARANG</span>
            </Button>
          </div>
        )}

        {/* Pemilihan Profil Jamaah (Jika Memantau Anggota Tertentu) */}
        <Card className="bg-white">
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider block">
                Memantau Jamaah:
              </span>
              <div className="flex items-center gap-2 mt-1 min-w-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 shrink-0" />
                <span className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
                  {selectedJamaah?.nama || 'H. Ahmad Dahlan'}
                </span>
              </div>
            </div>

            {jamaahList.length > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
                <label htmlFor="jamaah_select" className="text-sm sm:text-base font-semibold text-slate-700 shrink-0">
                  Ganti Pilihan Jamaah:
                </label>
                <select
                  id="jamaah_select"
                  value={selectedJamaahId}
                  onChange={(e) => setSelectedJamaahId(Number(e.target.value))}
                  className="h-12 px-3 rounded-xl border-2 border-slate-300 text-sm sm:text-base font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none w-full max-w-full truncate"
                >
                  {jamaahList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nama}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Tab Navigasi Ramah Lansia (Besar, Jelas, Kontras & Stack Vertikal di Mobile) */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-slate-200/80 p-1 sm:p-1.5 rounded-2xl max-w-full">
          <button
            onClick={() => handleTabChange('status')}
            className={`min-h-[52px] sm:min-h-[56px] py-2 px-1 rounded-xl font-bold text-xs sm:text-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 'status'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span className="text-center leading-tight">Posisi Terkini</span>
          </button>
          <button
            onClick={() => handleTabChange('jadwal')}
            className={`min-h-[52px] sm:min-h-[56px] py-2 px-1 rounded-xl font-bold text-xs sm:text-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 'jadwal'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span className="text-center leading-tight">Jadwal Acara</span>
          </button>
          <button
            onClick={() => handleTabChange('hotel')}
            className={`min-h-[52px] sm:min-h-[56px] py-2 px-1 rounded-xl font-bold text-xs sm:text-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 'hotel'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span className="text-center leading-tight">Info Hotel</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: LIVE JOURNEY STATUS (FITUR 1)                     */}
        {/* ======================================================== */}
        {(activeTab === 'status' || isViewAll) && (
          <div className="space-y-4 sm:space-y-6">
            {/* Status Card Utama */}
            <Card className="border-2 border-blue-200 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Status Perjalanan Terkini
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Dicatat langsung oleh Petugas Tour Leader di lapangan
                  </p>
                </div>

                {/* Polling Indicator */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Polling (10s)
                  </span>
                  <button
                    onClick={() => fetchStatus(true)}
                    disabled={isRefreshing}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title="Refresh status manual"
                  >
                    <RefreshCw
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Status Badge Besar */}
              <div className="py-4 sm:py-6">
                <StatusBadge
                  checkpoint={statusData?.status_terkini || 'check_in'}
                  size="large"
                />

                {statusData?.catatan_terkini && (
                  <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-lg text-slate-800 flex items-start gap-2.5">
                    <MessageSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="break-words min-w-0">
                      <strong className="text-slate-900">Catatan Petugas:</strong>{' '}
                      {statusData.catatan_terkini}
                    </div>
                  </div>
                )}

                <p className="text-xs sm:text-base text-slate-500 mt-3 flex items-center gap-1.5 flex-wrap">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Waktu update: <strong>{formatDateTime(statusData?.waktu_terkini)}</strong></span>
                  <span>({formatRelativeTime(statusData?.waktu_terkini)})</span>
                </p>
              </div>
            </Card>

            {/* Riwayat / Timeline Checkpoint */}
            <Card className="bg-white">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
                Riwayat Perjalanan (Checkpoint)
              </h3>

              <div className="relative border-l-4 border-blue-500 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-6 sm:space-y-8">
                {statusData?.riwayat && statusData.riwayat.length > 0 ? (
                  statusData.riwayat.map((item, idx) => (
                    <div key={item.id || idx} className="relative">
                      {/* Dot icon on line */}
                      <div className="absolute -left-[27px] sm:-left-[35px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center"></div>

                      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <StatusBadge checkpoint={item.checkpoint} size="normal" />
                          <span className="text-sm sm:text-base font-bold text-slate-700">
                            {formatTimeOnly(item.timestamp)}
                          </span>
                        </div>

                        {item.catatan && (
                          <p className="text-sm sm:text-base text-slate-800 mt-2 break-words">
                            {item.catatan}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                          Dicatat oleh: {item.dicatat_oleh || 'Tour Leader'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base sm:text-lg text-slate-600">Belum ada riwayat checkpoint.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: JADWAL & ITINERARY (FITUR 2)                      */}
        {/* ======================================================== */}
        {(activeTab === 'jadwal' || isViewAll) && (
          <div className="space-y-4">
            <Card className="bg-white">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Jadwal Rombongan Umrah
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Panduan waktu ibadah dan titik kumpul bersama
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {itineraryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-sm sm:text-base shrink-0">
                          Hari {item.hari_ke}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                          {item.judul_kegiatan}
                        </h4>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-sm sm:text-base self-start sm:self-auto">
                        <Clock className="w-4 h-4" />
                        <span>{item.waktu}</span>
                      </div>
                    </div>

                    {item.catatan && (
                      <div className="text-base sm:text-lg text-slate-700 mt-2.5 bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 mt-0.5" />
                        <p className="break-words">{item.catatan}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: HOTEL & KONTAK DARURAT (FITUR 2)                  */}
        {/* ======================================================== */}
        {(activeTab === 'hotel' || isViewAll) && (
          <div className="space-y-4">
            <Card className="bg-white">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Informasi Hotel Menginap
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Alamat lengkap dan kontak resepsionis hotel
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {hotelList.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="p-4 sm:p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 text-sm sm:text-base font-bold">
                        Kota {hotel.kota}
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {hotel.nama_hotel}
                    </h4>

                    <div className="text-base sm:text-lg text-slate-700 leading-relaxed flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="break-words">{hotel.alamat}</p>
                    </div>

                    <div className="pt-2">
                      <a
                        href={`tel:${hotel.kontak}`}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg shadow-sm transition-colors"
                      >
                        <PhoneCall className="w-5 h-5" />
                        <span>Hubungi Hotel: {hotel.kontak}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Modal Bantuan */}
      <BantuanModal
        isOpen={isBantuanModalOpen}
        onClose={() => setIsBantuanModalOpen(false)}
        jamaahId={selectedJamaahId}
        jamaahNama={selectedJamaah?.nama || 'H. Ahmad Dahlan'}
        checkpointTerakhir={statusData?.status_terkini || 'check_in'}
        hasActiveRequest={hasActiveBantuan}
        onSuccessSubmit={fetchStatus}
      />

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 py-4 sm:py-6 px-4 text-center mt-6 sm:mt-8">
        <p className="text-xs sm:text-base font-medium text-slate-600">
          © 2026 Safarku — Akses untuk Semua (SDG 3, 10, 16)
        </p>
      </footer>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xl font-bold text-slate-700">Memuat data perjalanan...</div>}>
      <ViewerContent />
    </Suspense>
  );
}
