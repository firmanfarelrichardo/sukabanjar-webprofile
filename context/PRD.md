Berikut adalah pembaruan dokumen **Product Requirement Document (PRD)** untuk Website Profil Desa Sukabanjar.

---

# PRODUCT REQUIREMENT DOCUMENT (PRD) — v2.0

## Website Profile & Portal Digital Desa Sukabanjar

---

## 1. Identitas Proyek & Ringkasan Eksekutif

* **Nama Proyek:** Website Profil & Portal Informasi Digital Desa Sukabanjar
* **Lokasi:** Desa Sukabanjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan, Lampung
* **Konteks:** Program Kerja (Progja) Kuliah Kerja Nyata (KKN)
* **Target Biaya Operasional:** **Rp 0 / Bulan (Zero-Cost Infrastructure)**
* **Prinsip Utama UI/UX:** Clean, Minimalis, **Mobile-First Approach** (Desain responsif & fleksibel 100% pada seluruh ukuran layar: Smartphone, Tablet, Laptop, Desktop), Accessibility-friendly, serta diperkaya mikro-interaksi modern berbasis **React Bits**.
* **Prinsip Pengembangan:** 100% Full Dynamic CMS, Clean Code, Type-Safe, Scalable, dan Maintainable pasca-penarikan KKN.

---

## 2. Tujuan Proyek & Indikator Keberhasilan (OKRs)

### A. Tujuan Proyek

1. **Digitalisasi Informasi Desa:** Menyajikan data profil, potensi UMKM, destinasi wisata, serta struktur pemerintahan desa secara dinamis, menarik, dan mudah diakses.
2. **Kanal Aspirasi Publik:** Menyediakan sarana digital berbasis pengiriman pesan (seperti email) bagi warga untuk menyampaikan aspirasi, saran, atau pengaduan secara cepat, aman, dan praktis.
3. **Pemetaan Fasilitas Publik:** Menampilkan lokasi bangunan dan fasilitas penting desa berbasis peta interaktif tanpa biaya lisensi API Key.
4. **Kearsipan Digital:** Menyediakan modul artikel, berita, dan pengumuman kegiatan desa maupun program KKN secara teratur.
5. **Kemandirian Pengelolaan (CMS Dinamis):** Memastikan seluruh konten website (termasuk Visi & Misi) dapat diubah oleh Perangkat Desa secara mandiri melalui Panel Admin.

### B. Indikator Keberhasilan (Key Results)

* **Biaya Pemeliharaan:** Rp 0/bulan memanfaatkan *Free Tier Infrastructure* (Vercel + Supabase + OpenStreetMap).
* **Performa Website:** Skor Google Lighthouse > 90 pada aspek *Performance*, *Accessibility*, dan *SEO*.
* **Kemudahan Operasional:** Perangkat Desa dapat mengelola berita, UMKM, lokasi peta, serta membaca dan mengelola pesan aspirasi warga dalam waktu < 5 menit.

---

## 3. Arsitektur Teknis & Tech Stack (Zero-Cost Stack)

| Layer | Teknologi | Alasan & Konsekuensi Teknis |
| --- | --- | --- |
| **Framework Frontend** | **Next.js (App Router) + TypeScript** | Menjamin SEO maksimal melalui Server-Side Rendering (SSR) & Static Site Generation (SSG), serta keamanan tipe data (*type-safety*). |
| **Styling & Animation** | **Tailwind CSS + Framer Motion + React Bits** | *Tailwind* untuk kepraktisan styling, *Framer Motion* untuk transisi halus, dan *React Bits* untuk visual UI modern. |
| **Database & Auth** | **Supabase (PostgreSQL Free Tier)** | Kuota gratis 500MB sangat mencukupi untuk data desa, dilengkapi fitur Auth & Storage bawaan. |
| **ORM** | **Prisma ORM** | Memudahkan pemetaan skema database, migrasi aman, dan auto-complete query di lingkungan TypeScript. |
| **Interactive Map** | **Leaflet.js + OpenStreetMap** | Peta interaktif 100% gratis tanpa risiko tagihan API Key Google Maps. |
| **Media Storage** | **Supabase Storage / Cloudinary Free** | Penyimpanan terpisah untuk aset gambar berita, UMKM, galeri, dan bukti foto aspirasi warga. |
| **Deployment** | **Vercel Platform (Hobby Plan)** | Hosting otomatis berbasis CI/CD dari repository GitHub secara gratis dengan SSL/HTTPS terpasang. |

