# Design System & Technical Guideline — [Nama Produk: Sakinah]

> Diadaptasi dari prinsip **Clear · Clean · Flat** (Skolify Design System v1.0), disesuaikan untuk pengguna lansia dan konteks perjalanan umrah.
> Stack: **Next.js · MySQL · Tailwind CSS · SweetAlert**

---

## 1. PRINSIP UTAMA (tetap dipertahankan dari acuan)

1. **Clear** — satu layar, satu tujuan. Hirarki lewat ukuran, bobot, dan spacing — bukan warna ramai.
2. **Clean** — whitespace lapang, tanpa ornamen atau animasi berlebih.
3. **Flat** — pemisah pakai garis tipis dan beda warna latar, bayangan minimal.

**Tambahan khusus untuk lansia:**
4. **Besar & Kontras** — semua elemen interaktif dan teks dibuat lebih besar dari standar umum, kontras warna dijaga tinggi.
5. **Sedikit Langkah** — satu alur, satu keputusan per layar. Hindari navigasi berlapis atau menu tersembunyi.

---

## 2. PERBEDAAN DARI SKOLIFY (penting dibaca dulu)

| Aspek | Skolify (acuan) | Produk Ini (adaptasi) | Alasan |
|---|---|---|---|
| Body text | 16px | **18px–20px** | Lansia butuh ukuran lebih besar untuk kenyamanan baca |
| Tinggi input/tombol | 44px | **52px–56px** | Target sentuh lebih besar, mengurangi salah pencet |
| Sapaan | "Anda" formal | **Tetap "Anda"**, kalimat lebih pendek & sederhana | Formal tetap relevan (konteks travel & lansia), tapi hindari istilah teknis |
| Warna aksen | Biru (`blue-500`) | **Tetap Biru** sebagai warna kepercayaan, ditambah **Hijau** khusus status "aman/selesai" | Biru = trust, hijau = ketenangan/selesai, relevan konteks perjalanan |
| Arsitektur kode | Express + EJS, 5-layer | **Next.js App Router**, lihat Bagian 4 | Menyesuaikan stack yang dipakai tim |

---

## 3. DESIGN TOKENS

### 3.1 Palet Warna

| Kategori | Token | Hex | Penggunaan |
|---|---|---|---|
| Primary Brand | `blue-500` | `#3B82F6` | Tombol utama, elemen aktif |
| Primary Hover | `blue-600` | `#2563EB` | Hover tombol utama |
| Primary Soft | `blue-50` | `#EFF6FF` | Background info/badge |
| Neutral Canvas | `slate-50` | `#F8FAFC` | Background halaman |
| Neutral Surface | `white` | `#FFFFFF` | Kartu, panel |
| Neutral Border | `slate-200` | `#E2E8F0` | Garis pemisah 1px |
| Neutral Body | `slate-800` | `#1E293B` | Teks isi (lebih gelap dari acuan, demi kontras) |
| Neutral Strong | `slate-900` | `#0F172A` | Judul |
| Success/Aman | `green-500` | `#22C55E` | Status "sudah lewat imigrasi", "aman" |
| Warning | `amber-500` | `#F59E0B` | Status menunggu/proses |
| Danger | `red-500` | `#EF4444` | Tombol "Butuh Bantuan", error |

> **Aturan sama seperti acuan:** maksimal 1 warna aksen utama per layar (biru), hijau/merah hanya untuk status.

### 3.2 Tipografi

- **Typeface:** Plus Jakarta Sans (tetap, sudah terbukti mudah dibaca).
- Fallback: `ui-sans-serif, system-ui, sans-serif`.

| Peran | Ukuran | Bobot | Catatan |
|---|---|---|---|
| `h1` | 32–40px | 700 | Judul halaman |
| `h2` | 24–28px | 700 | Judul section |
| `body-lg` | **20px** | 400 | **Teks default untuk konten penting** (naik dari acuan) |
| `body` | **18px** | 400 | Minimum mutlak, jangan lebih kecil |
| `caption` | 16px | 500 | Label kecil, minimum di seluruh produk ini |

