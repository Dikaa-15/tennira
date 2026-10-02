import { NextResponse } from 'next/server';
import { getHotelByKeberangkatanId, createHotel } from '@/repositories/itineraryRepo';

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

    const data = await getHotelByKeberangkatanId(keberangkatanId);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data hotel' },
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
    const { nama_hotel, kota, alamat, kontak } = body;

    if (!nama_hotel || !kota || !alamat || !kontak) {
      return NextResponse.json(
        { success: false, message: 'Nama hotel, kota, alamat, dan kontak wajib diisi' },
        { status: 400 }
      );
    }

    const newId = await createHotel(keberangkatanId, nama_hotel, kota, alamat, kontak);
    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan info hotel' },
      { status: 500 }
    );
  }
}
