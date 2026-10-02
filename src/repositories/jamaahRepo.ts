import { getDbPool } from '@/lib/db';

export interface Jamaah {
  id: number;
  keberangkatan_id: number;
  nama: string;
  nomor_paspor?: string;
  kontak_keluarga?: string;
  created_at?: string;
}

const MOCK_JAMAAH: Jamaah[] = [
  {
    id: 1,
    keberangkatan_id: 1,
    nama: 'H. Ahmad Dahlan (Lansia - 68 th)',
    nomor_paspor: 'A12345678',
    kontak_keluarga: '+6281234567801',
  },
  {
    id: 2,
    keberangkatan_id: 1,
    nama: 'Hj. Siti Aminah (Lansia - 65 th)',
    nomor_paspor: 'A12345679',
    kontak_keluarga: '+6281234567802',
  },
  {
    id: 3,
    keberangkatan_id: 1,
    nama: 'Bpk. Hendra Gunawan (Pendamping - 42 th)',
    nomor_paspor: 'B98765432',
    kontak_keluarga: '+6281234567803',
  },
];

export async function getJamaahByKeberangkatanId(keberangkatanId: number): Promise<Jamaah[]> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM jamaah WHERE keberangkatan_id = ? ORDER BY id ASC',
      [keberangkatanId]
    )) as any;
    return rows as Jamaah[];
  } catch {
    return MOCK_JAMAAH.filter((j) => j.keberangkatan_id === Number(keberangkatanId));
  }
}

export async function getJamaahById(id: number): Promise<Jamaah | null> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM jamaah WHERE id = ? LIMIT 1',
      [id]
    )) as any;
    if (rows && rows.length > 0) return rows[0] as Jamaah;
    return null;
  } catch {
    const found = MOCK_JAMAAH.find((j) => j.id === Number(id));
    return found || null;
  }
}

export async function createJamaah(
  keberangkatan_id: number,
  nama: string,
  nomor_paspor?: string,
  kontak_keluarga?: string
): Promise<number> {
  try {
    const pool = getDbPool();
    const [result] = (await pool.query(
      'INSERT INTO jamaah (keberangkatan_id, nama, nomor_paspor, kontak_keluarga) VALUES (?, ?, ?, ?)',
      [keberangkatan_id, nama, nomor_paspor || null, kontak_keluarga || null]
    )) as any;
    return result.insertId;
  } catch {
    const newId = MOCK_JAMAAH.length + 1;
    MOCK_JAMAAH.push({
      id: newId,
      keberangkatan_id: Number(keberangkatan_id),
      nama,
      nomor_paspor,
      kontak_keluarga,
    });
    return newId;
  }
}
