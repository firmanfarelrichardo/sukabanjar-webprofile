# MODULE: NEW FEATURES & IMPROVEMENTS (FITUR BARU & PERBAIKAN)

## Overview

Modul Fitur Baru & Perbaikan (*New Features & Improvements*) merangkum spesifikasi teknis, arsitektur, dan panduan implementasi untuk 4 pembaruan penting pada portal Website Profil Desa Suka Banjar:
1. **Halaman Khusus & Biodata Detail Aparatur Desa** (Halaman profil publik per aparatur dengan data lengkap: TTL, jenis kelamin, alamat, deskripsi).
2. **Pembaruan Titik Lokasi Google Maps Footer** (Pembaruan koordinat embed resmi Balai/Kantor Desa Suka Banjar).
3. **Presisi Database Persistence Edit Manual SIPDeskel** (Penyimpanan akurat seluruh data demografi yang diedit manual di CMS ke database PostgreSQL).
4. **Transformasi Layar Pengantar (Intro Splash Screen)** (Perubahan tampilan dari *Presented by KKN UNILA 2026* menjadi *PEMERINTAH DESA SUKA BANJAR* dengan Logo Resmi Daerah).

---

## Objectives

- Menyajikan transparansi dan informasi publik yang komprehensif mengenai aparatur pemerintahan desa melalui halaman profil individual berdesain modern dan elegan.
- Memastikan akurasi navigasi geografis bagi masyarakat dan tamu desa dengan menyematkan titik lokasi kantor desa resmi pada footer website.
- Menjamin integritas, persistensi, dan konsistensi data demografi penduduk yang diedit manual oleh administrator di Panel CMS ke database Supabase PostgreSQL.
- Mengukuhkan identitas kelembagaan resmi Desa Suka Banjar pada pengalaman pembuka (*first impression*) pengunjung website melalui splash overlay baru.

---

## Stakeholders

### User Publik (Masyarakat & Pengunjung)
- **Akses:**
  - Melihat daftar dan mengklik card aparatur desa untuk masuk ke halaman detail biodata lengkap (`/aparatur/[id]`).
  - Melihat peta interaktif kantor desa resmi pada footer website dan membuka rute navigasi Google Maps.
  - Menikmati animasi pembuka (*splash screen*) resmi beridentitas Pemerintah Desa Suka Banjar.

### Administrator Desa (Pemerintah Desa)
- **Akses:**
  - Menambah, memperbarui, dan mengelola biodata lengkap aparatur desa (Tempat Tanggal Lahir, Jenis Kelamin, Alamat, Deskripsi Singkat) di Admin CMS.
  - Mengedit data demografi SIPDeskel (Usia, Pendidikan, Pekerjaan, Dusun) secara manual dengan jaminan 100% tersimpan akurat di database.
  - Melakukan sinkronisasi data SIPDeskel manual/otomatis tanpa menghilangkan data kustom yang valid.

---

## Functional Requirements

### 1. Biodata & Halaman Detail Aparatur Desa
- **FR-NFI-001:** Setiap card aparatur desa di Beranda (`VillageApparatusSection`) dan Profil (`ApparatusSection`) dapat diklik untuk menavigasi ke halaman detail `/aparatur/[id]`.
- **FR-NFI-002:** Halaman detail aparatur menyajikan informasi lengkap: Foto Profil, Nama Lengkap beserta Gelar, Jabatan Struktural, Tempat Tanggal Lahir (TTL), Jenis Kelamin, Alamat Domisili, dan Deskripsi Singkat/Motto/Profil Pengabdian.
- **FR-NFI-003:** Panel Admin CMS (`/admin` tab Aparatur) menyediakan form tambah & edit dengan kolom input biodata lengkap (TTL, Jenis Kelamin, Alamat, Deskripsi Singkat).
- **FR-NFI-004:** Mendukung breadcrumb navigasi dan tombol kembali (*Back to Hierarchy/Profil*) dengan transisi animasi halus (*Framer Motion*).

