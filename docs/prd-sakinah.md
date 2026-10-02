# Product Requirements Document (PRD)

**Produk:** Sakinah *(working title)*
**Kompetisi:** Hackathon FIK FAIR 2026 — Sub-Tema "Akses untuk Semua" (SDG 3, 10, 16)
**Versi:** 1.0
**Tanggal:** 30 September 2026

---

## 1. Latar Belakang & Masalah

Berdasarkan riset lapangan tim pada keberangkatan jamaah umrah (30 September 2026), ditemukan pola masalah berikut:

- **Titik kebingungan tertinggi** terjadi di momen transisi, khususnya **keluar imigrasi** dan saat **berpisah dengan keluarga**.
- **Pertanyaan tersering** dari jamaah ke petugas adalah soal **hotel dan itinerary** — menunjukkan informasi ini dibutuhkan tapi tidak mudah diakses mandiri.
- **Kekhawatiran terbesar keluarga** adalah jamaah **tersasar/terpisah rombongan**; rasa aman keluarga selama ini bergantung sepenuhnya pada **kesigapan satu individu staf/tour leader**.
- Semua kebutuhan informasi (kesehatan, jadwal, lokasi) saat ini bertumpu pada **satu titik manusia (Tour Leader)** — sebuah *single point of failure*.

**Rumusan Masalah:**
> Jamaah dan keluarga mengalami kebingungan informasi dan kecemasan selama proses keberangkatan umrah, terutama di titik transisi dan soal jadwal/dokumen, karena informasi tersebar dan sangat bergantung pada kesigapan staf/tour leader tertentu.

---

## 2. Tujuan Produk

1. Mengurangi kebingungan jamaah di titik transisi perjalanan dengan menyediakan informasi terpusat dan mudah diakses.
2. Memberi ketenangan bagi keluarga lewat visibilitas status perjalanan jamaah secara real-time (via polling).
3. Menyediakan jalur bantuan cepat dan terstruktur saat jamaah mengalami kendala, menggantikan proses informal yang ada sekarang.

## 3. Metrik Keberhasilan (untuk Demo & Justifikasi ke Juri)

| Metrik | Target Demo |
|---|---|
| Waktu update status oleh TL/Admin | < 10 detik per aksi |
| Waktu viewer melihat update status | ≤ 15 detik (interval polling) |
| Alur permintaan bantuan selesai (klik → diterima admin) | End-to-end berfungsi, < 5 detik |
| Kejelasan alur bagi pengguna awam | Bisa dijelaskan tim dalam 1-2 kalimat |

---

## 4. Target Pengguna (Persona)

| Persona | Peran | Kebutuhan Utama |
|---|---|---|
| **Jamaah** | Viewer (mayoritas lansia) | Info jadwal jelas, tombol bantuan sederhana |
| **Keluarga di rumah** | Viewer | Kepastian status/lokasi jamaah, rasa tenang |
| **Tour Leader / Staf (Admin)** | Admin | Update status cepat, terima & tindak lanjuti permintaan bantuan |

---

## 5. Ruang Lingkup

### In-Scope (dikerjakan untuk submission ini)
- 3 fitur inti: Live Journey Status, Info Perjalanan Terpusat, Tombol Bantuan
- Role Admin (TL/staf) dan Viewer (jamaah/keluarga)
- Akses Viewer tanpa akun (kode grup keberangkatan)
- 1 skenario keberangkatan dummy untuk demo (2-3 jamaah contoh)
- Update status manual oleh Admin (bukan GPS/tracking otomatis)

### Out-of-Scope (secara eksplisit tidak dikerjakan, hindari scope creep)
- Tracking lokasi otomatis (GPS real-time)
- Sistem pembayaran/booking travel
- Multi-bahasa
- Notifikasi push/SMS/WhatsApp otomatis (cukup tampil di web)
- Manajemen data jamaah/travel secara penuh (bukan sistem internal kantor travel)

---

## 6. User Flow

### Flow A — Admin (Tour Leader) Update Status
1. Login sederhana (kode akses Admin) → masuk Dashboard.
2. Pilih grup keberangkatan aktif.
3. Pilih jamaah/rombongan → pilih checkpoint status ("Check-in", "Lewat Imigrasi", "Ruang Tunggu", "Naik Pesawat").
4. Sistem simpan `status_log` baru dengan timestamp.
5. Konfirmasi via SweetAlert ("Status berhasil diperbarui").

### Flow B — Viewer (Jamaah/Keluarga) Pantau Status
1. Buka halaman web → masukkan kode grup keberangkatan.
2. Lihat halaman status: status terkini + riwayat checkpoint + info itinerary/hotel.
3. Halaman otomatis refresh data secara berkala (polling).

