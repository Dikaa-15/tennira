import { getDbPool } from '@/lib/db';

export type CheckpointType = 'check_in' | 'lewat_imigrasi' | 'ruang_tunggu' | 'naik_pesawat';

export interface StatusLog {
  id?: number;
  jamaah_id: number;
  checkpoint: CheckpointType;
  catatan?: string | null;
  dicatat_oleh?: string;
  timestamp: string;
}

const MOCK_STATUS_LOGS: StatusLog[] = [
  {
    id: 1,
    jamaah_id: 1,
    checkpoint: 'check_in',
    catatan: 'Koper bagasi sudah masuk konter T3',
    dicatat_oleh: 'Ust. Rahmat (TL)',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 2,
    jamaah_id: 2,
    checkpoint: 'check_in',
    catatan: 'Koper bagasi sudah masuk konter T3',
    dicatat_oleh: 'Ust. Rahmat (TL)',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 3,
    jamaah_id: 3,
    checkpoint: 'check_in',
    catatan: 'Koper bagasi sudah masuk konter T3',
    dicatat_oleh: 'Ust. Rahmat (TL)',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

export async function getStatusHistoryByJamaahId(jamaahId: number): Promise<StatusLog[]> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM status_log WHERE jamaah_id = ? ORDER BY timestamp ASC',
      [jamaahId]
    )) as any;
    return rows as StatusLog[];
  } catch {
    return MOCK_STATUS_LOGS.filter((s) => s.jamaah_id === Number(jamaahId)).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}

export async function getLatestStatusByJamaahId(jamaahId: number): Promise<StatusLog | null> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM status_log WHERE jamaah_id = ? ORDER BY timestamp DESC LIMIT 1',
      [jamaahId]
    )) as any;
    if (rows && rows.length > 0) return rows[0] as StatusLog;
    return null;
  } catch {
    const history = MOCK_STATUS_LOGS.filter((s) => s.jamaah_id === Number(jamaahId));
    if (history.length === 0) return null;
    return history[history.length - 1];
  }
}

export async function createStatusLog(
  jamaahId: number,
  checkpoint: CheckpointType,
  catatan?: string | null,
  dicatatOleh: string = 'Tour Leader'
): Promise<StatusLog> {
  const timestamp = new Date().toISOString();
  try {
    const pool = getDbPool();
    const [result] = (await pool.query(
      'INSERT INTO status_log (jamaah_id, checkpoint, catatan, dicatat_oleh) VALUES (?, ?, ?, ?)',
      [jamaahId, checkpoint, catatan || null, dicatatOleh]
    )) as any;
    return {
      id: result.insertId,
      jamaah_id: Number(jamaahId),
      checkpoint,
      catatan: catatan || null,
      dicatat_oleh: dicatatOleh,
      timestamp,
    };
  } catch {
    const newLog: StatusLog = {
      id: MOCK_STATUS_LOGS.length + 1,
      jamaah_id: Number(jamaahId),
      checkpoint,
      catatan: catatan || null,
      dicatat_oleh: dicatatOleh,
      timestamp,
    };
    MOCK_STATUS_LOGS.push(newLog);
    return newLog;
  }
}