---

## 4. Analisis & Pemetaan Stakeholder (RBAC)

Sistem membagi pengguna ke dalam 2 kategori utama dengan tingkat akses berbeda:

```
+-----------------------------------------------------------------------------------+
|  ROLE / STAKEHOLDER  | HAK AKSES & OTORITAS SISTEM                                |
+-----------------------------------------------------------------------------------+
|  User Publik         | Read-Only ke seluruh halaman profil/berita/peta/UMKM,      |
|  (Warga/Wisatawan)   | serta menyampaikan pesan aspirasi & pengaduan.             |
+-----------------------------------------------------------------------------------+
|  Admin Desa          | Read-Write-Delete penuh ke seluruh modul CMS (Visi-Misi,   |
|  (Perangkat Desa)    | Berita, UMKM, Wisata, Peta) & Mengelola/Membaca Inbox     |
|                      | Pesan Aspirasi Warga.                                     |
+-----------------------------------------------------------------------------------+

```

---

## 5. Rincian Modul & Spesifikasi Fitur Utama

### A. Modul Halaman Publik (Public View)

#### 1. Landing Page (Halaman Utama Interaktif)

* **Hero Banner Dinamis:** Menyajikan foto latar desa dengan teks judul & deskripsi yang dikirim dari database.
* **Quick Access Grid:** Navigasi pintas menuju Form Aspirasi, Peta Bangunan, Katalog UMKM, Wisata, dan Berita.
* **Statistik Ringkas (Count Up):** Angka Luas Wilayah, Total Penduduk, Jumlah Dusun, dan Jumlah UMKM dengan animasi *React Bits Count Up*.
* **Ticker Pengumuman Running Text:** Teks pengumuman berjalan untuk kabar penting/mendesak.

#### 2. Modul Informasi & Profil Desa

* **Profil & Sejarah:** Narasi sejarah pembentukan desa beserta dokumentasi foto legendaris/pemerintahan.
* **Visi & Misi Dinamis:** Teks Visi utama dan daftar poin Misi yang dapat diperbarui kapan saja dari admin.
* **Struktur Organisasi Pemerintahan:** Tampilan hirarki foto Kades, Sekdes, Kepala Dusun, dan Staf dilengkapi nama & jabatan.
* **Demografi Desa:** Visualisasi grafik interaktif (Chart.js / Recharts) untuk data mata pencaharian warga, tingkat pendidikan, dan kelompok umur.

#### 3. Modul Baru: E-Aspirasi & Pengaduan Warga (Pengiriman Pesan Direct)

* **Formulir Pengajuan Pesan Aspirasi:** Warga dapat menyampaikan masukan, pertanyaan, atau pengaduan fasilitas publik secara langsung (seperti formulir pesan/email) dengan input:
* Nama Pelapor (Tersedia opsi centang *Sembunyikan Nama / Anonim*).
* Kategori Laporan (*Fasilitas Publik, Kebersihan/Lingkungan, Keamanan, Saran/Masukan, Lainnya*).
* Judul & Detail Isi Pesan Aspirasi.
* Unggah Lampiran Foto Bukti (Opsional).
* **Konfirmasi Pengiriman:** Setelah mengirim pesan, warga akan langsung mendapatkan notifikasi konfirmasi di layar bahwa pesan aspirasi/pengaduan telah berhasil terkirim ke Balai Desa. Modul ini tidak menggunakan generator nomor tiket, tidak memerlukan nomor WhatsApp/telepon, serta tidak menyediakan fitur cek status laporan.

#### 4. Modul Peta Interaktif Bangunan & Fasilitas Penting

* **Peta Lokasi Desa (Leaflet.js):** Peta desa interaktif dengan *custom pin marker* sesuai kategori:
* Kantor Balai Desa / Fasilitas Publik
* Sekolah / Sarana Pendidikan (SD, PAUD)
* Sarana Kesehatan (Pustu, Posyandu)
* Tempat Ibadah (Masjid, Musholla)
* Titik UMKM & Wisata