### 2. Pembaruan Google Maps Footer
- **FR-NFI-005:** Mengganti iframe lama pada `Footer.tsx` dengan URL embed Google Maps resmi Balai/Kantor Desa Suka Banjar:
  ```text
  https://www.google.com/maps/embed?pb=!4v1788167680397!6m8!1m7!1szwMQlYZtp2pHtM9tdkV1rg!2m2!1d-5.591413578913071!2d105.4996216327626!3f42.169224!4f0!5f0.7820865974627469
  ```
- **FR-NFI-006:** Menampilkan tampilan kartu peta footer yang responsif, rounded, dengan tombol aksi cepat *"Buka di Google Maps"* atau *"Petunjuk Arah"*.

### 3. Presisi Database Persistence Edit Manual SIPDeskel
- **FR-NFI-007:** Operasi simpan pada form Edit Manual SIPDeskel (Dusun, Usia, Pendidikan, Pekerjaan) di `AdminSipdeskelTab.tsx` harus mengirim data valid ke `PUT /api/statistik` dan melakukan update/upsert ke tabel PostgreSQL yang bersangkutan via Prisma.
- **FR-NFI-008:** Parsing angka (`jumlah`, `lakiLaki`, `perempuan`, `jumlahKK`, `persentase`) wajib divalidasi sebelum query ke database untuk menghindari NaN atau error tipe data.
- **FR-NFI-009:** Sistem memperbarui timestamp `updatedAt` pada tabel demografi dan mencatat log aktivitas pada `SyncLog` jika diperlukan.
- **FR-NFI-010:** State data di antarmuka Admin CMS langsung me-refresh data terbaru dari database setelah operasi edit manual berhasil, disertai feedback toast/alert status sukses.

### 4. Transformasi Intro Splash Screen Pemerintah Desa
- **FR-NFI-011:** Mengubah teks judul utama dari *"Presented by KKN UNILA 2026"* menjadi *"PEMERINTAH DESA SUKA BANJAR"*.
- **FR-NFI-012:** Mengganti logo Universitas Lampung menjadi **Logo Resmi Daerah Kabupaten Lampung Selatan / Desa Suka Banjar** (`/images/logos/logo_lampung.png` atau aset logo resmi terkait).
- **FR-NFI-013:** Mengubah teks subtitle typewriter dari *"UNIVERSITAS LAMPUNG"* menjadi *"KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN."*.
- **FR-NFI-014:** Mempertahankan efek animasi GSAP entrance yang smooth (scale, blur-to-clear, rise effect) dan auto-fadeout dalam rentang 3 - 3.5 detik.

---

## Business Rules

- **BR-NFI-001:** Setiap data aparatur desa minimal memiliki Nama Lengkap dan Jabatan. Kolom TTL, Jenis Kelamin, Alamat, dan Deskripsi bersifat opsional namun sangat direkomendasikan untuk kelengkapan profil.
- **BR-NFI-002:** Navigasi ke halaman detail aparatur menggunakan ID aparatur (`/aparatur/[id]`) atau slug yang unik. Jika ID tidak ditemukan, sistem menampilkan fallback 404 yang ramah pengguna.
- **BR-NFI-003:** Edit data manual SIPDeskel oleh admin memiliki prioritas data tinggi dan tidak boleh terhapus secara tidak sengaja oleh proses scraping yang gagal (*graceful fallback*).
- **BR-NFI-004:** Intro Splash Screen hanya berjalan pada sesi awal buka halaman publik untuk menjaga kenyamanan pengunjung, dengan transisi *pointer-events-none* saat fade-out.

---

## Workflow

