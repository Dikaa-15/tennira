import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getKeberangkatanByKode } from '@/repositories/keberangkatanRepo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kode_grup } = body;

    if (
      !kode_grup ||
      typeof kode_grup !== 'string' ||
      kode_grup.trim() === '' ||
      kode_grup.length > 50
    ) {
      return NextResponse.json(
        { success: false, message: 'Kode grup keberangkatan wajib diisi dengan format yang benar' },
        { status: 400 }
      );
    }

    const keberangkatan = await getKeberangkatanByKode(kode_grup.trim());
    if (!keberangkatan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kode grup tidak ditemukan. Silakan periksa kembali kode Anda.',
        },
        { status: 404 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('safarku_viewer_group', keberangkatan.kode_grup, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      keberangkatan_id: keberangkatan.id,
      nama_grup: keberangkatan.nama_grup,
      kode_grup: keberangkatan.kode_grup,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Terjadi kendala saat memverifikasi kode grup' },
      { status: 500 }
    );
  }
}
