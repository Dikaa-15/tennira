# 📋 Log Pengembangan & Monitoring — Project Sakinah

Dokumen ini mencatat seluruh aktivitas perubahan, setup, keputusan arsitektur, dan progres pengembangan aplikasi **Sakinah** (Sistem Informasi & Pendamping Perjalanan Umrah Ramah Lansia).

---

## 📌 Ringkasan Status Project

- **Status:** Inisialisasi & Setup Lingkungan
- **Target Deadline Demo:** 4 Oktober 2026
- **Sub-Tema:** Hackathon FIK FAIR 2026 — *Akses untuk Semua* (SDG 3, 10, 16)
- **Tech Stack:** Next.js (App Router), MySQL (`mysql2/promise`), Tailwind CSS, SweetAlert2 / Lucide Icons.

---

## 🗂️ Log Perubahan (Changelog)

### [2026-10-01] — Setup Fondasi & Internal Memory
- **Setup Skill Antigravity:**
  - Membuat skill internal `prompt-enhancer` di [.agents/skills/prompt-enhancer/SKILL.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/.agents/skills/prompt-enhancer/SKILL.md) untuk eksekusi instruksi zero-round-trip.
- **Internalisasi Dokumen Referensi:**
  - Membaca dan memetakan arsitektur dari [docs/prd-sakinah.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/prd-sakinah.md).
  - Mengunci aturan desain & teknis dari [docs/design-system-sakinah.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/design-system-sakinah.md):
    - **Font & Size:** Plus Jakarta Sans, Body default 18–20px (min 16px untuk caption).
    - **Komponen Kunci:** Tombol interaktif min 52–56px, Tombol Bantuan min 64px (`red-500`).
    - **Pola Arsitektur:** Repository Pattern (`src/repositories/`) dengan *prepared statements* (`?`), dilarang query SQL mentah di route handler.
    - **Scope Ketat:** Live Status (polling 10–15s), Info Perjalanan, Tombol Bantuan. Out-of-scope: GPS live auto-tracking, payment, full CRM.
- **Inisialisasi Dokumen Monitoring:**
  - Membuat [CHANGELOG.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/CHANGELOG.md) sebagai pelacak perubahan berkelanjutan.
- **Standarisasi Spesifikasi & Panduan Pengembangan:**
  - Menelaah dan menyelaraskan kontrak API dari [docs/api-endpoints-sakinah.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/api-endpoints-sakinah.md) (tidak perlu `api-contracts.md` tambahan karena dokumen sudah sangat lengkap & presisi).
  - Membuat [docs/database-schema.sql](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/database-schema.sql) berisi DDL skema MySQL, relasi foreign keys, indeks polling, dan seeding data dummy realistis (Grup UMR-OKT-01, 3 profil jamaah, itinerary, hotel).
  - Membuat [.agents/rules/coding-standards.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/.agents/rules/coding-standards.md) sebagai guardrails wajib AI Agent (Repository pattern, prepared statements `?`, font min 18–20px lansia, tombol 56px/64px, SweetAlert2).
  - Membuat [docs/demo-scenario.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/demo-scenario.md) berisi panduan alur simulasi presentasi hackathon 2–3 menit (SDG 3, 10, 16).

---

## 🧭 Milestone & Checklist Fitur

### [2026-10-01] — Implementasi Penuh Repositories, API Endpoints, UI Components & Pages
- **Repository Pattern (`src/repositories/`)**:
  - `keberangkatanRepo.ts`: Query data keberangkatan & grup dengan prepared statements.
  - `jamaahRepo.ts`: Query profil jamaah rombongan.
  - `statusRepo.ts`: Query riwayat checkpoint & status terkini perjalanan.
  - `bantuanRepo.ts`: Query tiket bantuan, sorting cerdas prioritas tinggi, dan status update.
  - `itineraryRepo.ts`: Query jadwal harian & data hotel Madinah/Makkah.
- **API Route Handlers (`src/app/api/`)**:
  - `/api/auth/admin`, `/api/auth/viewer`, `/api/auth/logout`: Manajemen sesi cookie aman.
  - `/api/keberangkatan`, `/api/keberangkatan/[id]`, `.../jamaah`, `.../itinerary`, `.../hotel`.
  - `/api/jamaah/[id]/status`: Endpoint real-time polling status & update checkpoint TL.
  - `/api/jamaah/[id]/bantuan`, `/api/bantuan`, `/api/bantuan/[id]`: Alur pelaporan bantuan darurat lansia & manajemen admin.
