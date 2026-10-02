-- ====================================================================
-- SAFARKU — Skema Database TiDB Cloud (Serverless) & Data Seeding Demo
-- ====================================================================

-- 1. Buat dan Gunakan Database safarku
CREATE DATABASE IF NOT EXISTS safarku;
USE safarku;

-- 2. Tabel Keberangkatan (Departure Groups)
CREATE TABLE IF NOT EXISTS keberangkatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_grup VARCHAR(150) NOT NULL,
    kode_grup VARCHAR(50) UNIQUE NOT NULL,
    tanggal_berangkat DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Jamaah
CREATE TABLE IF NOT EXISTS jamaah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keberangkatan_id INT NOT NULL,
    nama VARCHAR(150) NOT NULL,
    nomor_paspor VARCHAR(50),
    kontak_keluarga VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jamaah_keberangkatan FOREIGN KEY (keberangkatan_id) 
        REFERENCES keberangkatan(id) ON DELETE CASCADE
);

-- 4. Tabel Log Status Perjalanan (Live Journey Status)
CREATE TABLE IF NOT EXISTS status_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jamaah_id INT NOT NULL,
    checkpoint ENUM('check_in', 'lewat_imigrasi', 'ruang_tunggu', 'naik_pesawat') NOT NULL,
    catatan TEXT,
    dicatat_oleh VARCHAR(100) DEFAULT 'Tour Leader',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_status_jamaah FOREIGN KEY (jamaah_id) 
        REFERENCES jamaah(id) ON DELETE CASCADE
);

-- 5. Tabel Permintaan Bantuan Darurat Jamaah (SOS / Help Requests)
CREATE TABLE IF NOT EXISTS bantuan_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jamaah_id INT NOT NULL,
    kategori ENUM('terpisah_rombongan', 'masalah_dokumen', 'bantuan_medis', 'lainnya') NOT NULL,
    checkpoint_terakhir VARCHAR(100) NOT NULL,
    prioritas ENUM('tinggi', 'normal') NOT NULL DEFAULT 'normal',
    status ENUM('baru', 'ditangani') NOT NULL DEFAULT 'baru',
    catatan_admin TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bantuan_jamaah FOREIGN KEY (jamaah_id) 
        REFERENCES jamaah(id) ON DELETE CASCADE
);

-- 6. Tabel Itinerary (Jadwal Kegiatan Ibadah & Perjalanan)
CREATE TABLE IF NOT EXISTS itinerary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keberangkatan_id INT NOT NULL,
    hari_ke INT NOT NULL,
    judul_kegiatan VARCHAR(200) NOT NULL,
    waktu VARCHAR(50) NOT NULL,
    catatan TEXT,
    CONSTRAINT fk_itinerary_keberangkatan FOREIGN KEY (keberangkatan_id) 
        REFERENCES keberangkatan(id) ON DELETE CASCADE
);

-- 7. Tabel Informasi Hotel
CREATE TABLE IF NOT EXISTS hotel_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keberangkatan_id INT NOT NULL,
    nama_hotel VARCHAR(150) NOT NULL,
    kota VARCHAR(50) NOT NULL,
    alamat TEXT NOT NULL,
    kontak VARCHAR(50) NOT NULL,
    CONSTRAINT fk_hotel_keberangkatan FOREIGN KEY (keberangkatan_id) 
        REFERENCES keberangkatan(id) ON DELETE CASCADE
);

-- ====================================================================
-- SEED DATA AWAL UNTUK DEMO PENJURIAN HACKATHON
-- ====================================================================

-- Seed Keberangkatan
INSERT INTO keberangkatan (id, nama_grup, kode_grup, tanggal_berangkat) 
VALUES (1, 'Rombongan Barokah 04 Oktober', 'UMR-OKT-01', '2026-10-04')
ON DUPLICATE KEY UPDATE nama_grup = VALUES(nama_grup);

-- Seed Jamaah
INSERT INTO jamaah (id, keberangkatan_id, nama, nomor_paspor, kontak_keluarga) VALUES
(1, 1, 'H. Ahmad Dahlan (Lansia - 68 th)', 'A12345678', '+6281234567801'),
(2, 1, 'Hj. Siti Aminah (Lansia - 65 th)', 'A12345679', '+6281234567802'),
(3, 1, 'Bpk. Hendra Gunawan (Pendamping - 42 th)', 'B98765432', '+6281234567803')
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

-- Seed Status Log Awal
INSERT INTO status_log (id, jamaah_id, checkpoint, catatan, dicatat_oleh) VALUES
(1, 1, 'check_in', 'Koper bagasi sudah masuk konter T3', 'Ust. Rahmat (TL)'),
(2, 2, 'check_in', 'Koper bagasi sudah masuk konter T3', 'Ust. Rahmat (TL)'),
(3, 3, 'check_in', 'Koper bagasi sudah masuk konter T3', 'Ust. Rahmat (TL)')
ON DUPLICATE KEY UPDATE checkpoint = VALUES(checkpoint);

-- Seed Itinerary
INSERT INTO itinerary (id, keberangkatan_id, hari_ke, judul_kegiatan, waktu, catatan) VALUES
(1, 1, 1, 'Kumpul di Bandara Soekarno-Hatta Terminal 3', '06:00 WIB', 'Gate 2 Internasional, briefing & pembagian paspor'),
(2, 1, 1, 'Keberangkatan Menuju Bandara Madinah (SV-819)', '10:30 WIB', 'Penerbangan langsung ~9 jam'),
(3, 1, 1, 'Tiba di Bandara Prince Mohammad Bin Abdulaziz Madinah', '16:30 WAS', 'Proses imigrasi & bagasi, naik bus travel ke hotel'),
(4, 1, 1, 'Check-in Hotel & Istirahat', '19:00 WAS', 'Makan malam di restoran hotel lantai M'),
(5, 1, 2, 'Shalat Subuh di Masjid Nabawi & Ziarah Raudhah', '04:30 WAS', 'Titik kumpul di Lobby Hotel pukul 03:45 WAS')
ON DUPLICATE KEY UPDATE judul_kegiatan = VALUES(judul_kegiatan);

-- Seed Hotel Info
INSERT INTO hotel_info (id, keberangkatan_id, nama_hotel, kota, alamat, kontak) VALUES
(1, 1, 'Hotel Al-Ansar Golden Tulip', 'Madinah', 'Central Area Northern, Bada\'ah, Madinah 42311 (±150m dari Pintu 333 Masjid Nabawi)', '+966-14-820-5555'),
(2, 1, 'Pullman Zamzam Makkah', 'Makkah', 'Abraj Al Bait Complex, King Abdul Aziz Endowment, Makkah', '+966-12-571-5555')
ON DUPLICATE KEY UPDATE nama_hotel = VALUES(nama_hotel);
