import { getDbPool } from '@/lib/db';

export type KategoriBantuan = 'terpisah_rombongan' | 'masalah_dokumen' | 'bantuan_medis' | 'lainnya';
export type PrioritasBantuan = 'tinggi' | 'normal';
export type StatusBantuan = 'baru' | 'ditangani';

export interface BantuanRequest {
  id: number;
  jamaah_id: number;
  jamaah_nama?: string;
  kategori: KategoriBantuan;
  checkpoint_terakhir: string;
  prioritas: PrioritasBantuan;
  status: StatusBantuan;
  catatan_admin?: string | null;
  timestamp: string;
  updated_at?: string;
}

const MOCK_BANTUAN: BantuanRequest[] = [];

export function calculatePrioritas(kategori: KategoriBantuan): PrioritasBantuan {
  if (kategori === 'terpisah_rombongan' || kategori === 'bantuan_medis') {
    return 'tinggi';
  }
  return 'normal';
}

export async function getAllBantuanRequests(): Promise<BantuanRequest[]> {
  try {
    const pool = getDbPool();
    const query = `
      SELECT 
        b.id,
        b.jamaah_id,
        j.nama AS jamaah_nama,
        b.kategori,
        b.checkpoint_terakhir,
        b.prioritas,
        b.status,
        b.catatan_admin,
        b.timestamp,
        b.updated_at
      FROM bantuan_request b
      JOIN jamaah j ON b.jamaah_id = j.id
      ORDER BY 
        CASE WHEN b.status = 'baru' THEN 0 ELSE 1 END ASC,
        CASE WHEN b.prioritas = 'tinggi' THEN 0 ELSE 1 END ASC,
        b.timestamp DESC
    `;
    const [rows] = (await pool.query(query)) as any;
    return rows as BantuanRequest[];
  } catch {
    return [...MOCK_BANTUAN].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'baru' ? -1 : 1;
      if (a.prioritas !== b.prioritas) return a.prioritas === 'tinggi' ? -1 : 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }
}

export async function getActiveBantuanByJamaahId(jamaahId: number): Promise<BantuanRequest | null> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      "SELECT * FROM bantuan_request WHERE jamaah_id = ? AND status = 'baru' ORDER BY timestamp DESC LIMIT 1",
      [jamaahId]
    )) as any;
    if (rows && rows.length > 0) return rows[0] as BantuanRequest;
    return null;
  } catch {
    const active = MOCK_BANTUAN.find(
      (b) => b.jamaah_id === Number(jamaahId) && b.status === 'baru'
    );
    return active || null;
  }
}

export async function createBantuanRequest(
  jamaahId: number,
  kategori: KategoriBantuan,
  checkpointTerakhir: string,
  jamaahNama?: string
): Promise<BantuanRequest> {
  const prioritas = calculatePrioritas(kategori);
  const timestamp = new Date().toISOString();

  try {
    const pool = getDbPool();
    const [result] = (await pool.query(
      'INSERT INTO bantuan_request (jamaah_id, kategori, checkpoint_terakhir, prioritas, status) VALUES (?, ?, ?, ?, ?)',
      [jamaahId, kategori, checkpointTerakhir, prioritas, 'baru']
    )) as any;
    return {
      id: result.insertId,
      jamaah_id: Number(jamaahId),
      jamaah_nama: jamaahNama || 'Jamaah',
      kategori,
      checkpoint_terakhir: checkpointTerakhir,
      prioritas,
      status: 'baru',
      timestamp,
    };
  } catch {
    const newReq: BantuanRequest = {
      id: MOCK_BANTUAN.length + 1,
      jamaah_id: Number(jamaahId),
      jamaah_nama: jamaahNama || 'Jamaah Lansia',
      kategori,
      checkpoint_terakhir: checkpointTerakhir,
      prioritas,
      status: 'baru',
      timestamp,
    };
    MOCK_BANTUAN.push(newReq);
    return newReq;
  }
}

export async function updateBantuanStatus(
  id: number,
  status: StatusBantuan,
  catatanAdmin?: string | null
): Promise<boolean> {
  try {
    const pool = getDbPool();
    await pool.query(
      'UPDATE bantuan_request SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatanAdmin || null, id]
    );
    return true;
  } catch {
    const target = MOCK_BANTUAN.find((b) => b.id === Number(id));
    if (target) {
      target.status = status;
      if (catatanAdmin !== undefined) target.catatan_admin = catatanAdmin;
      return true;
    }
    return false;
  }
}