### 1. Alur Akses & Kelola Biodata Aparatur Desa
```text
[Pengunjung Web]
       │
       ▼
Klik Card Aparatur pada Bagan Organisasi (Home / Profil)
       │
       ▼
Navigasi ke /aparatur/[id]
       │
       ▼
Server memuat detail record dari database Prisma `Apparatus`
       │
       ▼
Tampil Halaman Profil Detail: Foto, Nama & Gelar, Jabatan, TTL, Gender, Alamat, Deskripsi Singkat

------------------------------------------------------------------------------------------------

[Admin Desa CMS]
       │
       ▼
Buka Tab Aparatur di Panel Admin → Tambah / Edit Aparatur
       │
       ▼
Input/Perbarui Field: Nama, Jabatan, Foto, Urutan, TTL, Jenis Kelamin, Alamat, Deskripsi
       │
       ▼
Klik "Simpan Data" → Request POST/PUT ke /api/apparatus
       │
       ▼
Prisma ORM menyimpan ke PostgreSQL Supabase → Feedback Berhasil & List Terupdate
```

### 2. Alur Edit Manual Data SIPDeskel ke Database
```text
[Admin Desa CMS]
       │
       ▼
Buka Menu "Sinkronisasi SIPDeskel" → Pilih Sub-tab (Dusun / Usia / Pendidikan / Pekerjaan)
       │
       ▼
Klik Tombol Edit (Icon Pensil) pada baris data
       │
       ▼
Modal Form Edit Manual terbuka → Ubah angka Laki-laki, Perempuan, Total, Persentase, dll.
       │
       ▼
Klik "Simpan Perubahan"
       │
       ▼
Frontend mengirim PUT ke `/api/statistik` dengan payload `{ type, id, ...fields }`
       │
       ▼
Backend memvalidasi tipe data integer/float → Prisma `update()` / `upsert()` ke tabel terkait
       │
       ▼
Database menyimpan perubahan → API merespon `{ success: true, data: updatedItem }`
       │
       ▼
Admin Tab menampilkan notifikasi sukses & memanggil `fetchData()` untuk refresh instan
```

### 3. Alur Intro Splash Screen Pemerintah Desa
```text
Pengunjung membuka website (URL Utama /)
       │
       ▼
`IntroSplashOverlay` me-mount overlay full-screen gelap
       │
       ▼
GSAP Entrance: Logo Resmi Lampung Selatan / Desa Suka Banjar muncul dengan efek rise & scale
       │
       ▼
MaskedHeading menampilkan "PEMERINTAH DESA SUKA BANJAR" dengan efek shimmer/reveal
       │
       ▼
Typewriter Effect mengetik "KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN."
       │
       ▼
Durasi 3.2 detik selesai → Fade-out halus & overlay di-unmount dari DOM
```

---

## Database Design

### Penyesuaian Tabel `Apparatus` (Prisma Schema)

```prisma
model Apparatus {
  id          String   @id @default(uuid())
  name        String
  role        String
  imageUrl    String?
  orderNum    Int      @default(0)
  
  // Field Baru: Biodata Lengkap Aparatur
  birthPlace  String?  // Tempat Lahir (misal: "Lampung Selatan")
  birthDate   String?  // Tanggal Lahir (misal: "15 Agustus 1985" atau format YYYY-MM-DD)
  gender      String?  // "Laki-Laki" | "Perempuan"
  address     String?  @db.Text // Alamat Lengkap Domisili
  description String?  @db.Text // Deskripsi Singkat
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Tabel Demografi SIPDeskel (Target Edit Manual Terverifikasi)

```prisma
model DemografiDusun {
  id          String    @id @default(cuid())
  namaDusun   String
  ketua       String?   // Nama Kepala Dusun
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  jumlahKK    Int?
  syncedAt    DateTime?
  updatedAt   DateTime  @updatedAt
}

model DemografiUsia {
  id          String    @id @default(cuid())
  kategori    String    // Rentang Umur (misal: "0-4 Tahun", "5-9 Tahun")
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  persentase  Float?
  syncedAt    DateTime?
  updatedAt   DateTime  @updatedAt
}

