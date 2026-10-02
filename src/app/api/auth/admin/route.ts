import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kode_akses } = body;

    if (!kode_akses || typeof kode_akses !== 'string' || kode_akses.trim().length === 0 || kode_akses.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Format kode akses tidak valid' },
        { status: 400 }
      );
    }

    const validCode = process.env.ADMIN_ACCESS_CODE || 'ADMIN2026';

    if (kode_akses.trim() !== validCode) {
      return NextResponse.json(
        { success: false, message: 'Kode akses admin tidak valid' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('safarku_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true, role: 'admin' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Terjadi kendala saat memproses login admin' },
      { status: 500 }
    );
  }
}