* **Popup Detail Lokasi:** Saat *marker* diklik, muncul card berisi nama bangunan, foto, alamat, dan tombol *"Petunjuk Arah (Google Maps)"*.

#### 5. Modul UMKM & Potensi Desa

* **Katalog Produk Lokal:** Card tampilan produk UMKM (kuliner, kerajinan, olahan tani) dilengkapi foto, harga, dan nama pemilik.
* **Integrasi Direct WhatsApp:** Tombol *"Beli / Hubungi Penjual"* yang membuka pesan WhatsApp ke nomor pemilik UMKM secara otomatis dengan format teks pesanan.

#### 6. Modul Wisata & Pemandangan Alam

* **Listing Destinasi:** Daftar tempat wisata dan keindahan alam Sukabanjar (sawah, bukit, saung kumpul, area sungai).
* **Galeri Foto & Informasi Akses:** Foto resolusi tinggi, jam operasional, biaya masuk (jika ada), dan rute lokasi.

#### 7. Modul Artikel, Berita & Pengumuman

* **Portal Berita Terbaru:** Grid artikel berita kegiatan desa dan program KKN.
* **Detail Berita:** Halaman pembacaan berita lengkap dengan penanda tanggal, penulis, foto cover, serta tombol *Share* media sosial.
* **Kategori & Pencarian:** Filter berdasarkan *Berita Utama, Pengumuman, KKN Corner, dan Pembangunan*.

---

### B. Modul Panel Admin (CMS Full Dynamic)

#### 1. Manajemen Identitas & Profil Utama Desa

* Form edit Nama Desa, Kecamatan, Kabupaten, Logo, Email, No. Telp, Alamat Kantor, dan Sosial Media.
* Form Rich-Text Editor untuk Sejarah Desa.
* Dynamic List Editor untuk Visi & Poin-Poin Misi (Tambah/Edit/Hapus item Misi).

#### 2. Moderasi E-Aspirasi Warga (Inbox Pesan Aspirasi)

* **Tabel Inbox Aspirasi & Pengaduan:** Melihat daftar seluruh pesan pengaduan/aspirasi warga yang masuk (dilengkapi filter kategori, pencarian kata kunci, serta status *Belum Dibaca / Sudah Dibaca*).
* **Detail Pesan & Bukti Foto:** Membaca detail isi pesan pengaduan warga, melihat nama pelapor (atau penanda Anonim), serta mengunduh/melihat lampiran bukti foto jika ada.
* **Manajemen Pesan Inbox:** Admin Desa dapat menandai pesan yang telah dibaca (`isRead`), memfilter pesan berdasarkan kategori/tanggal, serta menghapus pesan yang tidak relevan.

#### 3. Manajemen Berita & Artikel

* Table listing berita dengan pencarian & pagination.
* Editor WYSIWYG (Bold, Italic, List, Insert Image/Link) untuk penulisan konten.
* Pengaturan status publikasi (*Draft / Published*).

#### 4. Manajemen UMKM & Destinasi Wisata

* Form Tambah/Edit UMKM (Nama Usaha, Pemilik, Deskripsi, Harga, No. WhatsApp, Foto).
* Form Tambah/Edit Wisata (Nama Tempat, Deskripsi, Fasilitas, Lokasi, Foto).

#### 5. Manajemen Peta Bangunan & Fasilitas

* Interface penanda titik koordinat (Klik langsung di peta atau input Latitude/Longitude).
* Kategori ikon marker dan foto bangunan.

#### 6. Manajemen Perangkat Desa

* Input foto, nama, jabatan, dan nomor urut posisi struktur desa.

---

## 6. Pemetaan Komponen UI React Bits

Pemanfaatan komponen **React Bits** untuk menciptakan tampilan estetik, modern, dan profesional:

