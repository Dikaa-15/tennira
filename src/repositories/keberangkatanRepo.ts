import { getDbPool } from '@/lib/db';

export interface Keberangkatan {
  id: number;
  nama_grup: string;
  kode_grup: string;
  tanggal_berangkat: string;
  created_at?: string;
}

// Fallback in-memory data for demo resiliency
const MOCK_KEBERANGKATAN: Keberangkatan[] = [
  {
    id: 1,
    nama_grup: 'Rombongan Barokah 04 Oktober',
    kode_grup: 'UMR-OKT-01',
    tanggal_berangkat: '2026-10-04',
  },
];

export async function getAllKeberangkatan(): Promise<Keberangkatan[]> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query('SELECT * FROM keberangkatan ORDER BY id DESC')) as any;
    return rows as Keberangkatan[];
  } catch {
    return MOCK_KEBERANGKATAN;
  }
}

export async function getKeberangkatanByKode(kodeGrup: string): Promise<Keberangkatan | null> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM keberangkatan WHERE kode_grup = ? LIMIT 1',
      [kodeGrup.trim().toUpperCase()]
    )) as any;
    if (rows && rows.length > 0) return rows[0] as Keberangkatan;
    return null;
  } catch {
    const found = MOCK_KEBERANGKATAN.find(
      (k) => k.kode_grup.toLowerCase() === kodeGrup.trim().toLowerCase()
    );
    return found || null;
  }
}

export async function getKeberangkatanById(id: number): Promise<Keberangkatan | null> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM keberangkatan WHERE id = ? LIMIT 1',
      [id]
    )) as any;
    if (rows && rows.length > 0) return rows[0] as Keberangkatan;
    return null;
  } catch {
    const found = MOCK_KEBERANGKATAN.find((k) => k.id === Number(id));
    return found || null;
  }
}

export async function createKeberangkatan(
  nama_grup: string,
  kode_grup: string,
  tanggal_berangkat: string
): Promise<number> {
  try {
    const pool = getDbPool();
    const [result] = (await pool.query(
      'INSERT INTO keberangkatan (nama_grup, kode_grup, tanggal_berangkat) VALUES (?, ?, ?)',
      [nama_grup, kode_grup.toUpperCase(), tanggal_berangkat]
    )) as any;
    return result.insertId;
  } catch {
    const newId = MOCK_KEBERANGKATAN.length + 1;
    MOCK_KEBERANGKATAN.push({
      id: newId,
      nama_grup,
      kode_grup: kode_grup.toUpperCase(),
      tanggal_berangkat,
    });
    return newId;
  }
}
