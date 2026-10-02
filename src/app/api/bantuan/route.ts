import { NextResponse } from 'next/server';
import { getAllBantuanRequests } from '@/repositories/bantuanRepo';

export async function GET() {
  try {
    const list = await getAllBantuanRequests();
    return NextResponse.json({ success: true, data: list });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data permintaan bantuan' },
      { status: 500 }
    );
  }
}
