import { NextResponse } from 'next/server';
import {
  getLatestStatusByJamaahId,
  getStatusHistoryByJamaahId,
  createStatusLog,
  CheckpointType,
} from '@/repositories/statusRepo';

const VALID_CHECKPOINTS: CheckpointType[] = [
  'check_in',
  'lewat_imigrasi',
  'ruang_tunggu',
  'naik_pesawat',
];

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const jamaahId = Number(params.id);

    if (!jamaahId || isNaN(jamaahId)) {
      return NextResponse.json(
        { success: false, message: 'ID jamaah tidak valid' },
        { status: 400 }
      );
    }

    const latest = await getLatestStatusByJamaahId(jamaahId);
    const history = await getStatusHistoryByJamaahId(jamaahId);

    return NextResponse.json({
      status_terkini: latest ? latest.checkpoint : 'check_in',
      catatan_terkini: latest ? latest.catatan : null,
      waktu_terkini: latest ? latest.timestamp : null,
      riwayat: history.map((h) => ({
        id: h.id,
        checkpoint: h.checkpoint,
        catatan: h.catatan,
        dicatat_oleh: h.dicatat_oleh,
        timestamp: h.timestamp,
      })),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat status jamaah' },
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
    const jamaahId = Number(params.id);
    const body = await request.json();
    const { checkpoint, catatan, dicatat_oleh } = body;

    if (!jamaahId || isNaN(jamaahId)) {
      return NextResponse.json(
        { success: false, message: 'ID jamaah tidak valid' },
        { status: 400 }
      );
    }

    if (!checkpoint || !VALID_CHECKPOINTS.includes(checkpoint)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Checkpoint tidak valid. Pilihan: check_in, lewat_imigrasi, ruang_tunggu, naik_pesawat',
        },
        { status: 400 }
      );
    }

    const newLog = await createStatusLog(
      jamaahId,
      checkpoint,
      catatan,
      dicatat_oleh || 'Tour Leader'
    );

    return NextResponse.json(
      {
        success: true,
        checkpoint: newLog.checkpoint,
        timestamp: newLog.timestamp,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status checkpoint' },
      { status: 500 }
    );
  }
}
