import { NextResponse } from 'next/server';
import { getJamaahById } from '@/repositories/jamaahRepo';
import { getLatestStatusByJamaahId } from '@/repositories/statusRepo';
import {
  createBantuanRequest,
  getActiveBantuanByJamaahId,
  KategoriBantuan,
} from '@/repositories/bantuanRepo';

const VALID_KATEGORI: KategoriBantuan[] = [
  'terpisah_rombongan',
  'masalah_dokumen',
  'bantuan_medis',
  'lainnya',
];

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const jamaahId = Number(params.id);

    if (!jamaahId || isNaN(jamaahId)) {
      return NextResponse.json(
        { success: false, message: 'ID jamaah tidak valid' },
        { status: 400 }
      );
    }

    const activeBantuan = await getActiveBantuanByJamaahId(jamaahId);
    return NextResponse.json({
      success: true,
      has_active_request: !!activeBantuan,
      active_bantuan: activeBantuan,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memeriksa status bantuan aktif' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const jamaahId = Number(params.id);
    const body = await request.json();
    const { kategori } = body;

    if (!jamaahId || isNaN(jamaahId)) {
      return NextResponse.json(
        { success: false, message: 'ID jamaah tidak valid' },
        { status: 400 }
      );
    }

    if (!kategori || !VALID_KATEGORI.includes(kategori)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Kategori bantuan tidak valid. Pilihan: terpisah_rombongan, masalah_dokumen, bantuan_medis, lainnya',
        },
        { status: 400 }
      );
    }

    // 1. VALIDASI PREVENSI SPAM / DUPLIKASI TIKET AKTIF
    const existingActive = await getActiveBantuanByJamaahId(jamaahId);
    if (existingActive) {
      return NextResponse.json(
        {
          success: false,
          is_duplicate: true,
          message:
            'Permintaan bantuan Anda sebelumnya masih aktif dan sedang dalam proses penanganan oleh Tour Leader. Mohon tetap tenang dan tunggu petugas di lokasi.',
          active_bantuan: existingActive,
        },
        { status: 409 }
      );
    }

    const jamaah = await getJamaahById(jamaahId);
    const latestStatus = await getLatestStatusByJamaahId(jamaahId);
    const checkpointTerakhir = latestStatus ? latestStatus.checkpoint : 'check_in';

    const result = await createBantuanRequest(
      jamaahId,
      kategori,
      checkpointTerakhir,
      jamaah ? jamaah.nama : 'Jamaah'
    );

    return NextResponse.json(
      {
        success: true,
        id: result.id,
        prioritas: result.prioritas,
        checkpoint_terakhir: result.checkpoint_terakhir,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim permintaan bantuan' },
      { status: 500 }
    );
  }
}
