import { NextResponse } from 'next/server';
import { getItineraryByKeberangkatanId, createItinerary } from '@/repositories/itineraryRepo';

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const keberangkatanId = Number(params.id);

    if (!keberangkatanId || isNaN(keberangkatanId)) {
      return NextResponse.json(
        { success: false, message: 'ID keberangkatan tidak valid' },
        { status: 400 }
      );
    }

    const data = await getItineraryByKeberangkatanId(keberangkatanId);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data itinerary' },
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
    const keberangkatanId = Number(params.id);
    const body = await request.json();
    const { hari_ke, judul_kegiatan, waktu, catatan } = body;

    if (!keberangkatanId || isNaN(keberangkatanId)) {
      return NextResponse.json(
        { success: false, message: 'ID keberangkatan tidak valid' },
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
        { success: false, message: 'Waktu kegiatan wajib diisi (contoh: 08:00 WIB)' },
        { status: 400 }
      );
    }

    const sanitizedCatatan = catatan && typeof catatan === 'string' ? catatan.trim().substring(0, 500) : undefined;

    const newId = await createItinerary(keberangkatanId, hariKeNum, judul_kegiatan.trim(), waktu.trim(), sanitizedCatatan);
    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan jadwal kegiatan' },
      { status: 500 }
    );
  }
}
