'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AdminPage() {
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [kodeAkses, setKodeAkses] = useState<string>('ADMIN2026');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'monitor' | 'itinerary'>('monitor');

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
  const [isAddingItinerary, setIsAddingItinerary] = useState<boolean>(false);
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
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [hotelForm, setHotelForm] = useState<{
    nama_hotel: string;
    kota: string;
    alamat: string;
    kontak: string;
  }>({
    nama_hotel: '',
    kota: '',
    alamat: '',
    kontak: '',
  });

  // Polling State
  const [isRefreshingBantuan, setIsRefreshingBantuan] = useState<boolean>(false);

  // 1. Check Initial Login or Submit
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

  // 2. Fetch Keberangkatan & Itinerary & Hotel
  const fetchAdminData = async () => {
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
  };

  // 3. Fetch Jamaah, Itinerary, Hotel by Selected Group
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
      }
    } catch (err) {
      console.error('Error fetching group details', err);
    }
  }, [selectedGrupId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroupDetails();
    }
  }, [isAuthenticated, fetchGroupDetails]);

  // 4. Polling Bantuan Requests (Every 10 Seconds)
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

  // 5. Update Status Checkpoint
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
        'Status Berhasil Diperbarui!',
        `Checkpoint telah diubah menjadi "${selectedCheckpoint}" untuk ${selectedJamaahId === 'all' ? 'Seluruh Rombongan' : 'Jamaah terpilih'
        }. Halaman viewer keluarga otomatis terupdate.`
      );

      setStatusNote('');
      fetchGroupDetails();
    } catch (err: any) {
      showErrorAlert('Gagal Update', err.message || 'Terjadi kendala.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 6. Handle Mark Bantuan Ditangani
  const handleMarkDitangani = async (bantuanId: number) => {
    try {
      const res = await fetch(`/api/bantuan/${bantuanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ditangani',
          catatan_admin: 'Telah dihampiri & dibantu oleh TL',
        }),
      });

      if (res.ok) {
        await showSuccessAlert(
          'Bantuan Ditandai Ditangani',
          'Status tiket bantuan berhasil diperbarui.'
        );
        fetchBantuan();
      }
    } catch (err: any) {
      showErrorAlert('Gagal', err.message || 'Kendala saat update bantuan');
    }
  };

  // 7. Handle Itinerary CRUD
  const handleSaveItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinForm.judul_kegiatan || !itinForm.waktu) {
      showErrorAlert('Perhatian', 'Judul kegiatan dan waktu wajib diisi.');
      return;
    }

    try {
      if (editingItineraryId) {
        // Edit existing
        const res = await fetch(`/api/itinerary/${editingItineraryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itinForm),
        });
        if (!res.ok) throw new Error('Gagal memperbarui jadwal');
        await showSuccessAlert('Berhasil', 'Jadwal kegiatan berhasil diperbarui.');
      } else {
        // Add new
        const res = await fetch(`/api/keberangkatan/${selectedGrupId}/itinerary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itinForm),
        });
        if (!res.ok) throw new Error('Gagal menambahkan jadwal');
        await showSuccessAlert('Berhasil', 'Jadwal kegiatan baru berhasil ditambahkan.');
      }

      setIsAddingItinerary(false);
      setEditingItineraryId(null);
      setItinForm({ hari_ke: 1, judul_kegiatan: '', waktu: '', catatan: '' });
      fetchGroupDetails();
    } catch (err: any) {
      showErrorAlert('Gagal', err.message || 'Terjadi kesalahan.');
    }
  };

  const handleDeleteItinerary = async (id: number) => {
    const confirm = await showElderlyAlert({
      title: 'Hapus Jadwal Kegiatan?',
      text: 'Apakah Anda yakin ingin menghapus agenda kegiatan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/itinerary/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await showSuccessAlert('Terhapus', 'Jadwal kegiatan telah dihapus.');
          fetchGroupDetails();
        }
      } catch {
        showErrorAlert('Gagal', 'Tidak dapat menghapus jadwal.');
      }
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

  // 8. Handle Hotel Update
  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotelId) return;

    try {
      const res = await fetch(`/api/hotel/${editingHotelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelForm),
      });

      if (res.ok) {
        await showSuccessAlert('Berhasil', 'Informasi hotel berhasil diperbarui.');
        setEditingHotelId(null);
        fetchGroupDetails();
      } else {
        throw new Error('Gagal update hotel');
      }
    } catch (err: any) {
      showErrorAlert('Gagal', err.message || 'Gagal update info hotel.');
    }
  };

  const handleStartEditHotel = (hotel: HotelInfo) => {
    setEditingHotelId(hotel.id || null);
    setHotelForm({
      nama_hotel: hotel.nama_hotel,
      kota: hotel.kota,
      alamat: hotel.alamat,
      kontak: hotel.kontak,
    });
  };

  // ========================================================
  // RENDER LOGIN SCREEN (JIKA BELUM LOGIN)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-lg">
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

            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-sm font-semibold text-blue-900">
              💡 Kode Demo Default: <strong>ADMIN2026</strong>
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
  // RENDER ADMIN DASHBOARD (JIKA SUDAH LOGIN)
  // ========================================================
  const activeBantuanCount = bantuanList.filter((b) => b.status === 'baru').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Dashboard Tour Leader (Safarku)
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                Petugas: <strong>Ust. Rahmat</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/viewer/${selectedGrupId}`)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-base font-bold transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat Tampilan Viewer</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-base font-bold transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        {/* Navigation Tabs Admin */}
        <div className="grid grid-cols-2 gap-3 bg-slate-200/80 p-1.5 rounded-2xl">
          <button
            onClick={() => setAdminTab('monitor')}
            className={`h-14 rounded-xl font-bold text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${adminTab === 'monitor'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
          >
            <span>🚨 Live Monitor & Checkpoint</span>
            {activeBantuanCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-sm font-extrabold animate-pulse">
                {activeBantuanCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setAdminTab('itinerary')}
            className={`h-14 rounded-xl font-bold text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${adminTab === 'itinerary'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
          >
            <Calendar className="w-5 h-5" />
            <span>📋 Kelola Jadwal & Hotel</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* SUB-TAB 1: LIVE MONITOR & CHECKPOINT                     */}
        {/* ======================================================== */}
        {adminTab === 'monitor' && (
          <div className="space-y-6">
            {/* SECTION: PERMINTAAN BANTUAN DARURAT */}
            <Card
              className={`border-2 ${activeBantuanCount > 0 ? 'border-red-400 bg-red-50/40' : 'border-slate-200 bg-white'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl ${activeBantuanCount > 0
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                      }`}
                  >
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <span>Permintaan Bantuan Masuk</span>
                      {activeBantuanCount > 0 && (
                        <span className="px-3 py-0.5 rounded-full bg-red-600 text-white text-base font-bold">
                          {activeBantuanCount} Perlu Ditangani
                        </span>
                      )}
                    </h2>
                    <p className="text-base text-slate-600">
                      Tiket darurat dari jamaah lansia yang memerlukan respons cepat Tour Leader
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-500">Live Polling (10s)</span>
                  <button
                    onClick={() => fetchBantuan(true)}
                    disabled={isRefreshingBantuan}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                    title="Refresh tiket bantuan"
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${isRefreshingBantuan ? 'animate-spin text-blue-600' : ''}`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {bantuanList.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-lg">
                    ✅ Saat ini tidak ada permintaan bantuan dari jamaah. Semua aman terkendali.
                  </div>
                ) : (
                  bantuanList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${item.status === 'baru'
                          ? 'border-red-400 bg-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 opacity-75'
                        }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-bold text-slate-900">
                            {item.jamaah_nama || 'Jamaah Lansia'}
                          </span>
                          {item.prioritas === 'tinggi' && (
                            <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 text-sm font-extrabold border border-red-300">
                              🚨 PRIORITAS TINGGI
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-sm font-bold ${item.status === 'baru'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-green-100 text-green-900 border border-green-300'
                              }`}
                          >
                            {item.status === 'baru' ? 'Menunggu Tindakan' : 'Sudah Ditangani'}
                          </span>
                        </div>

                        <p className="text-lg font-bold text-slate-800">
                          Kendala:{' '}
                          <span className="text-red-600 uppercase tracking-wide">
                            {item.kategori.replace('_', ' ')}
                          </span>
                        </p>

                        <p className="text-base text-slate-600">
                          📍 Checkpoint Terakhir: <strong>{item.checkpoint_terakhir}</strong> | Waktu:{' '}
                          {formatDateTime(item.timestamp)} ({formatRelativeTime(item.timestamp)})
                        </p>
                      </div>

                      {item.status === 'baru' && (
                        <Button
                          variant="primary"
                          className="bg-green-600 hover:bg-green-700 min-h-[50px] h-[50px] text-base shrink-0"
                          onClick={() => handleMarkDitangani(item.id)}
                        >
                          <CheckCircle2 className="w-5 h-5 mr-1.5" />
                          <span>Tandai Ditangani</span>
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* SECTION: FORM UPDATE CHECKPOINT STATUS */}
            <Card className="bg-white">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Update Checkpoint Perjalanan Jamaah
                  </h2>
                  <p className="text-base text-slate-600">
                    Ubah posisi proses jamaah saat melewati titik transisi bandara
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-6">
                {/* Pilih Target Jamaah */}
                <div>
                  <label className="block text-lg font-bold text-slate-900 mb-2">
                    Pilih Jamaah yang Diupdate:
                  </label>
                  <select
                    value={selectedJamaahId}
                    onChange={(e) =>
                      setSelectedJamaahId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                    }
                    className="w-full h-14 px-4 rounded-xl border-2 border-slate-300 text-lg font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="all">👥 Seluruh Rombongan (3 Jamaah)</option>
                    {jamaahList.map((j) => (
                      <option key={j.id} value={j.id}>
                        👤 {j.nama} (Status saat ini: {j.status_terkini || 'check_in'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pilih Checkpoint Baru */}
                <div>
                  <label className="block text-lg font-bold text-slate-900 mb-2">
                    Pilih Checkpoint Status Baru:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CHECKPOINTS.map((cp) => {
                      const isSelected = selectedCheckpoint === cp.id;
                      const Icon = cp.icon;
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => setSelectedCheckpoint(cp.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left font-bold text-lg transition-all cursor-pointer ${isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                            }`}
                        >
                          <Icon
                            className={`w-6 h-6 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-600'
                              }`}
                          />
                          <span>{cp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Catatan Tambahan (Opsional) */}
                <div>
                  <label className="block text-lg font-bold text-slate-900 mb-1">
                    Catatan Petugas (Opsional):
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Contoh: Rombongan sudah berkumpul di Gate 2 T3"
                    className="w-full h-14 px-4 rounded-xl border-2 border-slate-300 text-lg text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Tombol Submit Update */}
                <Button
                  type="submit"
                  size="large"
                  className="w-full text-xl"
                  isLoading={isUpdatingStatus}
                >
                  <Send className="w-6 h-6 mr-2" />
                  <span>Simpan & Publikasikan Status Baru</span>
                </Button>
              </form>
            </Card>

            {/* SECTION: DAFTAR STATUS JAMAAH SAAT INI */}
            <Card className="bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Daftar Status Jamaah Rombongan
              </h3>

              <div className="divide-y divide-slate-200">
                {jamaahList.map((j) => (
                  <div
                    key={j.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{j.nama}</h4>
                      <p className="text-base text-slate-600">
                        Paspor: {j.nomor_paspor || '-'} | Kontak Keluarga: {j.kontak_keluarga || '-'}
                      </p>
                      {j.status_catatan && (
                        <p className="text-sm text-slate-700 italic mt-1">💬 {j.status_catatan}</p>
                      )}
                    </div>

                    <div className="shrink-0">
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
        {adminTab === 'itinerary' && (
          <div className="space-y-6">
            {/* 1. KELOLA JADWAL ITINERARY */}
            <Card className="bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Kelola Jadwal Rombongan
                    </h2>
                    <p className="text-base text-slate-600">
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
                    className="h-12 min-h-[48px] text-base"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    <span>Tambah Jadwal</span>
                  </Button>
                )}
              </div>

              {/* Form Tambah/Edit Itinerary */}
              {isAddingItinerary && (
                <form
                  onSubmit={handleSaveItinerary}
                  className="bg-blue-50/70 p-6 rounded-2xl border-2 border-blue-200 mb-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                    <h3 className="text-xl font-bold text-blue-950">
                      {editingItineraryId ? '✏️ Edit Jadwal Kegiatan' : '➕ Tambah Jadwal Kegiatan Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingItinerary(false)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base font-bold text-slate-900 mb-1">
                        Hari Ke:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={itinForm.hari_ke}
                        onChange={(e) =>
                          setItinForm({ ...itinForm, hari_ke: Number(e.target.value) })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white font-bold"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-base font-bold text-slate-900 mb-1">
                        Waktu / Jam Kegiatan:
                      </label>
                      <input
                        type="text"
                        value={itinForm.waktu}
                        onChange={(e) => setItinForm({ ...itinForm, waktu: e.target.value })}
                        placeholder="Contoh: 08:00 WIB atau 16:30 WAS"
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1">
                      Judul Agenda Kegiatan:
                    </label>
                    <input
                      type="text"
                      value={itinForm.judul_kegiatan}
                      onChange={(e) => setItinForm({ ...itinForm, judul_kegiatan: e.target.value })}
                      placeholder="Contoh: Kumpul di Lobby Hotel untuk Ziarah"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1">
                      Catatan / Petunjuk Tambahan (Opsional):
                    </label>
                    <input
                      type="text"
                      value={itinForm.catatan}
                      onChange={(e) => setItinForm({ ...itinForm, catatan: e.target.value })}
                      placeholder="Contoh: Bawa sandal di tas kecil dan kartu nama hotel"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="h-12 min-h-[48px] text-base">
                      <Save className="w-5 h-5 mr-1.5" />
                      <span>{editingItineraryId ? 'Simpan Perubahan' : 'Tambahkan Agenda'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAddingItinerary(false)}
                      className="h-12 min-h-[48px] text-base"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}

              {/* List Itinerary */}
              <div className="space-y-3">
                {itineraryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-sm">
                          Hari {item.hari_ke}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-bold text-sm">
                          {item.waktu}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900">
                          {item.judul_kegiatan}
                        </h4>
                      </div>
                      {item.catatan && (
                        <p className="text-base text-slate-600 mt-1">📌 {item.catatan}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleEditItinerary(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-sm font-bold transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => item.id && handleDeleteItinerary(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Kelola Informasi Hotel & Kontak
                  </h2>
                  <p className="text-base text-slate-600">
                    Perbarui nama hotel, alamat, dan nomor telepon resepsionis
                  </p>
                </div>
              </div>

              {/* Form Edit Hotel */}
              {editingHotelId && (
                <form
                  onSubmit={handleSaveHotel}
                  className="bg-amber-50/70 p-6 rounded-2xl border-2 border-amber-300 mb-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <h3 className="text-xl font-bold text-amber-950">
                      ✏️ Edit Informasi Hotel ({hotelForm.kota})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingHotelId(null)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-bold text-slate-900 mb-1">
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
                      <label className="block text-base font-bold text-slate-900 mb-1">
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
                    <label className="block text-base font-bold text-slate-900 mb-1">
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
                    <Button type="submit" className="h-12 min-h-[48px] text-base">
                      <Save className="w-5 h-5 mr-1.5" />
                      <span>Simpan Perubahan Hotel</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditingHotelId(null)}
                      className="h-12 min-h-[48px] text-base"
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
                    className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-sm">
                          Kota {hotel.kota}
                        </span>
                        <button
                          onClick={() => handleStartEditHotel(hotel)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-sm font-bold"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span>Ubah Info</span>
                        </button>
                      </div>

                      <h4 className="text-xl font-bold text-slate-900">{hotel.nama_hotel}</h4>
                      <p className="text-base text-slate-700 leading-relaxed">
                        📍 {hotel.alamat}
                      </p>
                      <p className="text-base font-bold text-blue-700">
                        📞 {hotel.kontak}
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
      <footer className="bg-white border-t-2 border-slate-200 py-6 px-4 text-center mt-8">
        <p className="text-base font-medium text-slate-600">
          Dashboard Petugas Safarku — Tour Leader Interface
        </p>
      </footer>
    </div>
  );
}