> Skolify pakai 16px sebagai body minimum — di produk ini, **16px jadi ukuran TERKECIL yang boleh dipakai**, bukan default.

### 3.3 Ukuran Elemen Interaktif

| Elemen | Ukuran |
|---|---|
| Tombol utama | Tinggi **56px**, padding horizontal 24px, `rounded-lg` |
| Input field | Tinggi **52px**, `rounded-md`, border `slate-300` |
| Tombol "Butuh Bantuan" | Minimal **64px** tinggi, full-width di mobile, warna `red-500` |
| Status badge | `rounded-full`, padding cukup besar agar mudah dibaca dari jarak |

### 3.4 Radius & Elevasi
Sama seperti acuan: `rounded-lg` (12px) untuk tombol/kartu standar, `rounded-xl` (16px) untuk modal, shadow minimal (`shadow-sm`/`shadow-md`).

---

## 4. ARSITEKTUR TEKNIS (Next.js — adaptasi dari 5-Layer Pattern)

```
src/
├── app/
│   ├── (viewer)/          # Halaman untuk jamaah & keluarga (publik, tanpa login)
│   ├── (admin)/           # Panel untuk TL/staf (perlu autentikasi sederhana)
│   └── api/                # Route handlers (setara "controller")
├── lib/
│   ├── db.js               # Koneksi pool MySQL (mysql2/promise)
│   └── validators/         # Validasi input server-side
├── repositories/           # Isolasi query SQL — SEMUA query wajib lewat sini
├── components/             # Komponen UI reusable (Button, Card, StatusBadge, dll)
├── utils/                  # Helper murni (format tanggal, slug, dll)
└── styles/                 # Tailwind config, token warna custom
```

**Aturan wajib (tetap dari acuan Skolify):**
1. **Dilarang** menulis query SQL mentah di dalam route handler — semua lewat `repositories/`, pakai *prepared statements* (`?` placeholder).
2. Validasi input di server-side, bukan hanya di client.
3. Jangan tampilkan raw error/stack trace ke pengguna — tampilkan pesan sederhana ("Terjadi kendala, coba lagi").
4. Karena tidak ada konsep multi-tenant sekolah, isolasi data cukup lewat `keberangkatan_id` di setiap query terkait jamaah.

---

## 5. KOMPONEN UI BAKU

### Tombol
- **Primary:** `bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg h-14 px-6 text-lg`
- **Danger (Butuh Bantuan):** `bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg h-16 w-full text-xl`
- **Secondary:** `bg-white border border-slate-300 text-slate-800 font-semibold rounded-lg h-14 px-6`

### Status Badge (Fitur Live Journey Status)
- Menunggu: `bg-amber-50 text-amber-700`
- Sudah lewat checkpoint: `bg-green-50 text-green-700`
- Butuh perhatian: `bg-red-50 text-red-700`

### Kartu Info (Itinerary/Hotel)
- `bg-white border border-slate-200 rounded-xl p-6 shadow-sm`, judul `h3` + isi `body-lg`.

---

## 6. DO & DON'T

| ✅ Lakukan | ❌ Hindari |
|---|---|
| Teks minimal 16px, default 18-20px | Teks di bawah 16px untuk konten apa pun |
| Satu aksi utama per layar, tombol besar dan jelas | Banyak tombol kecil berdekatan |
| Bahasa sederhana, kalimat pendek, tetap sapaan "Anda" | Istilah teknis ("checkpoint", "sync", dsb) tanpa penjelasan |
| Kontras tinggi (teks gelap di latar terang) | Teks abu-abu muda di atas putih |
| Semua query lewat `repositories/`, prepared statements | Query SQL langsung di route/controller |
| Konfirmasi visual jelas tiap aksi (SweetAlert) | Aksi penting tanpa konfirmasi (misal kirim bantuan tanpa notif sukses) |

---

*Catatan: nama produk masih working title "Sakinah" — ganti token/branding sesuai keputusan final tim.*
