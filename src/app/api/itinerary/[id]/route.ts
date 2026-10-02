import { NextResponse } from 'next/server';
import { updateItinerary, deleteItinerary } from '@/repositories/itineraryRepo';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const body = await request.json();
    const { hari_ke, judul_kegiatan, waktu, catatan } = body;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID kegiatan tidak valid' },
        { status: 400 }
      );
    }

    const hariKeNum = Number(hari_ke);
    if (!hari_ke || isNaN(hariKeNum) || hariKeNum < 1 || hariKeNum > 60) {
      return NextResponse.json(
        { success: false, message: 'Hari ke harus berupa angka antara 1 sampai 60' },
        { status: 400 }
      );
    }

    if (!judul_kegiatan || typeof judul_kegiatan !== 'string' || judul_kegiatan.trim().length < 2 || judul_kegiatan.length > 200) {
      return NextResponse.json(
        { success: false, message: 'Judul kegiatan wajib diisi (2-200 karakter)' },
        { status: 400 }
      );
    }

    if (!waktu || typeof waktu !== 'string' || waktu.trim().length < 2 || waktu.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Waktu kegiatan wajib diisi (2-50 karakter)' },
        { status: 400 }
      );
    }

    const sanitizedCatatan = catatan && typeof catatan === 'string' ? catatan.trim().substring(0, 500) : undefined;

    const success = await updateItinerary(id, hariKeNum, judul_kegiatan.trim(), waktu.trim(), sanitizedCatatan);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Jadwal kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Jadwal berhasil diperbarui' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui jadwal kegiatan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID kegiatan tidak valid' },
        { status: 400 }
      );
    }

    const success = await deleteItinerary(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Jadwal kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Jadwal berhasil dihapus' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus jadwal kegiatan' },
      { status: 500 }
    );
  }
}
