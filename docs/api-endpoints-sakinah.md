# API & Endpoint List — Sakinah (working title)

**Stack:** Next.js App Router (Route Handlers) · MySQL · prepared statements via `repositories/`
**Base path:** `/api`
**Autentikasi:** Admin pakai `kode_akses` (session cookie), Viewer pakai `kode_grup` keberangkatan (session cookie, tanpa akun)

---

## 1. Auth

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/admin` | Publik | Login admin dengan kode akses, set session cookie |
| POST | `/api/auth/viewer` | Publik | Masuk sebagai viewer dengan kode grup keberangkatan |
| POST | `/api/auth/logout` | Admin/Viewer | Hapus session cookie |

**POST `/api/auth/admin`**
```json
// Request
{ "kode_akses": "ADMIN2026" }
// Response 200
{ "success": true, "role": "admin" }
// Response 401
{ "success": false, "message": "Kode akses tidak valid" }
```

**POST `/api/auth/viewer`**
```json
// Request
{ "kode_grup": "UMR-OKT-01" }
// Response 200
{ "success": true, "keberangkatan_id": 1, "nama_grup": "Keberangkatan 4 Oktober" }
```

---

## 2. Keberangkatan

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/keberangkatan` | Admin | List seluruh keberangkatan |
| POST | `/api/keberangkatan` | Admin | Buat keberangkatan baru (setup demo) |
| GET | `/api/keberangkatan/[id]` | Admin, Viewer | Detail keberangkatan + itinerary + hotel |

**POST `/api/keberangkatan`**
```json
// Request
{ "nama_grup": "Keberangkatan 4 Oktober", "kode_grup": "UMR-OKT-01", "tanggal_berangkat": "2026-10-04" }
// Response 201
{ "success": true, "id": 1 }
```

**GET `/api/keberangkatan/[id]`**
```json
// Response 200
{
  "id": 1,
  "nama_grup": "Keberangkatan 4 Oktober",
  "itinerary": [ { "hari_ke": 1, "judul_kegiatan": "Tiba di Madinah", "waktu": "14:00" } ],
  "hotel": { "nama_hotel": "Hotel Al-Ansar", "kontak": "+966xxxxxxx" }
}
```

---

## 3. Jamaah

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/keberangkatan/[id]/jamaah` | Admin | List jamaah dalam satu keberangkatan |
| POST | `/api/keberangkatan/[id]/jamaah` | Admin | Tambah jamaah (dummy, untuk setup demo) |

```json
// POST request
{ "nama": "Jamaah Lansia 1" }
// Response 201
{ "success": true, "id": 5 }
```

---

## 4. Status Log (Fitur 1 — Live Journey Status)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/jamaah/[id]/status` | Admin | Catat checkpoint status baru |
| GET | `/api/jamaah/[id]/status` | Admin, Viewer | Ambil status terkini + riwayat (dipanggil polling) |

**POST `/api/jamaah/[id]/status`**
```json
// Request
{ "checkpoint": "lewat_imigrasi" }
// checkpoint enum: "check_in" | "lewat_imigrasi" | "ruang_tunggu" | "naik_pesawat"
// Response 201
{ "success": true, "timestamp": "2026-10-01T10:15:00Z" }
```

**GET `/api/jamaah/[id]/status`**
```json
// Response 200 — dipanggil Viewer setiap 10-15 detik (polling)
{
  "status_terkini": "lewat_imigrasi",
  "riwayat": [
    { "checkpoint": "check_in", "timestamp": "2026-10-01T09:00:00Z" },
    { "checkpoint": "lewat_imigrasi", "timestamp": "2026-10-01T10:15:00Z" }
  ]
}
```

---

## 5. Bantuan Request (Fitur 3 — Tombol Bantuan)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/jamaah/[id]/bantuan` | Viewer | Kirim permintaan bantuan |
| GET | `/api/bantuan` | Admin | List seluruh permintaan (dipanggil polling), urut prioritas |
| PATCH | `/api/bantuan/[id]` | Admin | Ubah status jadi "ditangani" |

**POST `/api/jamaah/[id]/bantuan`**
```json
// Request
{ "kategori": "terpisah_rombongan" }
// kategori enum: "terpisah_rombongan" | "masalah_dokumen" | "bantuan_medis" | "lainnya"
// prioritas di-set otomatis server-side: terpisah_rombongan & bantuan_medis -> "tinggi", lainnya -> "normal"
// Response 201
{ "success": true, "id": 12, "prioritas": "tinggi" }
```

**GET `/api/bantuan`**
```json
// Response 200 — admin polling, sudah terurut: prioritas tinggi di atas, lalu terbaru dulu
{
  "data": [
    {
      "id": 12,
      "jamaah_nama": "Jamaah Lansia 1",
      "kategori": "terpisah_rombongan",
      "prioritas": "tinggi",
      "checkpoint_terakhir": "lewat_imigrasi",
      "status": "baru",
      "timestamp": "2026-10-01T10:20:00Z"
    }
  ]
}
```

**PATCH `/api/bantuan/[id]`**
```json
// Request
{ "status": "ditangani" }
// Response 200
{ "success": true }
```

---

## 6. Itinerary & Hotel (Fitur 2 — Info Perjalanan Terpusat)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/keberangkatan/[id]/itinerary` | Admin, Viewer | Ambil jadwal per hari |
| POST | `/api/keberangkatan/[id]/itinerary` | Admin | Tambah/isi jadwal (setup) |
| GET | `/api/keberangkatan/[id]/hotel` | Admin, Viewer | Ambil info hotel |
| POST | `/api/keberangkatan/[id]/hotel` | Admin | Isi info hotel (setup) |

---

## 7. Ringkasan Pemetaan ke Fitur PRD

| Fitur PRD | Endpoint yang dipakai |
|---|---|
| Fitur 1: Live Journey Status | `POST/GET /api/jamaah/[id]/status` |
| Fitur 2: Info Perjalanan Terpusat | `GET/POST /api/keberangkatan/[id]/itinerary`, `/hotel` |
| Fitur 3: Tombol Bantuan | `POST /api/jamaah/[id]/bantuan`, `GET /api/bantuan`, `PATCH /api/bantuan/[id]` |

---

## 8. Catatan Implementasi

- Semua endpoint **wajib** mengakses database lewat `repositories/`, bukan query langsung di route handler (sesuai Design System, Bagian 4).
- Validasi `checkpoint` dan `kategori` harus dicek terhadap enum yang ditentukan di server-side — jangan percaya input bebas dari client.
- `GET /api/jamaah/[id]/status` dan `GET /api/bantuan` adalah dua endpoint yang **di-polling**, pastikan query-nya ringan (index pada kolom `jamaah_id` dan `timestamp`) supaya tidak membebani saat demo.
- Untuk kebutuhan demo, endpoint `POST` di bagian Keberangkatan/Jamaah/Itinerary/Hotel cukup dipakai sekali untuk setup data dummy, tidak perlu UI admin yang mewah untuk ini — bisa lewat skrip seed atau Postman manual.
