import { NextResponse } from 'next/server';
import { updateBantuanStatus, StatusBantuan } from '@/repositories/bantuanRepo';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const body = await request.json();
    const { status, catatan_admin } = body;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID bantuan tidak valid' },
        { status: 400 }
      );
    }

    if (!status || !['baru', 'ditangani'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status bantuan harus "baru" atau "ditangani"' },
        { status: 400 }
      );
    }

    const updated = await updateBantuanStatus(id, status as StatusBantuan, catatan_admin);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Permintaan bantuan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Status berhasil diperbarui' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status bantuan' },
      { status: 500 }
    );
  }
}
