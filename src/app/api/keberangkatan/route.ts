import { NextResponse } from 'next/server';
import { getAllKeberangkatan, createKeberangkatan } from '@/repositories/keberangkatanRepo';

export async function GET() {
  try {
    const list = await getAllKeberangkatan();
    return NextResponse.json({ success: true, data: list });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat daftar keberangkatan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_grup, kode_grup, tanggal_berangkat } = body;

    if (!nama_grup || !kode_grup || !tanggal_berangkat) {
      return NextResponse.json(
        { success: false, message: 'Nama grup, kode grup, dan tanggal berangkat wajib diisi' },
        { status: 400 }
      );
    }

    const newId = await createKeberangkatan(nama_grup, kode_grup, tanggal_berangkat);
    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal membuat keberangkatan baru' },
      { status: 500 }
    );
  }
}
