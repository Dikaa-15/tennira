import { NextResponse } from 'next/server';
import { updateHotel } from '@/repositories/itineraryRepo';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const body = await request.json();
    const { nama_hotel, kota, alamat, kontak } = body;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID hotel tidak valid' },
        { status: 400 }
      );
    }

    if (!nama_hotel || typeof nama_hotel !== 'string' || nama_hotel.trim().length < 2 || nama_hotel.length > 150) {
      return NextResponse.json(
        { success: false, message: 'Nama hotel wajib diisi (2-150 karakter)' },
        { status: 400 }
      );
    }

    if (!kota || typeof kota !== 'string' || kota.trim().length < 2 || kota.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Kota hotel wajib diisi (2-50 karakter)' },
        { status: 400 }
      );
    }

    if (!alamat || typeof alamat !== 'string' || alamat.trim().length < 5 || alamat.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Alamat hotel wajib diisi secara lengkap (5-500 karakter)' },
        { status: 400 }
      );
    }

    if (!kontak || typeof kontak !== 'string' || kontak.trim().length < 4 || kontak.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Nomor kontak telepon hotel wajib diisi (4-50 karakter)' },
        { status: 400 }
      );
    }

    const success = await updateHotel(id, nama_hotel.trim(), kota.trim(), alamat.trim(), kontak.trim());
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Data hotel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Info hotel berhasil diperbarui' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui info hotel' },
      { status: 500 }
    );
  }
}
