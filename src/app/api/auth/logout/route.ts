import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('sakinah_admin_session');
    cookieStore.delete('sakinah_viewer_group');

    return NextResponse.json({ success: true, message: 'Berhasil keluar' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Terjadi kendala saat proses logout' },
      { status: 500 }
    );
  }
}
