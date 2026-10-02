-- ==========================================================
-- SKEMA DATABASE SAKINAH (Hackathon FIK FAIR 2026)
-- Stack: MySQL 8.0+ / MariaDB
-- Karakteristik: Prepared Statements Ready, Indexed for Polling
-- ==========================================================

DROP TABLE IF EXISTS bantuan_request;
DROP TABLE IF EXISTS status_log;
DROP TABLE IF EXISTS hotel_info;
DROP TABLE IF EXISTS itinerary;
DROP TABLE IF EXISTS jamaah;
DROP TABLE IF EXISTS keberangkatan;
DROP TABLE IF EXISTS admin_users;

-- 1. Tabel Admin (Akses Tour Leader / Petugas)
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode_akses VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Keberangkatan (Grup Umrah)
CREATE TABLE keberangkatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_grup VARCHAR(150) NOT NULL,
    kode_grup VARCHAR(50) NOT NULL UNIQUE,
    tanggal_berangkat DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_kode_grup (kode_grup)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Jamaah (Viewer / Anggota Rombongan)
CREATE TABLE jamaah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keberangkatan_id INT NOT NULL,
    nama VARCHAR(150) NOT NULL,
    nomor_paspor VARCHAR(50) NULL,
    kontak_keluarga VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (keberangkatan_id) REFERENCES keberangkatan(id) ON DELETE CASCADE,
    INDEX idx_keberangkatan_jamaah (keberangkatan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Status Log (Fitur 1: Live Journey Status)
-- Enum Checkpoint: 'check_in', 'lewat_imigrasi', 'ruang_tunggu', 'naik_pesawat'
CREATE TABLE status_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jamaah_id INT NOT NULL,
    checkpoint ENUM('check_in', 'lewat_imigrasi', 'ruang_tunggu', 'naik_pesawat') NOT NULL,
    catatan VARCHAR(255) NULL,
    dicatat_oleh VARCHAR(100) DEFAULT 'Tour Leader',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jamaah_id) REFERENCES jamaah(id) ON DELETE CASCADE,
    INDEX idx_jamaah_timestamp (jamaah_id, timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Bantuan Request (Fitur 3: Tombol Bantuan / Lapor Kondisi)
-- Enum Kategori: 'terpisah_rombongan', 'masalah_dokumen', 'bantuan_medis', 'lainnya'
-- Enum Status: 'baru', 'ditangani'
-- Enum Prioritas: 'tinggi', 'normal'
CREATE TABLE bantuan_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jamaah_id INT NOT NULL,
    kategori ENUM('terpisah_rombongan', 'masalah_dokumen', 'bantuan_medis', 'lainnya') NOT NULL,
    checkpoint_terakhir VARCHAR(50) NOT NULL,
    prioritas ENUM('tinggi', 'normal') DEFAULT 'normal',
    status ENUM('baru', 'ditangani') DEFAULT 'baru',
    catatan_admin VARCHAR(255) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (jamaah_id) REFERENCES jamaah(id) ON DELETE CASCADE,
    INDEX idx_bantuan_polling (status, prioritas, timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Itinerary (Fitur 2: Info Perjalanan Terpusat)
CREATE TABLE itinerary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keberangkatan_id INT NOT NULL,
    hari_ke INT NOT NULL,
    judul_kegiatan VARCHAR(200) NOT NULL,
    waktu VARCHAR(50) NOT NULL,
    catatan TEXT NULL,
    FOREIGN KEY (keberangkatan_id) REFERENCES keberangkatan(id) ON DELETE CASCADE,
    INDEX idx_itinerary_grup (keberangkatan_id, hari_ke)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Hotel Info (Fitur 2: Info Hotel & Kontak Darurat)
CREATE TABLE hotel_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keberangkatan_id INT NOT NULL,
    nama_hotel VARCHAR(150) NOT NULL,
    kota VARCHAR(50) NOT NULL DEFAULT 'Madinah',
    alamat TEXT NOT NULL,
    kontak VARCHAR(50) NOT NULL,
    FOREIGN KEY (keberangkatan_id) REFERENCES keberangkatan(id) ON DELETE CASCADE,
    INDEX idx_hotel_grup (keberangkatan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA UNTUK SKENARIO DEMO HACKATHON
-- ==========================================================

-- Seed Admin
INSERT INTO admin_users (nama, kode_akses) 
VALUES ('Ust. Rahmat (Tour Leader)', 'ADMIN2026');

-- Seed Keberangkatan Demo
INSERT INTO keberangkatan (id, nama_grup, kode_grup, tanggal_berangkat) 
VALUES (1, 'Rombongan Barokah 04 Oktober', 'UMR-OKT-01', '2026-10-04');

-- Seed Jamaah Contoh (3 Profil Jamaah)
INSERT INTO jamaah (id, keberangkatan_id, nama, nomor_paspor, kontak_keluarga) VALUES
(1, 1, 'H. Ahmad Dahlan (Lansia - 68 th)', 'A12345678', '+6281234567801'),
(2, 1, 'Hj. Siti Aminah (Lansia - 65 th)', 'A12345679', '+6281234567802'),
(3, 1, 'Bpk. Hendra Gunawan (Pendamping - 42 th)', 'B98765432', '+6281234567803');

-- Seed Riwayat Checkpoint Awal (H. Ahmad Dahlan sudah sampai Check-in)
INSERT INTO status_log (jamaah_id, checkpoint, catatan, dicatat_oleh, timestamp) VALUES
(1, 'check_in', 'Koper bagasi sudah masuk konter T3', 'Ust. Rahmat (TL)', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(2, 'check_in', 'Koper bagasi sudah masuk konter T3', 'Ust. Rahmat (TL)', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(3, 'check_in', 'Koper bagasi sudah masuk konter T3', 'Ust. Rahmat (TL)', DATE_SUB(NOW(), INTERVAL 45 MINUTE));

-- Seed Itinerary Hari ke-1 & ke-2
INSERT INTO itinerary (keberangkatan_id, hari_ke, judul_kegiatan, waktu, catatan) VALUES
(1, 1, 'Kumpul di Bandara Soekarno-Hatta Terminal 3', '06:00 WIB', 'Gate 2 Internasional, briefing pembagian paspor'),
(1, 1, 'Keberangkatan Menuju Bandara Madinah (SV-819)', '10:30 WIB', 'Penerbangan langsung ~9 jam'),
(1, 1, 'Tiba di Bandara Prince Mohammad Bin Abdulaziz Madinah', '16:30 WAS', 'Proses imigrasi & bagasi, naik bus travel ke hotel'),
(1, 1, 'Check-in Hotel & Istirahat', '19:00 WAS', 'Makan malam di restoran hotel lantai M'),
(1, 2, 'Shalat Subuh Berjamaah di Masjid Nabawi & Ziarah Raudhah', '04:30 WAS', 'Titik kumpul di Lobby Hotel pukul 03:45 WAS');

-- Seed Info Hotel Madinah & Makkah
INSERT INTO hotel_info (keberangkatan_id, nama_hotel, kota, alamat, kontak) VALUES
(1, 'Hotel Al-Ansar Golden Tulip', 'Madinah', 'Central Area Northern, Bada\'ah, Madinah 42311 (±150m dari Pintu 333 Masjid Nabawi)', '+966-14-820-5555'),
(1, 'Pullman Zamzam Makkah', 'Makkah', 'Abraj Al Bait Complex, King Abdul Aziz Endowment, Makkah', '+966-12-571-5555');
