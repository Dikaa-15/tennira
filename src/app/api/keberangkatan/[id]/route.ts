import { NextResponse } from 'next/server';
import { getKeberangkatanById } from '@/repositories/keberangkatanRepo';
import { getItineraryByKeberangkatanId, getHotelByKeberangkatanId } from '@/repositories/itineraryRepo';

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID keberangkatan tidak valid' },
        { status: 400 }
      );
    }

    const keberangkatan = await getKeberangkatanById(id);
    if (!keberangkatan) {
      return NextResponse.json(
        { success: false, message: 'Data keberangkatan tidak ditemukan' },
        { status: 404 }
      );
    }

    const itinerary = await getItineraryByKeberangkatanId(id);
    const hotels = await getHotelByKeberangkatanId(id);

    return NextResponse.json({
      id: keberangkatan.id,
      nama_grup: keberangkatan.nama_grup,
      kode_grup: keberangkatan.kode_grup,
      tanggal_berangkat: keberangkatan.tanggal_berangkat,
      itinerary,
      hotel: hotels.length > 0 ? hotels[0] : null,
      hotels,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail keberangkatan' },
      { status: 500 }
    );
  }
}
