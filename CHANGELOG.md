# 📝 Changelog — Safarku (Platform Pendamping Umrah Ramah Lansia)

Semua pembaruan fitur, perbaikan arsitektur, dan perubahan antarmuka dicatat secara kronologis dalam dokumen ini.

---

## 🧭 Milestone & Checklist Fitur

### [2026-10-02] — Modernisasi UI: Migrasi ke Flat Vector Icons & Integrasi TiDB Cloud
- **Migrasi Penuh ke Flat Vector Icons (`lucide-react`)**:
  - Mengganti seluruh emoji teks/bawaan browser di semua halaman (`Home`, `Viewer`, `Admin Dashboard`, dan `Modal Bantuan`) menjadi *flat vector icons* yang konsisten, berestetika modern, dan kontras tinggi.
  - Komponen ikon yang diintegrasikan: `<MapPin />`, `<Calendar />`, `<Building2 />`, `<AlertTriangle />`, `<AlertCircle />`, `<Eye />`, `<Clock />`, `<Lightbulb />`, `<MessageSquare />`, `<FileText />`, `<ShieldAlert />`, dan `<CheckCircle2 />`.
- **Rebranding Aplikasi ("Safarku")**:
  - Memperbarui seluruh penamaan aplikasi, judul halaman, metadata, navigasi, dan footer menjadi **Safarku** (Pendamping Perjalanan Umrah Ramah Lansia).
  - Mengubah penamaan sesi cookie aman menjadi `safarku_admin_session` dan `safarku_viewer_group`.
  - Mengubah nama project di `package.json` menjadi `safarku`.
- **Dukungan TiDB Cloud Serverless & TLS 1.2 (`src/lib/db.ts`)**:
  - Menambahkan konfigurasi SSL dinamis: `ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }` saat `DB_SSL=true`.
  - Optimasi *connection pool* untuk arsitektur Serverless Vercel (`connectionLimit: 5`).
  - Menyesuaikan *default port* TiDB Cloud (`4000`) dan *database target* `safarku`.
- **Skema Database & Seeding TiDB Cloud (`docs/database-schema-safarku.sql`)**:
  - Menyediakan script DDL & DML lengkap untuk database `safarku` yang siap di-copy-paste ke SQL Editor TiDB Cloud.
- **Verifikasi Build**:
  - `npm run build` sukses 100% tanpa error TypeScript maupun Turbopack lint.

---

### [2026-10-01] — Implementasi Penuh Repositories, API Endpoints, UI Components & Pages
- **Repository Pattern (`src/repositories/`)**:
  - `keberangkatanRepo.ts`: Query data keberangkatan & grup dengan prepared statements.
  - `jamaahRepo.ts`: Query profil jamaah rombongan.
  - `statusRepo.ts`: Query log checkpoint & update status perjalanan live.
  - `bantuanRepo.ts`: Query permintaan bantuan darurat jamaah & penanganan TL.
  - `itineraryRepo.ts`: CRUD jadwal kegiatan ibadah & informasi hotel.
- **API Route Handlers (`src/app/api/`)**:
  - RESTful endpoints untuk auth viewer/admin, update status, bantuan SOS, dan manajemen jadwal.
- **Komponen UI & Aksesibilitas Lansia**:
  - Ukuran font besar (`text-xl`, `text-lg`), target sentuh lebar (`h-14`, `h-16`), warna kontras tinggi, integrasi SweetAlert2.
