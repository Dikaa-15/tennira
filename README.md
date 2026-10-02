# 🕋 Sakinah — Pendamping Perjalanan Umrah Ramah Lansia

> **Aplikasi Sistem Informasi Terpadu & Pendamping Jamaah Umrah Ramah Lansia**  
> Dibuat untuk kompetisi **Hackathon FIK FAIR 2026** — Sub-Tema *"Akses untuk Semua"* (SDG 3, 10, 16).

---

## 🌟 Fitur Utama

1. **Live Journey Status (Real-Time Checkpoint):**
   - Pemantauan posisi proses jamaah di titik transisi bandara (Check-in, Lewat Imigrasi, Ruang Tunggu, Naik Pesawat).
   - Update otomatis bagi keluarga di rumah tanpa perlu refresh (interval polling 10–15 detik).

2. **Info Perjalanan Terpusat (Itinerary & Hotel):**
   - Akses mandiri jadwal kegiatan harian, kontak darurat, dan informasi hotel di Madinah & Makkah.

3. **Tombol Bantuan Darurat (Lansia-First):**
   - Tombol besar mencolok untuk melaporkan kendala (terpisah rombongan, dokumen, medis).
   - Terintegrasi langsung dengan dashboard Tour Leader beserta checkpoint terakhir jamaah.

---

## 🛠️ Tech Stack & Arsitektur

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) + TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Design System: Clear · Clean · Flat, font min 18–20px untuk lansia)
- **Database:** MySQL dengan **Repository Pattern** & **Prepared Statements** (`mysql2/promise`)
- **UI Components:** Lucide Icons & SweetAlert2

---

## 🚀 Memulai (Getting Started)

### 1. Salin Environment Variables
```bash
cp .env.example .env.local
```
Sesuaikan konfigurasi database MySQL (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

### 2. Setup Database & Seeding
Impor skema database dan data demo:
```bash
mysql -u root -p sakinah_db < docs/database-schema.sql
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📖 Dokumentasi Lengkap
- 📄 [Product Requirements Document (PRD)](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/prd-sakinah.md)
- 🎨 [Design System & Accessibility Guideline](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/design-system-sakinah.md)
- 🔌 [API Endpoints Specification](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/api-endpoints-sakinah.md)
- 🎬 [Skenario Demo Hackathon](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/demo-scenario.md)
- 🗄️ [Skema Database & Seeding](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/docs/database-schema.sql)