### Flow C — Jamaah Minta Bantuan
1. Dari halaman Viewer, tekan tombol **"Butuh Bantuan"**.
2. Pilih kategori (Terpisah rombongan / Masalah dokumen / Bantuan medis / Lainnya).
3. Sistem kirim `bantuan_request` baru, terhubung ke checkpoint terakhir jamaah.
4. Admin menerima notifikasi di dashboard (badge/list baru), tandai status "Ditangani" setelah direspons.
5. Jamaah melihat konfirmasi "Permintaan diterima, mohon tunggu".

---

## 7. Detail Fitur & Acceptance Criteria

### Fitur 1: Live Journey Status
- Admin dapat memilih checkpoint dari daftar tetap (bukan input bebas).
- Setiap perubahan status tercatat dengan timestamp, dan riwayat (bukan hanya status terakhir) tetap bisa dilihat Viewer.
- Viewer dapat melihat status tanpa login, hanya dengan kode grup.
- **Acceptance:** Admin update status → dalam 1 siklus polling, Viewer melihat status baru tanpa refresh manual.

### Fitur 2: Info Perjalanan Terpusat
- Menampilkan jadwal per hari, info hotel, dan kontak darurat dalam bahasa sederhana.
- Konten diinput oleh Admin saat setup keberangkatan (bisa manual/CMS sederhana, tidak perlu editor kompleks).
- **Acceptance:** Viewer dapat melihat jadwal hari ini dan info hotel tanpa perlu bertanya ke siapa pun.

### Fitur 3: Tombol Bantuan / Lapor Kondisi
- Tombol besar, mudah ditemukan di halaman utama Viewer.
- Kategori bantuan singkat dan jelas (maksimal 4 pilihan).
- Permintaan otomatis membawa data checkpoint terakhir jamaah (terhubung ke Fitur 1).
- Admin melihat daftar permintaan bantuan real-time (polling), bisa ubah status jadi "Ditangani".
- **Acceptance:** Alur end-to-end (klik tombol → masuk ke dashboard admin → status berubah) berjalan mulus saat demo.

---

## 8. Struktur Data (Skema Awal)

```
keberangkatan
- id, nama_grup, kode_akses, tanggal_berangkat

jamaah
- id, keberangkatan_id, nama (boleh umum/anonim untuk demo)

status_log
- id, jamaah_id (atau keberangkatan_id jika per rombongan), checkpoint, timestamp, dicatat_oleh

bantuan_request
- id, jamaah_id, kategori, checkpoint_terakhir, status (baru/ditangani), timestamp

itinerary
- id, keberangkatan_id, hari_ke, judul_kegiatan, waktu, catatan

hotel_info
- id, keberangkatan_id, nama_hotel, alamat, kontak
```

---

## 9. Kebutuhan Non-Fungsional

- **Aksesibilitas:** mengikuti Design System (teks minimum 16px, elemen interaktif besar, kontras tinggi) — lihat dokumen `design-system-sakinah.md`.
- **Performa:** halaman Viewer harus tetap ringan meski polling berkala (interval disarankan 10-15 detik, jangan terlalu agresif).
- **Keamanan dasar:** semua input tervalidasi server-side, query lewat prepared statements, tidak ada data pribadi jamaah asli yang dipakai (gunakan data dummy).
- **Ketersediaan saat demo:** aplikasi harus dapat diakses via domain aktif (deploy), sesuai ketentuan wajib panitia.

---

## 10. Timeline Implementasi (Internal, buffer dari deadline 4 Okt)

| Tanggal | Target |
|---|---|
| 1 Okt | Setup project + deploy kosong berhasil tayang; skema database jadi |
| 2 Okt | Fitur 2 (Info Perjalanan) + Fitur 1 (Live Status) dasar selesai |
| 3 Okt | Fitur 3 (Tombol Bantuan) selesai + integrasi dengan Fitur 1 |
| 4 Okt (pagi) | QA end-to-end, isi data dummy skenario demo |
| 4 Okt (buffer) | Rekam video, lengkapi Devpost, submit sebelum deadline panitia |

---

## 11. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Real-time terasa tidak berfungsi saat demo | Gunakan polling interval pendek (10-15 detik) dan uji ulang sebelum submit |
| Scope membesar di tengah jalan | Rujuk kembali ke bagian *Out-of-Scope* di dokumen ini setiap ada usulan fitur baru |
| Deploy bermasalah di menit akhir | Setup deploy di hari pertama (1 Okt), bukan menjelang deadline |
| Data dummy terasa tidak meyakinkan saat demo | Buat skenario yang konsisten dengan cerita riset (nama grup, jadwal, checkpoint yang realistis) |

---

## 12. Pertanyaan Terbuka

- Apakah Admin butuh lebih dari satu akun (misal per TL), atau cukup satu akses admin bersama untuk kebutuhan demo?
- Apakah kategori "Bantuan Medis" perlu penanganan khusus (misal ditandai prioritas tinggi) dibanding kategori lain?
