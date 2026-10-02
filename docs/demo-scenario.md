# 🎬 Skenario Demo & Pitching — Project Sakinah

**Kompetisi:** Hackathon FIK FAIR 2026  
**Sub-Tema:** Akses untuk Semua (SDG 3, 10, 16)  
**Target Waktu Demo:** 2–3 Menit  

---

## 👥 Profil Karakter & Data Demo

| Karakter | Peran | Device / Tampilan | Akun / Akses |
|---|---|---|---|
| **Ust. Rahmat** | Tour Leader / Staf Admin | Laptop (Desktop View) | Kode Akses: `ADMIN2026` |
| **H. Ahmad Dahlan (68 th)** | Jamaah Lansia di Bandara | Smartphone (Mobile View) | Kode Grup: `UMR-OKT-01` |
| **Keluarga Pak Ahmad di Rumah** | Viewer Pemantau | Smartphone/Laptop | Kode Grup: `UMR-OKT-01` |

---

## 🚀 Alur Langkah Demi Langkah Demo (Step-by-Step)

### Babak 1: Titik Masalah & Akses Tanpa Login (Waktu: 00:00 - 00:45)
1. **Narasi Juri:**
   > *"Saat rombongan umrah lansia tiba di bandara, keluarga di rumah cemas dan jamaah sering bingung di titik transisi. Sakinah hadir memberi visibilitas instan tanpa perlu repot registrasi/download aplikasi."*
2. **Aksi Viewer (Layar Mobile):**
   - Buka aplikasi Sakinah.
   - Masukkan Kode Grup: `UMR-OKT-01` (atau klik quick access demo).
   - Tampil halaman utama yang lapang, kontras tinggi, font besar (20px).
   - Terlihat status saat ini: **"Check-in Selesai — Koper bagasi sudah masuk konter T3"**.
   - Buka tab/bagian **Info Perjalanan**: Jadwal kegiatan hari ini dan nama hotel di Madinah beserta kontak darurat langsung terbaca jelas tanpa bertanya ke TL.

---

### Babak 2: Live Journey Status — Update Real-Time (Waktu: 00:45 - 01:30)
1. **Aksi Admin / Tour Leader (Layar Desktop):**
   - Buka portal Admin (`/admin`), login dengan kode `ADMIN2026`.
   - Pilih rombongan *Barokah 04 Oktober*, pilih jamaah *H. Ahmad Dahlan*.
   - Tour Leader memperbarui checkpoint dari *"Check-in"* menjadi **"Lewat Imigrasi"**.
   - Muncul konfirmasi SweetAlert: *"Status berhasil diperbarui"*.
2. **Reaksi di Layar Viewer (Layar Mobile):**
   - Tanpa menekan tombol refresh browser (berkat background polling 10 detik), badge status berubah menjadi **Hijau: "Sudah Lewat Imigrasi"** dan timeline bertambah.
   - Keluarga di rumah langsung merasa tenang mengetahui orang tuanya sudah aman melewati gerbang imigrasi.

---

### Babak 3: Tombol Bantuan Lansia & Respon Cepat (Waktu: 01:30 - 02:15)
1. **Aksi Jamaah Lansia (Layar Mobile):**
   - Simulasikan kondisi: Pak Ahmad terpisah dari rombongan saat menuju gate ruang tunggu.
   - Pak Ahmad menekan tombol besar merah **"Butuh Bantuan"** (tinggi 64px, sangat mudah ditekan lansia).
   - Muncul modal sederhana dengan 4 pilihan besar:
     - [x] **Terpisah Rombongan** *(Prioritas Tinggi)*
     - [ ] Masalah Dokumen
     - [ ] Bantuan Medis *(Prioritas Tinggi)*
     - [ ] Lainnya
   - Pak Ahmad klik **"Kirim Permintaan"**.
   - Muncul SweetAlert menenangkan: *"Permintaan bantuan telah dikirim ke Tour Leader. Mohon tetap di tempat dan jangan panik."*
2. **Reaksi di Layar Admin (Layar Desktop):**
   - Di dashboard Tour Leader, muncul notifikasi & badge darurat merah berprioritas tinggi:  
     **"H. Ahmad Dahlan — Terpisah Rombongan — Checkpoint Terakhir: Lewat Imigrasi"**.
   - Tour Leader menekan tombol **"Tandai Ditangani"** setelah menghampiri jamaah.

---

### Babak 4: Penutup & Dampak SDG (Waktu: 02:15 - 02:45)
- **Kesimpulan Pitching:**
  - **SDG 10 (Mengurangi Ketimpangan):** Memberikan akses teknologi yang inklusif dan mudah dipahami oleh lansia tanpa hambatan UI yang rumit.
  - **SDG 3 (Kesehatan & Kesejahteraan):** Menghilangkan stres mental jamaah & keluarga serta respons cepat bantuan darurat/medis.
  - **SDG 16 (Institusi yang Efektif):** Tour travel memiliki transparansi dan koordinasi lapangan yang solid.
