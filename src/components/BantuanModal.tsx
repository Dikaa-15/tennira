'use client';

import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  FileText,
  HelpCircle,
  X,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Button } from './ui/Button';
import { showSuccessAlert, showErrorAlert, showElderlyAlert } from '@/utils/sweetAlert';
import { KategoriBantuan } from '@/repositories/bantuanRepo';

interface BantuanModalProps {
  isOpen: boolean;
  onClose: () => void;
  jamaahId: number;
  jamaahNama: string;
  checkpointTerakhir: string;
  hasActiveRequest?: boolean;
  onSuccessSubmit?: () => void;
}

const KATEGORI_OPTIONS: {
  id: KategoriBantuan;
  label: string;
  desc: string;
  icon: any;
  isUrgent?: boolean;
}[] = [
  {
    id: 'terpisah_rombongan',
    label: 'Terpisah dari Rombongan',
    desc: 'Saya tertinggal atau bingung arah mencari rombongan',
    icon: Users,
    isUrgent: true,
  },
  {
    id: 'bantuan_medis',
    label: 'Bantuan Medis / Merasa Sakit',
    desc: 'Pusing, lelah berat, atau butuh kursi roda/obat',
    icon: Stethoscope,
    isUrgent: true,
  },
  {
    id: 'masalah_dokumen',
    label: 'Kendala Paspor / Boarding Pass',
    desc: 'Dokumen hilang, tertinggal, atau bermasalah di konter',
    icon: FileText,
  },
  {
    id: 'lainnya',
    label: 'Bantuan Lainnya',
    desc: 'Kebutuhan informasi atau kendala barang/koper',
    icon: HelpCircle,
  },
];

export const BantuanModal: React.FC<BantuanModalProps> = ({
  isOpen,
  onClose,
  jamaahId,
  jamaahNama,
  checkpointTerakhir,
  hasActiveRequest = false,
  onSuccessSubmit,
}) => {
  const [selectedKategori, setSelectedKategori] = useState<KategoriBantuan>('terpisah_rombongan');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/jamaah/${jamaahId}/bantuan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kategori: selectedKategori }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          onClose();
          await showElderlyAlert({
            icon: 'info',
            title: 'Bantuan Sedang Diproses',
            text: data.message,
            confirmButtonText: 'Baik, Saya Tunggu',
          });
          if (onSuccessSubmit) onSuccessSubmit();
          return;
        }
        throw new Error(data.message || 'Gagal mengirim permintaan bantuan');
      }

      onClose();
      await showSuccessAlert(
        'Permintaan Bantuan Terkirim!',
        'Petugas Tour Leader telah menerima pemberitahuan dan segera merespons ke lokasi Anda. Mohon tetap tenang dan jangan berpindah tempat.'
      );
      if (onSuccessSubmit) onSuccessSubmit();
    } catch (err: any) {
      showErrorAlert('Mohon Maaf', err.message || 'Gagal mengirim permintaan bantuan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-red-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-red-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white shrink-0" />
            <div>
              <h2 className="text-2xl font-bold leading-tight">Pusat Bantuan Cepat</h2>
              <p className="text-base text-red-100 mt-0.5">
                Untuk: <strong>{jamaahNama}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Jika sudah ada bantuan aktif */}
        {hasActiveRequest ? (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-amber-950">
                Permintaan Anda Masih Berstatus Aktif
              </h3>
              <p className="text-base text-amber-900 leading-relaxed">
                Tour Leader sedang dalam perjalanan menangani laporan Anda. Mohon tetap berada di posisi checkpoint terakhir Anda agar mudah ditemukan.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={onClose}
            >
              Tutup Jendela
            </Button>
          </div>
        ) : (
          /* Form Body Normal */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <p className="text-lg font-semibold text-slate-900 mb-2">
              Pilih jenis kendala yang Anda alami saat ini:
            </p>

            <div className="space-y-3">
              {KATEGORI_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedKategori === item.id;
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="kategori_bantuan"
                      value={item.id}
                      checked={isSelected}
                      onChange={() => setSelectedKategori(item.id)}
                      className="w-6 h-6 mt-1 text-red-600 focus:ring-red-500 accent-red-600 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`w-6 h-6 shrink-0 ${
                            isSelected ? 'text-red-600' : 'text-slate-600'
                          }`}
                        />
                        <span className="text-lg font-bold text-slate-900 leading-snug">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-base text-slate-600 mt-1">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mt-4 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-slate-700 shrink-0" />
              <p className="text-base text-slate-700">
                Posisi Terakhir Terdata:{' '}
                <strong className="text-slate-900 uppercase">{checkpointTerakhir}</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2">
              <Button
                type="submit"
                variant="danger"
                size="emergency"
                isLoading={isSubmitting}
                className="flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-6 h-6" />
                <span>Kirim Permintaan Sekarang</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Batalkan
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