- **Design System & UI Components (`src/components/`)**:
  - `src/components/ui/Button.tsx`: Tombol ramah lansia (min 56px, tombol darurat 64px `red-500`).
  - `src/components/ui/StatusBadge.tsx`: Badge checkpoint kontras tinggi dengan ikon jelas.
  - `src/components/ui/Card.tsx`: Card minimalis, flat, border slate-200.
  - `src/components/Navbar.tsx`: Navigasi bersih dengan info rombongan & kontak darurat TL.
  - `src/components/BantuanModal.tsx`: Modal darurat lansia dengan 4 pilihan mudah & konfirmasi SweetAlert2.
- **Halaman Utama & Rute Publik/Admin**:
  - `src/app/page.tsx`: Landing page akses viewer kode grup (`UMR-OKT-01`) & quick preset juri.
  - `src/app/viewer/[id]/page.tsx`: Halaman lengkap jamaah/keluarga (Live status polling 10s, riwayat timeline, jadwal kegiatan, info hotel, tombol darurat).
  - `src/app/admin/page.tsx`: Dashboard Tour Leader lengkap:
    - Tab 1: **Live Monitor & Checkpoint** (1-click update status rombongan + live polling tiket bantuan darurat).
    - Tab 2: **Kelola Jadwal & Hotel** (CRUD lengkap: Tambah agenda baru, edit jam/judul, hapus kegiatan, dan ubah data hotel & nomor kontak resepsionis).
- **Perbaikan Bug & Penguatan Validasi (Harden Validation & Anti-Spam)**:
  - **Bug Fix Duplicate Bantuan Request**: Membatasi maksimal 1 tiket bantuan aktif (`status: 'baru'`) per jamaah secara bersamaan. Jika masih ada tiket aktif, endpoint `POST /api/jamaah/[id]/bantuan` mengembalikan status `409 Conflict` dengan pesan menenangkan bagi jamaah.
  - **Dynamic UI State**: Halaman Viewer secara real-time mendeteksi tiket aktif dan mengubah tombol darurat menjadi banner status *"Permintaan Bantuan Sedang Ditangani oleh TL"* untuk mencegah kepanikan dan pengiriman berulang.
  - **Audit & Sanitasi Input Menyeluruh**:
    - `POST /api/auth/admin` & `/api/auth/viewer`: Validasi tipe string, batas panjang karakter, dan sanitasi whitespace.
    - `POST /api/keberangkatan/[id]/itinerary` & `PUT /api/itinerary/[id]`: Validasi range `hari_ke` (1-60), batas karakter judul (2-200), waktu, dan sanitasi catatan.
    - `PUT /api/hotel/[id]`: Validasi ketat nama hotel, kota, alamat lengkap, dan nomor kontak telepon.
- **Verifikasi Build**:
  - `npm run build` sukses 100% tanpa error TypeScript maupun Turbopack lint.

---

## 🧭 Milestone & Checklist Fitur

- [x] **Fase 1: Setup Project & Database (Target: 1 Okt)**
  - [x] Inisialisasi Next.js 16 (App Router, Tailwind CSS v4, TypeScript)
  - [x] Konfigurasi Design System Tailwind & font Plus Jakarta Sans untuk lansia
  - [x] Setup package pendukung (`mysql2`, `sweetalert2`, `lucide-react`, `clsx`, `tailwind-merge`)
  - [x] Setup koneksi database MySQL singleton pool (`src/lib/db.ts`) & `.env.example`
  - [x] Setup helper SweetAlert ramah lansia (`src/utils/sweetAlert.ts`) & class merger (`src/utils/cn.ts`)
  - [x] Verifikasi build Next.js (`npm run build` berhasil 100%)

- [x] **Fase 2: Core Fitur 1 & 2 (Target: 2 Okt)**
  - [x] `src/repositories/` untuk semua entitas data (Prepared statements + fallback mock demo)
  - [x] Layout & Halaman Publik Viewer `src/app/viewer/[id]/page.tsx`
  - [x] Fitur Live Journey Status (Checkpoint visual, timeline riwayat, polling auto-update 10s)
  - [x] Fitur Info Perjalanan Terpusat (Itinerary per hari, hotel Madinah/Makkah, kontak darurat)

- [x] **Fase 3: Core Fitur 3 & Admin Dashboard (Target: 3 Okt)**
  - [x] Tombol Bantuan & Form Kategori Bantuan lansia-friendly di Viewer (`src/components/BantuanModal.tsx`)
  - [x] Admin Portal `src/app/admin/page.tsx` (Login kode akses sederhana `ADMIN2026`)
  - [x] Dashboard Admin (Update status checkpoint instan, monitoring & penanganan tiket bantuan real-time polling)
  - [x] Feedback visual ramah lansia (SweetAlert2 untuk semua aksi)

- [ ] **Fase 4: QA, Polish & Deployment (Target: 4 Okt)**
  - [ ] Verifikasi kontras warna & accessibility lansia di mobile & desktop viewport
  - [ ] Pengujian skenario demo hackathon end-to-end (2 tab browser simulasi)
  - [ ] Deployment ke platform publik untuk live judging demo
