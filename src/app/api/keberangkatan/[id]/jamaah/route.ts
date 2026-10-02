import { NextResponse } from 'next/server';
import { getJamaahByKeberangkatanId, createJamaah } from '@/repositories/jamaahRepo';
import { getLatestStatusByJamaahId } from '@/repositories/statusRepo';

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

    const jamaahList = await getJamaahByKeberangkatanId(keberangkatanId);
    
    // Attach latest status to each jamaah for convenient admin display
    const enrichedList = await Promise.all(
      jamaahList.map(async (j) => {
        const latest = await getLatestStatusByJamaahId(j.id);
        return {
          ...j,
          status_terkini: latest ? latest.checkpoint : 'check_in',
          status_waktu: latest ? latest.timestamp : null,
          status_catatan: latest ? latest.catatan : null,
        };
      })
    );

    return NextResponse.json({ success: true, data: enrichedList });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data jamaah' },
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
    const { nama, nomor_paspor, kontak_keluarga } = body;

    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Nama jamaah wajib diisi' },
        { status: 400 }
      );
    }

    const newId = await createJamaah(keberangkatanId, nama, nomor_paspor, kontak_keluarga);
    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan jamaah' },
      { status: 500 }
    );
  }
}