model DemografiPendidikan {
  id          String    @id @default(cuid())
  kategori    String    // Jenjang (misal: "SD", "SMP", "SMA", "S1")
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  persentase  Float?
  syncedAt    DateTime?
  updatedAt   DateTime  @updatedAt
}

model DemografiPekerjaan {
  id          String    @id @default(cuid())
  kategori    String    // Profesi (misal: "Petani", "Wiraswasta", "PNS")
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  persentase  Float?
  syncedAt    DateTime?
  updatedAt   DateTime  @updatedAt
}
```

---

## Backend Design

### Endpoints Matrix

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/apparatus` | GET | Public | Mengambil seluruh daftar aparatur terurut `orderNum` ASC |
| `/api/apparatus/[id]` | GET | Public | Mengambil detail biodata 1 aparatur berdasarkan ID |
| `/api/apparatus` | POST | Admin | Menambah aparatur baru beserta field biodata lengkap |
| `/api/apparatus` (atau `/[id]`) | PUT | Admin | Memperbarui data aparatur dan biodata lengkap |
| `/api/apparatus` (atau `/[id]`) | DELETE | Admin | Menghapus record aparatur |
| `/api/statistik` | GET | Public | Mengambil seluruh dataset statistik & status sinkronisasi |
| `/api/statistik` | POST | Admin | Trigger sinkronisasi otomatis dari scraping SIPDeskel |
| `/api/statistik` | PUT | Admin | Menyimpan hasil edit manual data statistik ke database |

---

## API Endpoints Specification

