---
name: prompt-enhancer
description: >-
  Silently enhance and structure raw, brief, or ambiguous user instructions internally, then immediately execute the task with zero round-trips. Use whenever the user invokes /prompt-enhancer, asks to improve/enhance/execute a prompt, or provides brief/rough instructions needing proactive execution.
---

# Skill: Prompt Enhancer

## Nama Skill
`prompt-enhancer`

## Kapan Skill Ini Dipakai
Gunakan skill ini setiap kali user memberikan sebuah prompt/instruksi yang masih kasar, singkat, atau general. Skill ini TIDAK menampilkan prompt hasil perbaikan untuk di-copy ulang oleh user — enhancement dilakukan secara internal (silent), lalu langsung dieksekusi sebagai tugas nyata dalam respons yang sama.

Trigger phrases (contoh): `/prompt-enhancer`, "improve prompt ini", "perbaiki prompt", "buatkan prompt untuk...", "rapikan instruksi ini" — atau bahkan tanpa trigger eksplisit, cukup dari prompt user yang terasa kasar/ambigu.

## Tujuan
Mengubah prompt yang kasar/ambigu menjadi versi yang terstruktur, spesifik, dan actionable secara internal — lalu LANGSUNG menjalankan tugas tersebut. User tidak perlu menerima prompt hasil enhancement dan submit ulang; alurnya harus satu langkah: user kasih instruksi kasar → agent enhance di "kepala"-nya sendiri → agent langsung kerjakan.

**Prinsip utama: Zero round-trip.** Jangan pernah berhenti hanya untuk menyajikan versi prompt yang sudah diperbaiki sebagai output akhir. Prompt yang sudah di-enhance adalah alat internal untuk memahami tugas dengan benar, bukan deliverable itu sendiri.

## Cara Kerja (Proses Enhancement — Silent, Internal)

Lakukan langkah-langkah ini secara internal (di dalam reasoning/planning agent), TANPA menampilkannya sebagai output terpisah ke user:

### 1. Identifikasi Intent Asli
- Apa tujuan akhir dari prompt ini? (bukan cuma kata-katanya, tapi maksud di baliknya)
- Apakah ini tugas eksplorasi/analisis, eksekusi/pembuatan sesuatu, atau kombinasi keduanya?

### 2. Cari Gap / Hal yang Ambigu
Cek pertanyaan berikut. Jika prompt asli belum menjawabnya, agent harus mengisi sendiri gap ini dengan asumsi yang paling masuk akal (berdasarkan konteks project/percakapan sebelumnya), BUKAN dengan bertanya balik ke user kecuali benar-benar blocking:
- **Scope**: Apa saja yang termasuk/tidak termasuk?
- **Kriteria/Detail**: Ada aspek spesifik yang harus diperhatikan?
- **Format Output**: File apa, struktur seperti apa?
- **Constraint**: Ada larangan yang perlu ditegaskan (misal: jangan ubah kode)?
- **Konteks Lanjutan**: Apakah hasil ini akan dipakai untuk tahap berikutnya?

### 3. Susun Rencana Eksekusi (bukan teks prompt)
Alih-alih menulis ulang prompt dalam bentuk kalimat, terjemahkan langsung jadi rencana kerja/task list internal:
1. Tugas utama yang akan dikerjakan
2. Breakdown langkah kerja konkret (bukan breakdown "poin prompt")
3. Output final yang akan dihasilkan (file, kode, dokumen, dll.)
4. Batasan yang harus dipatuhi selama eksekusi

### 4. LANGSUNG EKSEKUSI
Setelah rencana internal siap, langsung jalankan tugasnya di respons yang sama — buat file, tulis kode, lakukan analisis, dsb. Jangan berhenti di tahap "berikut prompt yang sudah diperbaiki, silakan jalankan" atau meminta konfirmasi user untuk prompt hasil enhancement.

### 5. Validasi Saat Eksekusi Berjalan
Sambil bekerja, tetap cek:
- Apakah hasilnya sudah menjawab intent asli user?
- Apakah ada asumsi besar yang perlu disebutkan ke user (bukan ditanyakan, cukup dinyatakan singkat)?

## Format Output Skill Ini

Karena skill ini bersifat "langsung aksi", output ke user BUKAN prompt yang sudah diperbaiki, melainkan **hasil kerja itu sendiri**. Format respons:

```
[Satu kalimat singkat opsional yang menyatakan asumsi besar yang diambil, jika ada — bukan pertanyaan]

[Hasil eksekusi langsung: file yang dibuat, analisis yang dilakukan, kode yang ditulis, dll.]
```

Pengecualian — TETAP tanyakan ke user (jangan langsung eksekusi) hanya jika:
- Ada informasi krusial yang benar-benar tidak bisa ditebak/diasumsikan (misal: nama project baru, pilihan di antara opsi yang berdampak besar dan tidak reversible)
- Eksekusi akan menghasilkan side-effect besar/tidak bisa dibatalkan (misal: menghapus data, overwrite file penting)

Selain dua kondisi di atas, selalu pilih asumsi paling masuk akal dan lanjutkan eksekusi.

## Prinsip Tambahan
- Jika tugas ini bagian dari alur berulang (misal: "buat product baru dengan desain sistem konsisten"), gunakan pola/struktur dari pekerjaan sebelumnya di project/percakapan ini sebagai acuan otomatis — tidak perlu user jelaskan ulang.
- Jika prompt asli berbentuk pertanyaan ("gimana ya caranya?"), perlakukan itu sebagai permintaan untuk LANGSUNG dikerjakan, bukan permintaan penjelasan naratif.
- Pastikan format output final kompatibel dengan kebutuhan lanjutan yang sudah diketahui dari konteks sebelumnya (misal: kalau sebelumnya user minta `.md` untuk dipindah ke Google Docs, terapkan itu tanpa diminta ulang).
- Gunakan bahasa yang sama dengan prompt asli dari user (Indonesian in → Indonesian out, dst.).
- Jangan sertakan meta-komentar seperti "berikut prompt yang sudah saya perbaiki" — user hanya perlu melihat hasil kerja, bukan proses enhancement-nya.