```
+-----------------------------------------------------------------------------------+
|  REACT BITS COMPONENT    | IMPLEMENTASI PADA PROFIL DESA SUKABANJAR               |
+-----------------------------------------------------------------------------------+
|  Text Pressure / Split   | Title Hero "Selamat Datang di Desa Sukabanjar"         |
|  Tilted Card             | Card Katalog UMKM & Card Destinasi Wisata             |
|  Spotlight Card          | Card Profil Perangkat Desa & Preview Pesan Aspirasi    |
|  Count Up                | Angka Statistik Penduduk, Luas Desa, & Total UMKM      |
|  Infinite Scroll / Ticker| Running Text Pengumuman & Logo Instansi/KKN            |
|  Aurora / Waves BG       | Background Section Visi-Misi & Header Form Aspirasi    |
+-----------------------------------------------------------------------------------+

```

---

## 7. Skema Database Relasional (Prisma Schema Design)

Berikut skema database PostgreSQL terbaru menggunakan **Prisma ORM** (Model `Apbdes` dihapus dan digantikan oleh Model `Aspiration`):

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Data Identitas Desa & Visi Misi
model VillageProfile {
  id           String   @id @default(uuid())
  name         String   @default("Sukabanjar")
  subdistrict  String   @default("Sidomulyo")
  district     String   @default("Lampung Selatan")
  province     String   @default("Lampung")
  logoUrl      String?
  heroImageUrl String?
  history      String   @db.Text
  vision       String   @db.Text
  missions     String[] // Array String untuk poin-poin misi
  phone        String?
  email        String?
  address      String?
  updatedAt    DateTime @updatedAt
}

// 2. Modul E-Aspirasi & Pengaduan Warga (Simple Text Message Model)
model Aspiration {
  id          String   @id @default(uuid())
  senderName  String   // Nama pengirim (atau "Anonim" jika isAnonymous = true)
  isAnonymous Boolean  @default(false)
  category    String   // "Fasilitas Publik", "Kebersihan/Lingkungan", "Keamanan", "Saran/Masukan", "Lainnya"
  title       String
  content     String   @db.Text // Isi pesan teks aspirasi/pengaduan (seperti email)
  attachment  String?  // URL Foto Bukti Laporan (Opsional)
  isRead      Boolean  @default(false) // Penanda status dibaca di Inbox Admin Desa
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 3. Data Perangkat Desa (Struktur Organisasi)
model Apparatus {
  id        String   @id @default(uuid())
  name      String
  role      String
  imageUrl  String?
  orderNum  Int      @default(0) // Untuk urutan tampilan hirarki
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 4. Modul Berita & Artikel
model Article {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   String   @db.Text
  category  String   // "Pengumuman", "Kegiatan", "KKN", "Pembangunan"
  imageUrl  String?
  isDraft   Boolean  @default(false)
  author    String   @default("Admin Desa")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 5. Modul UMKM Desa
model Umkm {
  id          String   @id @default(uuid())
  title       String
  ownerName   String
  description String   @db.Text
  price       String
  whatsapp    String
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 6. Modul Wisata & Pemandangan
model Tourism {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  location    String
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 7. Modul Peta Bangunan & Fasilitas Penting
model Facility {
  id        String   @id @default(uuid())
  name      String
  category  String   // "Pemerintahan", "Pendidikan", "Kesehatan", "Ibadah", "Ekonomi"
  latitude  Float
  longitude Float
  address   String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 8. User Admin
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // Hashed password
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
}

```

---

## 8. Glosarium Istilah Technical & Domain

* **E-Aspirasi:** Sistem penyampaian pendapat, usulan, maupun keluhan warga secara elektronik/digital berbasis pesan langsung (seperti email) kepada pihak pengelola desa.
* **PRD (Product Requirement Document):** Dokumen spesifikasi resmi yang memuat seluruh rancangan, fitur, dan aturan teknis dari sebuah sistem software.
* **Zero-Cost Infrastructure:** Strategi pemilihan teknologi yang memanfaatkan layanan tier gratis (*Free Tier*) berkapasitas memadai tanpa memicu biaya berlangganan.
* **Prisma ORM:** Library Node.js yang mempermudah interaksi dan pengelolaan query database SQL menggunakan objek JavaScript/TypeScript.
* **Leaflet.js:** Open-source JavaScript library untuk membangun peta interaktif yang ringan dan ramah perangkat seluler.