### 1. `GET /api/apparatus/[id]`
- **Deskripsi:** Ambil detail biodata lengkap aparatur.
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "c7a8b9d0-1234-5678-90ab-cdef12345678",
    "name": "Budi Santoso, S.Sos.",
    "role": "Kepala Desa",
    "imageUrl": "https://xyz.supabase.co/storage/v1/object/public/uploads/kades.jpg",
    "orderNum": 1,
    "birthPlace": "Suka Banjar",
    "birthDate": "1980-05-12",
    "gender": "Laki-Laki",
    "address": "Dusun I RT 02 RW 01, Desa Suka Banjar",
    "description": "Berkomitmen mewujudkan tata kelola pemerintahan desa yang transparan, mandiri, dan berbasis digital untuk kesejahteraan seluruh warga.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-08-28T00:00:00.000Z"
  }
}
```

### 2. `POST /api/apparatus` & `PUT /api/apparatus`
- **Request Body:**
```json
{
  "id": "c7a8b9d0-1234-5678-90ab-cdef12345678",
  "name": "Budi Santoso, S.Sos.",
  "role": "Kepala Desa",
  "imageUrl": "https://xyz.supabase.co/...",
  "orderNum": 1,
  "birthPlace": "Suka Banjar",
  "birthDate": "1980-05-12",
  "gender": "Laki-Laki",
  "address": "Dusun I RT 02 RW 01, Desa Suka Banjar",
  "description": "Berkomitmen mewujudkan tata kelola desa yang transparan dan mandiri."
}
```

### 3. `PUT /api/statistik` (Edit Manual Persistence)
- **Request Body (Contoh Edit Dusun):**
```json
{
  "type": "dusun",
  "id": "dus-1",
  "namaDusun": "Dusun I",
  "ketua": "Ahmad Fauzi",
  "jumlah": 450,
  "lakiLaki": 230,
  "perempuan": 220,
  "jumlahKK": 125
}
```
- **Request Body (Contoh Edit Usia / Pendidikan / Pekerjaan):**
```json
{
  "type": "usia",
  "id": "age-1",
  "kategori": "0-4 Tahun",
  "jumlah": 120,
  "lakiLaki": 65,
  "perempuan": 55,
  "persentase": 5.4
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Data usia berhasil diperbarui di database",
  "data": { ... }
}
```

---

## Frontend Design

### Halaman & Komponen Baru / Dimodifikasi

| File / Komponen | Tipe | Perubahan & Deskripsi |
|---|---|---|
| `src/app/aparatur/[id]/page.tsx` | Page (App Router) | **[NEW]** Halaman publik detail profil aparatur desa dengan desain premium glassmorphic, biodata cards, quote/deskripsi, dan tombol navigasi kembali. |
| `src/components/sections/home/VillageApparatusSection.tsx` | Component | **[MODIFY]** Menambahkan action clickable/link pada card aparatur menuju `/aparatur/${item.id}` dan badge hover interaktif. |
| `src/components/sections/profil/ApparatusSection.tsx` | Component | **[MODIFY]** Menambahkan tautan klik ke halaman detail aparatur `/aparatur/${item.id}` pada struktur organisasi. |
| `src/components/admin/AddOfficialModal.tsx` | Component | **[MODIFY]** Memperluas form input modal dengan kolom Tempat Lahir, Tanggal Lahir, Jenis Kelamin (Dropdown), Alamat (Textarea), dan Deskripsi Singkat. |
| `src/components/layout/Footer.tsx` | Component | **[MODIFY]** Mengganti iframe Google Maps dengan embed resmi Kantor Desa Suka Banjar serta tombol aksi langsung. |
| `src/components/admin/AdminSipdeskelTab.tsx` | Component | **[MODIFY]** Memastikan form edit manual mengirim semua parameter angka ter-parse dengan benar dan me-refresh state tabel saat sukses. |
| `src/components/layout/IntroSplashOverlay.tsx` | Component | **[MODIFY]** Mengganti logo & teks intro menjadi *"PEMERINTAH DESA SUKA BANJAR"* dan *"KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN."*. |

---

## UI / UX Requirements

### 1. Halaman Detail Aparatur Desa (`/aparatur/[id]`)
- Tampilan Hero Profile dengan efek avatar glow, badge jabatan struktural bercahaya (*emerald/cyan accents*).
- Grid Card Informasi Biodata:
  - **Tempat, Tanggal Lahir:** Ikon Kalender & Pin Lokasi.
  - **Jenis Kelamin:** Ikon User / Gender.
  - **Alamat Domisili:** Ikon Rumah / Map Marker.
  - **Deskripsi & Pengabdian:** Card Glassmorphic dengan tanda kutip besar / quote layout.
- Tombol *"Kembali ke Struktur Organisasi"* dengan animasi hover micro-interaction.

### 2. Google Maps Footer
- Frame rasio responsif (100% width pada mobile, 450px aspect ratio pada desktop).
- Border halus dengan `border-white/10` dan rounded corners (`rounded-2xl`).
- Overlay badge kecil di atas peta bertuliskan *"Lokasi Resmi Balai Desa Suka Banjar"*.

### 3. Intro Splash Overlay
- **Background:** Deep Navy (`#020617`) dengan ambient blur radial gradient (Cyan `#0086C9`/Gold `#EAB308`).
- **Logo:** Logo Resmi Kabupaten Lampung Selatan (`/images/logos/logo_lampung.png`) dengan drop-shadow menyala.
- **Typography:**
  - Heading: *MaskedHeading* "PEMERINTAH DESA SUKA BANJAR" (Bold Serif / Modern Sans Display).
  - Subtitle: Typewriter Mono Uppercase "KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN.".

---

## Validation & Business Logic

- **Validasi Aparatur:**
  - `name` & `role`: Wajib diisi (string min. 2 karakter).
  - `gender`: Pilihan terbatas (`Laki-Laki` | `Perempuan` | string).
  - `orderNum`: Integer >= 0.
- **Validasi SIPDeskel Manual Edit:**
  - `jumlah`: Integer >= 0 (otomatis sinkron jika `lakiLaki + perempuan` diisi).
  - `lakiLaki`, `perempuan`: Integer >= 0.
  - `persentase`: Float antara 0 hingga 100.
  - Tipe entitas (`dusun`, `usia`, `pendidikan`, `pekerjaan`) wajib valid.

