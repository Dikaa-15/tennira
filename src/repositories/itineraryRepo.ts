import { getDbPool } from '@/lib/db';

export interface ItineraryItem {
  id?: number;
  keberangkatan_id: number;
  hari_ke: number;
  judul_kegiatan: string;
  waktu: string;
  catatan?: string | null;
}

export interface HotelInfo {
  id?: number;
  keberangkatan_id: number;
  nama_hotel: string;
  kota: string;
  alamat: string;
  kontak: string;
}

const MOCK_ITINERARY: ItineraryItem[] = [
  {
    id: 1,
    keberangkatan_id: 1,
    hari_ke: 1,
    judul_kegiatan: 'Kumpul di Bandara Soekarno-Hatta Terminal 3',
    waktu: '06:00 WIB',
    catatan: 'Gate 2 Internasional, briefing & pembagian paspor',
  },
  {
    id: 2,
    keberangkatan_id: 1,
    hari_ke: 1,
    judul_kegiatan: 'Keberangkatan Menuju Bandara Madinah (SV-819)',
    waktu: '10:30 WIB',
    catatan: 'Penerbangan langsung ~9 jam',
  },
  {
    id: 3,
    keberangkatan_id: 1,
    hari_ke: 1,
    judul_kegiatan: 'Tiba di Bandara Prince Mohammad Bin Abdulaziz Madinah',
    waktu: '16:30 WAS',
    catatan: 'Proses imigrasi & bagasi, naik bus travel ke hotel',
  },
  {
    id: 4,
    keberangkatan_id: 1,
    hari_ke: 1,
    judul_kegiatan: 'Check-in Hotel & Istirahat',
    waktu: '19:00 WAS',
    catatan: 'Makan malam di restoran hotel lantai M',
  },
  {
    id: 5,
    keberangkatan_id: 1,
    hari_ke: 2,
    judul_kegiatan: 'Shalat Subuh di Masjid Nabawi & Ziarah Raudhah',
    waktu: '04:30 WAS',
    catatan: 'Titik kumpul di Lobby Hotel pukul 03:45 WAS',
  },
];

const MOCK_HOTEL: HotelInfo[] = [
  {
    id: 1,
    keberangkatan_id: 1,
    nama_hotel: 'Hotel Al-Ansar Golden Tulip',
    kota: 'Madinah',
    alamat: 'Central Area Northern, Bada\'ah, Madinah 42311 (±150m dari Pintu 333 Masjid Nabawi)',
    kontak: '+966-14-820-5555',
  },
  {
    id: 2,
    keberangkatan_id: 1,
    nama_hotel: 'Pullman Zamzam Makkah',
    kota: 'Makkah',
    alamat: 'Abraj Al Bait Complex, King Abdul Aziz Endowment, Makkah',
    kontak: '+966-12-571-5555',
  },
];

export async function getItineraryByKeberangkatanId(keberangkatanId: number): Promise<ItineraryItem[]> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM itinerary WHERE keberangkatan_id = ? ORDER BY hari_ke ASC, id ASC',
      [keberangkatanId]
    )) as any;
    return rows as ItineraryItem[];
  } catch {
    return MOCK_ITINERARY.filter((i) => i.keberangkatan_id === Number(keberangkatanId));
  }
}

export async function getHotelByKeberangkatanId(keberangkatanId: number): Promise<HotelInfo[]> {
  try {
    const pool = getDbPool();
    const [rows] = (await pool.query(
      'SELECT * FROM hotel_info WHERE keberangkatan_id = ? ORDER BY id ASC',
      [keberangkatanId]
    )) as any;
    return rows as HotelInfo[];
  } catch {
    return MOCK_HOTEL.filter((h) => h.keberangkatan_id === Number(keberangkatanId));
  }
}

export async function createItinerary(
  keberangkatan_id: number,
  hari_ke: number,
  judul_kegiatan: string,
  waktu: string,
  catatan?: string | null
): Promise<number> {
  try {
    const pool = getDbPool();
    const [result] = (await pool.query(
      'INSERT INTO itinerary (keberangkatan_id, hari_ke, judul_kegiatan, waktu, catatan) VALUES (?, ?, ?, ?, ?)',
      [keberangkatan_id, hari_ke, judul_kegiatan, waktu, catatan || null]
    )) as any;
    return result.insertId;
  } catch {
    const newId = Date.now();
    MOCK_ITINERARY.push({
      id: newId,
      keberangkatan_id,
      hari_ke,
      judul_kegiatan,
      waktu,
      catatan,
    });
    return newId;
  }
}

export async function updateItinerary(
  id: number,
  hari_ke: number,
  judul_kegiatan: string,
  waktu: string,
  catatan?: string | null
): Promise<boolean> {
  try {
    const pool = getDbPool();
    await pool.query(
      'UPDATE itinerary SET hari_ke = ?, judul_kegiatan = ?, waktu = ?, catatan = ? WHERE id = ?',
      [hari_ke, judul_kegiatan, waktu, catatan || null, id]
    );
    return true;
  } catch {
    const target = MOCK_ITINERARY.find((item) => item.id === Number(id));
    if (target) {
      target.hari_ke = hari_ke;
      target.judul_kegiatan = judul_kegiatan;
      target.waktu = waktu;
      target.catatan = catatan;
      return true;
    }
    return false;
  }
}

export async function deleteItinerary(id: number): Promise<boolean> {
  try {
    const pool = getDbPool();
    await pool.query('DELETE FROM itinerary WHERE id = ?', [id]);
    return true;
  } catch {
    const index = MOCK_ITINERARY.findIndex((item) => item.id === Number(id));
    if (index !== -1) {
      MOCK_ITINERARY.splice(index, 1);
      return true;
    }
    return false;
  }
}

export async function createHotel(
  keberangkatan_id: number,
  nama_hotel: string,
  kota: string,
  alamat: string,
  kontak: string
): Promise<number> {
  try {
    const pool = getDbPool();
    const [result] = (await pool.query(
      'INSERT INTO hotel_info (keberangkatan_id, nama_hotel, kota, alamat, kontak) VALUES (?, ?, ?, ?, ?)',
      [keberangkatan_id, nama_hotel, kota, alamat, kontak]
    )) as any;
    return result.insertId;
  } catch {
    const newId = Date.now();
    MOCK_HOTEL.push({
      id: newId,
      keberangkatan_id,
      nama_hotel,
      kota,
      alamat,
      kontak,
    });
    return newId;
  }
}

export async function updateHotel(
  id: number,
  nama_hotel: string,
  kota: string,
  alamat: string,
  kontak: string
): Promise<boolean> {
  try {
    const pool = getDbPool();
    await pool.query(
      'UPDATE hotel_info SET nama_hotel = ?, kota = ?, alamat = ?, kontak = ? WHERE id = ?',
      [nama_hotel, kota, alamat, kontak, id]
    );
    return true;
  } catch {
    const target = MOCK_HOTEL.find((h) => h.id === Number(id));
    if (target) {
      target.nama_hotel = nama_hotel;
      target.kota = kota;
      target.alamat = alamat;
      target.kontak = kontak;
      return true;
    }
    return false;
  }
}
