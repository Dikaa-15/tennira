'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  LogOut,
  Send,
  Eye,
  Plane,
  ShieldAlert,
  Calendar,
  Building2,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Lightbulb,
  MapPin,
  MessageSquare,
  FileText,
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { showSuccessAlert, showErrorAlert, showElderlyAlert } from '@/utils/sweetAlert';
import { formatDateTime, formatRelativeTime } from '@/utils/dateHelper';
import { CheckpointType } from '@/repositories/statusRepo';
import { BantuanRequest } from '@/repositories/bantuanRepo';
import { ItineraryItem, HotelInfo } from '@/repositories/itineraryRepo';

interface KeberangkatanItem {
  id: number;
  nama_grup: string;
  kode_grup: string;
  tanggal_berangkat: string;
}

interface JamaahItem {
  id: number;
  nama: string;
  nomor_paspor?: string;
  kontak_keluarga?: string;
  status_terkini?: CheckpointType;
  status_waktu?: string;
  status_catatan?: string;
}

const CHECKPOINTS: { id: CheckpointType; label: string; icon: any }[] = [
  { id: 'check_in', label: '1. Check-in Bandara', icon: Clock },
  { id: 'lewat_imigrasi', label: '2. Lewat Imigrasi', icon: CheckCircle2 },
  { id: 'ruang_tunggu', label: '3. Ruang Tunggu Gate', icon: Users },
  { id: 'naik_pesawat', label: '4. Naik Pesawat (Boarding)', icon: Plane },
];

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const isViewAll = searchParams.get('view') === 'all';
  const formParam = searchParams.get('form');
  const isForceLogin = searchParams.get('auth') === 'login';
  const isPreview = !isForceLogin && (
    searchParams.get('preview') === 'true' ||
    Boolean(tabParam) ||
    isViewAll ||
    Boolean(formParam)
  );

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isPreview);
  const [kodeAkses, setKodeAkses] = useState<string>('ADMIN2026');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'monitor' | 'itinerary'>(
    tabParam === 'itinerary' || formParam === 'itinerary' || formParam === 'hotel' ? 'itinerary' : 'monitor'
  );

  // Admin Data State
  const [keberangkatanList, setKeberangkatanList] = useState<KeberangkatanItem[]>([]);
  const [selectedGrupId, setSelectedGrupId] = useState<number>(1);
  const [jamaahList, setJamaahList] = useState<JamaahItem[]>([]);
  const [bantuanList, setBantuanList] = useState<BantuanRequest[]>([]);
  const [itineraryList, setItineraryList] = useState<ItineraryItem[]>([]);
  const [hotelList, setHotelList] = useState<HotelInfo[]>([]);

  // Update Status Form State
  const [selectedJamaahId, setSelectedJamaahId] = useState<number | 'all'>('all');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<CheckpointType>('lewat_imigrasi');
  const [statusNote, setStatusNote] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Itinerary CRUD State
  const [isAddingItinerary, setIsAddingItinerary] = useState<boolean>(formParam === 'itinerary');
  const [editingItineraryId, setEditingItineraryId] = useState<number | null>(null);
  const [itinForm, setItinForm] = useState<{
    hari_ke: number;
    judul_kegiatan: string;
    waktu: string;
    catatan: string;
  }>({
    hari_ke: 1,
    judul_kegiatan: '',
    waktu: '',
    catatan: '',
  });

  // Hotel Edit State
  const [editingHotelId, setEditingHotelId] = useState<number | null>(formParam === 'hotel' ? 1 : null);
  const [hotelForm, setHotelForm] = useState<{
    nama_hotel: string;
    kota: string;
    alamat: string;
    kontak: string;
  }>({
    nama_hotel: 'Movenpick Anwar Al Madinah',
    kota: 'Madinah',
    alamat: 'Dekat Pintu 25 Masjid Nabawi, Markaziyah Utara',
    kontak: '+966 14 818 1000',
  });

  // Polling State
  const [isRefreshingBantuan, setIsRefreshingBantuan] = useState<boolean>(false);

  // Sync tab change with URL search param
  const handleTabChange = (tab: 'monitor' | 'itinerary') => {
    setAdminTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      url.searchParams.delete('form');
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // 1. Fetch Keberangkatan & Itinerary & Hotel
  const fetchAdminData = useCallback(async () => {
    try {
      const resGrup = await fetch('/api/keberangkatan');
      if (resGrup.ok) {
        const data = await resGrup.json();
        if (data.data && data.data.length > 0) {
          setKeberangkatanList(data.data);
          setSelectedGrupId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  }, []);

  // Check login on preview or load
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated, fetchAdminData]);

  // Handle Login Manual
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kode_akses: kodeAkses.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Kode akses admin salah');
      }

      setIsAuthenticated(true);
      fetchAdminData();
    } catch (err: any) {
      showErrorAlert('Gagal Masuk', err.message || 'Kode akses salah.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // 2. Fetch Jamaah, Itinerary, Hotel by Selected Group
  const fetchGroupDetails = useCallback(async () => {
    if (!selectedGrupId) return;
    try {
      // Jamaah
      const resJamaah = await fetch(`/api/keberangkatan/${selectedGrupId}/jamaah`);
      if (resJamaah.ok) {
        const data = await resJamaah.json();
        setJamaahList(data.data || []);
      }

      // Itinerary
      const resItin = await fetch(`/api/keberangkatan/${selectedGrupId}/itinerary`);
      if (resItin.ok) {
        const data = await resItin.json();
        setItineraryList(data.data || []);
      }

      // Hotel
      const resHotel = await fetch(`/api/keberangkatan/${selectedGrupId}/hotel`);
      if (resHotel.ok) {
        const data = await resHotel.json();
        setHotelList(data.data || []);
        if (formParam === 'hotel' && data.data && data.data.length > 0) {
          const h = data.data[0];
          setEditingHotelId(h.id);
          setHotelForm({
            nama_hotel: h.nama_hotel,
            kota: h.kota,
            alamat: h.alamat,
            kontak: h.kontak,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching group details', err);
    }
  }, [selectedGrupId, formParam]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroupDetails();
    }
  }, [isAuthenticated, fetchGroupDetails]);

  // 3. Polling Bantuan Requests (Every 10 Seconds)
  const fetchBantuan = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshingBantuan(true);
    try {
      const res = await fetch('/api/bantuan');
      if (res.ok) {
        const data = await res.json();
        setBantuanList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching bantuan', err);
    } finally {
      if (isManual) setIsRefreshingBantuan(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBantuan();

    const interval = setInterval(() => {
      fetchBantuan();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchBantuan]);

  // 4. Update Status Checkpoint
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);

    try {
      const targetIds =
        selectedJamaahId === 'all'
          ? jamaahList.map((j) => j.id)
          : [Number(selectedJamaahId)];

      await Promise.all(
        targetIds.map((id) =>
          fetch(`/api/jamaah/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checkpoint: selectedCheckpoint,
              catatan: statusNote.trim() || undefined,
              dicatat_oleh: 'Ust. Rahmat (TL)',
            }),
          })
        )
      );

      await showSuccessAlert(
        'Checkpoint Diperbarui!',
        `Status perjalanan rombongan berhasil diubah menjadi: "${selectedCheckpoint}". Layar jamaah/keluarga otomatis terupdate.`
      );

      setStatusNote('');
      fetchGroupDetails();
    } catch (err: any) {
      showErrorAlert('Gagal Update', err.message || 'Terjadi kesalahan');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 5. Tandai Bantuan Selesai Ditangani
  const handleMarkDitangani = async (bantuanId: number) => {
    try {
      const res = await fetch(`/api/bantuan/${bantuanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'selesai',
          catatan_tl: 'Sudah dijemput petugas di lokasi checkpoint.',
        }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui status bantuan');

      await showSuccessAlert(
        'Bantuan Selesai',
        'Tiket bantuan telah ditandai selesai dan ditutup.'
      );
      fetchBantuan(true);
    } catch (err: any) {
      showErrorAlert('Gagal', err.message);
    }
  };

  // 6. Itinerary Handlers
  const handleSaveItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItineraryId) {
        const res = await fetch(`/api/itinerary/${editingItineraryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itinForm),
        });
        if (!res.ok) throw new Error('Gagal memperbarui jadwal kegiatan');
        await showSuccessAlert('Berhasil', 'Jadwal kegiatan berhasil diperbarui');
      } else {
        const res = await fetch(`/api/keberangkatan/${selectedGrupId}/itinerary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itinForm),
        });
        if (!res.ok) throw new Error('Gagal menambah jadwal kegiatan');
        await showSuccessAlert('Berhasil', 'Jadwal kegiatan baru berhasil ditambahkan');
      }

      setIsAddingItinerary(false);
      setEditingItineraryId(null);
      setItinForm({ hari_ke: 1, judul_kegiatan: '', waktu: '', catatan: '' });
      fetchGroupDetails();
    } catch (err: any) {
      showErrorAlert('Gagal Menyimpan', err.message);
    }
  };

  const handleEditItinerary = (item: ItineraryItem) => {
    setEditingItineraryId(item.id || null);
    setItinForm({
      hari_ke: item.hari_ke,
      judul_kegiatan: item.judul_kegiatan,
      waktu: item.waktu,
      catatan: item.catatan || '',
    });
    setIsAddingItinerary(true);
  };

  const handleDeleteItinerary = async (id: number) => {
    try {
      const res = await fetch(`/api/itinerary/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus jadwal kegiatan');
      await showSuccessAlert('Dihapus', 'Jadwal kegiatan berhasil dihapus');
      fetchGroupDetails();
    } catch (err: any) {
      showErrorAlert('Gagal Menghapus', err.message);
    }
  };

  // 7. Hotel Handlers
  const handleStartEditHotel = (hotel: HotelInfo) => {
    setEditingHotelId(hotel.id || null);
    setHotelForm({
      nama_hotel: hotel.nama_hotel,
      kota: hotel.kota,
      alamat: hotel.alamat,
      kontak: hotel.kontak,
    });
  };

  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotelId) return;

    try {
      const res = await fetch(`/api/hotel/${editingHotelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelForm),
      });
      if (!res.ok) throw new Error('Gagal memperbarui info hotel');

      await showSuccessAlert('Tersimpan', 'Informasi hotel dan kontak berhasil diperbarui');
      setEditingHotelId(null);
      fetchGroupDetails();
    } catch (err: any) {
      showErrorAlert('Gagal Menyimpan Hotel', err.message);
    }
  };

  // ========================================================
  // RENDER LOGIN SCREEN (JIKA BELUM LOGIN)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 w-full max-w-full overflow-x-hidden">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Portal Tour Leader & Admin</h1>
            <p className="text-base text-slate-600 mt-1">
              Masukkan kode akses petugas untuk mengelola rombongan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="kode_akses" className="block text-base font-bold text-slate-900 mb-1">
                Kode Akses Petugas:
              </label>
              <input
                id="kode_akses"
                type="text"
                value={kodeAkses}
                onChange={(e) => setKodeAkses(e.target.value.toUpperCase())}
                placeholder="ADMIN2026"
                className="w-full h-14 px-4 rounded-xl border-2 border-slate-300 text-xl font-bold text-slate-900 uppercase focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-sm font-semibold text-blue-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Kode Demo Default: <strong>ADMIN2026</strong></span>
            </div>

            <Button type="submit" size="large" className="w-full text-lg" isLoading={isLoggingIn}>
              Masuk Dashboard Petugas
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Kembali ke Halaman Utama
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER ADMIN DASHBOARD (JIKA SUDAH LOGIN / MODE PREVIEW)
  // ========================================================
  const activeBantuanCount = bantuanList.filter((b) => b.status === 'baru').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 py-3 px-4 sm:px-6 w-full max-w-full">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-tight truncate">
                Dashboard Tour Leader (Safarku)
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">
                Petugas: <strong>Ust. Rahmat</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => router.push(`/viewer/${selectedGrupId}`)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm sm:text-base font-bold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat Viewer</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs sm:text-base font-bold transition-colors border border-red-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex-1 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Navigation Tabs Admin */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-slate-200/80 p-1 sm:p-1.5 rounded-2xl max-w-full">
          <button
            onClick={() => handleTabChange('monitor')}
            className={`min-h-[50px] sm:h-14 rounded-xl font-bold text-xs sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              adminTab === 'monitor' && !isViewAll
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span className="text-center leading-tight">Live Monitor & Checkpoint</span>
            {activeBantuanCount > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500 text-white text-xs sm:text-sm font-extrabold animate-pulse">
                {activeBantuanCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('itinerary')}
            className={`min-h-[50px] sm:h-14 rounded-xl font-bold text-xs sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              adminTab === 'itinerary' && !isViewAll
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span className="text-center leading-tight">Kelola Jadwal & Hotel</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* SUB-TAB 1: LIVE MONITOR & CHECKPOINT                     */}
        {/* ======================================================== */}
        {(adminTab === 'monitor' || isViewAll) && (
          <div className="space-y-4 sm:space-y-6">
            {/* SECTION: PERMINTAAN BANTUAN DARURAT */}
            <Card
              className={`border-2 ${
                activeBantuanCount > 0 ? 'border-red-400 bg-red-50/40' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 sm:p-2.5 rounded-2xl shrink-0 ${
                      activeBantuanCount > 0
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                      <span>Permintaan Bantuan Masuk</span>
                      {activeBantuanCount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs sm:text-base font-bold">
                          {activeBantuanCount} Perlu Ditangani
                        </span>
                      )}
                    </h2>
                    <p className="text-xs sm:text-base text-slate-600">
                      Tiket darurat dari jamaah lansia yang memerlukan respons cepat Tour Leader
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs sm:text-sm font-bold text-slate-500">Live Polling (10s)</span>
                  <button
                    onClick={() => fetchBantuan(true)}
                    disabled={isRefreshingBantuan}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Refresh tiket bantuan"
                  >
                    <RefreshCw
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshingBantuan ? 'animate-spin text-blue-600' : ''}`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {bantuanList.length === 0 ? (
                  <div className="p-5 sm:p-6 text-center text-slate-500 text-base sm:text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                    <span>Saat ini tidak ada permintaan bantuan dari jamaah. Semua aman terkendali.</span>
                  </div>
                ) : (
                  bantuanList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.status === 'baru'
                          ? 'border-red-400 bg-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 opacity-75'
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg sm:text-xl font-bold text-slate-900">
                            {item.jamaah_nama || 'Jamaah Lansia'}
                          </span>
                          {item.prioritas === 'tinggi' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 text-xs sm:text-sm font-extrabold border border-red-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              PRIORITAS TINGGI
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold ${
                              item.status === 'baru'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-green-100 text-green-900 border border-green-300'
                            }`}
                          >
                            {item.status === 'baru' ? 'Menunggu Tindakan' : 'Sudah Ditangani'}
                          </span>
                        </div>

                        <p className="text-base sm:text-lg font-bold text-slate-800">
                          Kendala:{' '}
                          <span className="text-red-600 uppercase tracking-wide">
                            {item.kategori.replace('_', ' ')}
                          </span>
                        </p>

                        <p className="text-xs sm:text-base text-slate-600 flex items-center gap-1.5 flex-wrap">
                          <MapPin className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Checkpoint Terakhir: <strong>{item.checkpoint_terakhir}</strong></span>
                          <span>| Waktu: {formatDateTime(item.timestamp)} ({formatRelativeTime(item.timestamp)})</span>
                        </p>
                      </div>

                      {item.status === 'baru' && (
                        <Button
                          variant="primary"
                          className="bg-green-600 hover:bg-green-700 min-h-[48px] h-[48px] text-sm sm:text-base shrink-0"
                          onClick={() => handleMarkDitangani(item.id)}
                        >
                          <CheckCircle2 className="w-5 h-5 mr-1.5" />
                          <span>Tandai Selesai Ditangani</span>
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* SECTION: UPDATE CHECKPOINT LIVE */}
            <Card className="bg-white">
              <div className="pb-4 border-b border-slate-200 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Update Posisi Checkpoint Rombongan
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Catat kemajuan perjalanan saat rombongan tiba di titik baru
                </p>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-900 mb-2">
                    1. Pilih Target Jamaah:
                  </label>
                  <select
                    value={selectedJamaahId}
                    onChange={(e) =>
                      setSelectedJamaahId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                    }
                    className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-xl border-2 border-slate-300 text-sm sm:text-lg font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none truncate"
                  >
                    <option value="all">Seluruh Rombongan ({jamaahList.length} Jamaah)</option>
                    {jamaahList.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama} (Status saat ini: {j.status_terkini || 'check_in'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-900 mb-2">
                    2. Pilih Checkpoint Terkini:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CHECKPOINTS.map((cp) => {
                      const Icon = cp.icon;
                      const isSelected = selectedCheckpoint === cp.id;
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => setSelectedCheckpoint(cp.id)}
                          className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-base sm:text-lg">{cp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-900 mb-2">
                    3. Catatan Tambahan (Opsional):
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Contoh: Rombongan berkumpul di depan Gate 12, bersiap boarding."
                    className="w-full h-12 sm:h-14 px-4 rounded-xl border-2 border-slate-300 text-sm sm:text-base font-medium text-slate-900 focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  size="large"
                  className="w-full text-base sm:text-lg"
                  isLoading={isUpdatingStatus}
                >
                  <Send className="w-5 h-5 mr-2" />
                  <span>Siarkan Update Checkpoint ke Jamaah</span>
                </Button>
              </form>
            </Card>

            {/* SECTION: DAFTAR STATUS ANGGOTA ROMBONGAN */}
            <Card className="bg-white">
              <div className="pb-3 border-b border-slate-200 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Daftar Anggota Rombongan & Status Terkini
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {jamaahList.map((j) => (
                  <div
                    key={j.id}
                    className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{j.nama}</h4>
                      <p className="text-xs sm:text-base text-slate-600">
                        Paspor: {j.nomor_paspor || '-'} | Kontak: {j.kontak_keluarga || '-'}
                      </p>
                      {j.status_catatan && (
                        <p className="text-xs sm:text-sm text-slate-700 italic mt-1 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{j.status_catatan}</span>
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      <StatusBadge checkpoint={j.status_terkini || 'check_in'} size="normal" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: KELOLA JADWAL & HOTEL (CRUD)                  */}
        {/* ======================================================== */}
        {(adminTab === 'itinerary' || isViewAll) && (
          <div className="space-y-4 sm:space-y-6">
            {/* 1. KELOLA JADWAL ITINERARY */}
            <Card className="bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Kelola Jadwal Rombongan
                    </h2>
                    <p className="text-xs sm:text-base text-slate-600">
                      Tambah, ubah waktu, atau sesuaikan agenda kegiatan umrah
                    </p>
                  </div>
                </div>

                {!isAddingItinerary && (
                  <Button
                    onClick={() => {
                      setEditingItineraryId(null);
                      setItinForm({ hari_ke: 1, judul_kegiatan: '', waktu: '', catatan: '' });
                      setIsAddingItinerary(true);
                    }}
                    className="h-11 sm:h-12 min-h-[44px] text-sm sm:text-base self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    <span>Tambah Jadwal</span>
                  </Button>
                )}
              </div>

              {/* Form Tambah/Edit Itinerary */}
              {isAddingItinerary && (
                <form
                  onSubmit={handleSaveItinerary}
                  className="bg-blue-50/70 p-4 sm:p-6 rounded-2xl border-2 border-blue-200 mb-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-950 flex items-center gap-2">
                      {editingItineraryId ? (
                        <>
                          <Edit className="w-5 h-5 text-blue-600" />
                          <span>Edit Jadwal Kegiatan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-blue-600" />
                          <span>Tambah Jadwal Kegiatan Baru</span>
                        </>
                      )}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingItinerary(false)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                        Hari Ke:
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={itinForm.hari_ke}
                        onChange={(e) =>
                          setItinForm({ ...itinForm, hari_ke: Number(e.target.value) })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                        Waktu Kegiatan:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 14:00 WSA (Waktu Saudi)"
                        value={itinForm.waktu}
                        onChange={(e) => setItinForm({ ...itinForm, waktu: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                      Nama / Judul Kegiatan:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Manasik & Pengambilan Miqat di Bir Ali"
                      value={itinForm.judul_kegiatan}
                      onChange={(e) =>
                        setItinForm({ ...itinForm, judul_kegiatan: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                      Catatan / Titik Kumpul (Opsional):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Kumpul di lobi hotel pukul 13:30, bawa kain ihram."
                      value={itinForm.catatan}
                      onChange={(e) => setItinForm({ ...itinForm, catatan: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="h-11 sm:h-12 min-h-[44px] text-sm sm:text-base">
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                      <span>{editingItineraryId ? 'Simpan Perubahan' : 'Tambah ke Jadwal'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAddingItinerary(false)}
                      className="h-11 sm:h-12 min-h-[44px] text-sm sm:text-base"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}

              {/* List Jadwal Cards */}
              <div className="space-y-3">
                {itineraryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs sm:text-sm">
                          Hari {item.hari_ke}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold text-xs sm:text-sm">
                          {item.waktu}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                          {item.judul_kegiatan}
                        </h4>
                      </div>
                      {item.catatan && (
                        <p className="text-xs sm:text-base text-slate-600 mt-1 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{item.catatan}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleEditItinerary(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => item.id && handleDeleteItinerary(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. KELOLA INFO HOTEL */}
            <Card className="bg-white">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
                <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Kelola Informasi Hotel & Kontak
                  </h2>
                  <p className="text-xs sm:text-base text-slate-600">
                    Perbarui nama hotel, alamat, dan nomor telepon resepsionis
                  </p>
                </div>
              </div>

              {/* Form Edit Hotel */}
              {editingHotelId && (
                <form
                  onSubmit={handleSaveHotel}
                  className="bg-amber-50/70 p-4 sm:p-6 rounded-2xl border-2 border-amber-300 mb-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <h3 className="text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-700" />
                      <span>Edit Informasi Hotel ({hotelForm.kota})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingHotelId(null)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                        Nama Hotel:
                      </label>
                      <input
                        type="text"
                        value={hotelForm.nama_hotel}
                        onChange={(e) =>
                          setHotelForm({ ...hotelForm, nama_hotel: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                        Nomor Kontak Telepon:
                      </label>
                      <input
                        type="text"
                        value={hotelForm.kontak}
                        onChange={(e) =>
                          setHotelForm({ ...hotelForm, kontak: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-900 mb-1">
                      Alamat Lengkap & Patokan Lokasi:
                    </label>
                    <textarea
                      value={hotelForm.alamat}
                      onChange={(e) => setHotelForm({ ...hotelForm, alamat: e.target.value })}
                      rows={2}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="h-11 sm:h-12 min-h-[44px] text-sm sm:text-base">
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                      <span>Simpan Perubahan Hotel</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditingHotelId(null)}
                      className="h-11 sm:h-12 min-h-[44px] text-sm sm:text-base"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}

              {/* List Hotel Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotelList.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs sm:text-sm">
                          Kota {hotel.kota}
                        </span>
                        <button
                          onClick={() => handleStartEditHotel(hotel)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                          <span>Ubah Info</span>
                        </button>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">{hotel.nama_hotel}</h4>
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                        <span>{hotel.alamat}</span>
                      </p>
                      <p className="text-sm sm:text-base font-bold text-blue-700 flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{hotel.kontak}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 py-4 sm:py-6 px-4 text-center mt-6 sm:mt-8">
        <p className="text-xs sm:text-base font-medium text-slate-600">
          Dashboard Petugas Safarku — Tour Leader Interface
        </p>
      </footer>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xl font-bold text-slate-700">Memuat Dashboard Petugas...</div>}>
      <AdminContent />
    </Suspense>
  );
}