---

## Security Rules

- **Proteksi Admin:** Seluruh mutasi data (`POST`, `PUT`, `DELETE` untuk Aparatur dan SIPDeskel) dilindungi autentikasi sesi Admin.
- **Sanitasi Input:** Sanitasi input deskripsi dan alamat untuk mencegah script injection (XSS).
- **Public Safe:** Endpoint publik (`GET /api/apparatus/[id]`, `GET /api/statistik`) hanya mengembalikan data publik yang telah terverifikasi.

---

## Testing Scenarios

### 1. Aparatur Biodata & Detail Page
- **Test 1:** Akses `/aparatur/[id]` dengan ID valid -> Halaman memuat nama, foto, TTL, jenis kelamin, alamat, dan deskripsi dengan format rapi.
- **Test 2:** Akses `/aparatur/random-invalid-id` -> Menampilkan tampilan state 404 / "Aparatur tidak ditemukan" dengan tombol kembali.
- **Test 3:** Admin menambahkan data aparatur lengkap -> Record tersimpan di database dan muncul di halaman detail.

### 2. Google Maps Footer
- **Test 1:** Periksa tag `<iframe>` di Footer -> Memastikan src URL mengarah ke Kantor Desa Suka Banjar (`pb=!1m18!1m12...KANTOR%20DESA%20SUKABANJAR...`).
- **Test 2:** Pastikan peta dapat di-zoom dan tombol interaksi berfungsi di mobile & desktop.

### 3. SIPDeskel Manual Edit Persistence
- **Test 1:** Edit jumlah penduduk salah satu dusun via modal Admin SIPDeskel -> Klik simpan -> Reload halaman -> Data yang ditampilkan tetap data baru hasil editan manual.
- **Test 2:** Verifikasi langsung di database Supabase/Prisma bahwa record `DemografiDusun`, `DemografiUsia`, `DemografiPendidikan`, atau `DemografiPekerjaan` telah ter-update dengan nilai yang sesuai.

### 4. Intro Splash Screen
- **Test 1:** Buka halaman beranda (`/`) -> Intro splash screen muncul menampilkan Logo Lampung Selatan, teks "PEMERINTAH DESA SUKA BANJAR", dan subtitle "KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN.".
- **Test 2:** Pastikan animasi fade-out berjalan mulus dan tidak menghalangi interaksi user setelah transisi selesai.

---

## AI Agent Instructions

### Frontend Agent
1. Buat halaman baru `src/app/aparatur/[id]/page.tsx` dengan komponen Server Component + UI Client terpisah untuk visualisasi biodata aparatur yang memukau.
2. Perbarui `src/components/sections/home/VillageApparatusSection.tsx` dan `ApparatusSection.tsx` agar setiap card memiliki link pembungkus `Link href={'/aparatur/' + item.id}`.
3. Sesuaikan `src/components/layout/IntroSplashOverlay.tsx` dengan logo daerah dan teks baru sesuai spesifikasi visual referensi.
4. Perbarui iframe embed pada `src/components/layout/Footer.tsx`.
5. Lengkapi form modal `src/components/admin/AddOfficialModal.tsx` dengan field biodata lengkap.

### Backend & Database Agent
1. Perbarui `prisma/schema.prisma` model `Apparatus` dengan menambahkan field `birthPlace`, `birthDate`, `gender`, `address`, dan `description`.
2. Jalankan `npx prisma db push` atau `prisma generate` untuk memperbarui Prisma Client.
3. Buat/perbarui handler route `src/app/api/apparatus/[id]/route.ts` dan `src/app/api/apparatus/route.ts` untuk menangani CRUD biodata lengkap.
4. Periksa dan optimalkan `PUT /api/statistik` agar menangani query update dengan validasi tipe data yang kokoh serta fallback aman.
