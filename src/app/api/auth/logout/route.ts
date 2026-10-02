import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('safarku_admin_session');
    cookieStore.delete('safarku_viewer_group');

    return NextResponse.json({ success: true, message: 'Berhasil keluar' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memproses logout' },
      { status: 500 }
    );
  }
}
