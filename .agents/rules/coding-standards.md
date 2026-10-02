---
trigger: always_on
---

# 🛡️ Sakinah Coding Standards & Guardrails for AI Agents

> **Tujuan:** Dokumen ini adalah aturan absolut bagi seluruh AI Agent yang bekerja pada repositori **Sakinah**. Semua kode yang dihasilkan **WAJIB** mematuhi pedoman ini tanpa pengecualian.

---

## 1. Arsitektur Kode & Database Rules

### 1.1 Repository Pattern (WAJIB)
- Semua interaksi database MySQL (`mysql2/promise`) **HARUS** berada di dalam direktori `src/repositories/`.
- **DILARANG KERAS** memanggil `db.query()` atau menulis raw SQL string di dalam Next.js Route Handlers (`src/app/api/...`) ataupun React Server Components.
- Semua query SQL **WAJIB** menggunakan **Prepared Statements** dengan placeholder `?`. Dilarang interpolasi string (`${...}`).
- Gunakan koneksi pool tunggal dari `src/lib/db.js`.

### 1.2 Penamaan File & Struktur Direktori
```
src/
├── app/
│   ├── (viewer)/          # Rute publik jamaah/keluarga (tanpa login akun)
│   ├── (admin)/           # Rute dashboard admin/TL (login kode akses)
│   └── api/                # Route handlers sesuai docs/api-endpoints-sakinah.md
├── lib/
│   ├── db.js               # mysql2 pool connection
│   └── validators/         # Zod / custom validator server-side
├── repositories/           # Query SQL terisolasi
│   ├── keberangkatanRepo.js
│   ├── jamaahRepo.js
│   ├── statusRepo.js
│   ├── bantuanRepo.js
│   └── itineraryRepo.js
├── components/             # Reusable UI components
├── utils/                  # Helper murni (formatDate, timeAgo, sweetAlertHelper)
└── styles/                 # Tailwind custom configuration
```

---

## 2. Design System & Accessibility Guardrails (Lansia-First)

### 2.1 Ukuran Font & Tipografi (Plus Jakarta Sans)
- **Default Body Content:** `text-lg` (18px) atau `text-xl` (20px).
- **Minimum Ukuran Teks di Seluruh Aplikasi:** `text-base` (16px) HANYA untuk caption kecil/label sekunder.
- ❌ **DILARANG MENGGUNAKAN** `text-xs` (12px) atau `text-sm` (14px) untuk konten apapun.
- **Heading:** `text-3xl` / `text-4xl` (32–40px, bold) untuk `h1`, `text-2xl` (24–28px, bold) untuk `h2`.

### 2.2 Ukuran Target Sentuh & Tombol
- **Tombol Utama (Primary):** Tinggi minimal `h-14` (56px), padding horizontal `px-6`, `rounded-lg`, `text-lg font-semibold`.
- **Input Field:** Tinggi minimal `h-[52px]` (52px), border `border-slate-300`, `rounded-md`, `text-lg`.
- **Tombol "Butuh Bantuan":** Tinggi minimal `h-16` (64px), full-width di mobile, warna `bg-red-500 hover:bg-red-600 text-white font-bold text-xl rounded-xl shadow-md`.

### 2.3 Palet Warna (Satu Aksen Utama per Layar)
- **Primary Brand:** `blue-500` (`#3B82F6`) & `blue-600` (`#2563EB`).
- **Canvas / Background:** `slate-50` (`#F8FAFC`).
- **Surface / Card:** `white` (`#FFFFFF`) dengan border `slate-200`.
- **Teks:** `slate-800` (`#1E293B`) untuk body text kontras tinggi, `slate-900` untuk judul.
- **Status Hijau (Aman/Selesai):** `green-500` / `bg-green-50 text-green-700`.
- **Status Kuning (Menunggu/Proses):** `amber-500` / `bg-amber-50 text-amber-700`.
- **Status Merah (Bantuan/Darurat):** `red-500` / `bg-red-50 text-red-700`.

---

## 3. Feedback Pengguna & Error Handling

- Gunakan **SweetAlert2** (`Swal.fire`) dengan style yang ramah lansia (teks besar, icon jelas, tombol konfirmasi lebar) untuk setiap aksi penting.
- **DILARANG** menampilkan raw database error / stack trace ke layar pengguna. Selalu return pesan yang ramah dan menenangkan:
  - Contoh: `"Mohon maaf, terjadi kendala saat memuat data. Silakan coba kembali."`
- Setiap input dari client **wajib divalidasi di server-side** (cek enum checkpoint, enum kategori bantuan, panjang kode akses).

---

## 4. Standar Real-time Polling

- Gunakan interval polling **10–15 detik** (`10000ms` – `15000ms`) pada:
  1. Halaman Viewer (`GET /api/jamaah/[id]/status`)
  2. Dashboard Admin (`GET /api/bantuan`)
- Buat custom hook React (e.g. `usePollingStatus`, `usePollingBantuan`) yang bersih, otomatis handle cleanup (`clearInterval`) saat unmount, dan tidak membuat browser freeze.

---

## 5. Sinkronisasi Changelog

- Setiap selesai mengimplementasikan fitur, merapikan struktur, atau mengubah konfigurasi, **WAJIB** memperbarui file [CHANGELOG.md](file:///Users/dwiandikafebriansyah/code/hackaton-upnvj/CHANGELOG.md).
