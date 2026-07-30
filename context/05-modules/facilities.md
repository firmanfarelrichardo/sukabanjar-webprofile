# MODULE: FACILITIES (PETA INTERAKTIF BANGUNAN & FASILITAS)

## Overview

Modul Peta Interaktif Fasilitas Publik menyajikan peta digital Desa Sukabanjar berbasis **Leaflet.js + OpenStreetMap** secara 100% gratis tanpa lisensi API Key (Zero-Cost Stack). Warga dan pengunjung dapat melihat penanda lokasi bangunan penting desa (Balai Desa, Sekolah, Posyandu, Tempat Ibadah, Titik UMKM, dan Wisata) beserta detail popup-nya.

---

## Objectives

- Menampilkan pemetaan geografis bangunan dan fasilitas publik desa di peta interaktif.
- Menyediakan informasi detail lokasi (foto, nama, alamat, dan tombol rute Google Maps).
- Memungkinkan Admin Desa menandai titik koordinat (latitude & longitude) secara dinamis di peta.

---

## Stakeholders

### User Publik
- **Akses:** Read-Only (Melihat peta interaktif, memfilter marker kategori, melihat popup detail lokasi, dan mengklik petunjuk arah).

### Admin Desa
- **Akses:** Read-Write-Delete (Menambah titik lokasi di peta via klik/input koordinat, mengedit data fasilitas, dan menghapus penanda).

---

## Functional Requirements

- **FR-FAC-001:** Peta interaktif Leaflet.js dengan custom pin icon per kategori:
  - *Pemerintahan* (Balai Desa, Kantor Dusun)
  - *Pendidikan* (SD, PAUD, TPQ)
  - *Kesehatan* (Pustu, Posyandu)
  - *Ibadah* (Masjid, Musholla)
  - *Ekonomi & Wisata* (Titik UMKM, Destinasi Wisata)
- **FR-FAC-002:** Popup card saat marker diklik: menampilkan foto bangunan, nama, kategori, alamat, dan tombol "Petunjuk Arah (Google Maps)".
- **FR-FAC-003:** Filter kategori marker pada peta.
- **FR-FAC-004:** Interface Admin untuk menentukan titik lokasi (klik langsung pada peta interactive picker atau input manual Latitude & Longitude).

---

## Business Rules

- **BR-FAC-001:** Koordinat awal (center map) default diarahkan ke area geografis Desa Sukabanjar, Kecamatan Sidomulyo.
- **BR-FAC-002:** Menggunakan tile server OpenStreetMap standar (bebas lisensi & gratis).

---

## Workflow

### Tambah Titik Fasilitas (Admin)
1. Admin membuka Panel Admin → `Manajemen Peta Fasilitas`.
2. Admin mengklik posisi titik lokasi di peta interaktif atau memasukkan nilai Latitude/Longitude.
3. Admin menginput Nama Bangunan, Kategori, Alamat, dan Mengunggah Foto Bangunan.
4. System mengirim POST request ke `/api/facilities`.
5. Database menyimpan record `Facility`.
6. Marker baru otomatis tampil pada peta publik.

---

## Database Design

### Tables

#### `Facility`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| name | String | Required | Nama Bangunan / Fasilitas |
| category | String | Required | Kategori (*Pemerintahan, Pendidikan, Kesehatan, Ibadah, Ekonomi*) |
| latitude | Float | Required | Koordinat Lintang |
| longitude | Float | Required | Koordinat Bujur |
| address | String? | Nullable | Alamat Fasilitas |
| imageUrl | String? | Nullable | URL Foto Bangunan |
| createdAt | DateTime | Default: now() | Timestamp Pembuatan |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `GET /api/facilities` — Ambil seluruh daftar titik fasilitas (Public).
- `POST /api/facilities` — Tambah titik fasilitas baru (Admin Only).
- `PUT /api/facilities/:id` — Edit data titik fasilitas (Admin Only).
- `DELETE /api/facilities/:id` — Hapus titik fasilitas (Admin Only).

---

## API Endpoints

### GET `/api/facilities`
- **Response (200):** `{ "success": true, "data": [ { "id": "...", "name": "Balai Desa Sukabanjar", "category": "Pemerintahan", "latitude": -5.789, "longitude": 105.654 } ] }`

### POST `/api/facilities`
- **Request Body:** `{ "name": "SDN 1 Sukabanjar", "category": "Pendidikan", "latitude": -5.789, "longitude": 105.654 }`
- **Response (201):** `{ "success": true, "data": { ... } }`

---

## Frontend Design

### Pages
- `/peta` — Halaman peta interaktif desa publik.
- `/admin/peta` — Halaman CMS manajemen titik peta.

### Components
- `InteractiveMap.tsx` — Dynamic component Leaflet map (client-side render).
- `FacilityMarkerPopup.tsx` — Custom popup info card.
- `MapLocationPicker.tsx` — Komponen peta picker koordinat untuk form admin.

---

## UI / UX Requirements

- Render Leaflet.js dengan opsi `ssr: false` pada Next.js (Client Component).
- Custom icon marker berwarna untuk membedakan kategori fasilitas.
- Tampilan peta yang responsif di perangkat seluler (touch-friendly zoom & pan).

---

## Validation Rules

- `name`, `category`: Required.
- `latitude`: Required, Float (-90 s/d 90).
- `longitude`: Required, Float (-180 s/d 180).

---

## Security Rules

- API mutasi (`POST`, `PUT`, `DELETE`) wajib terverifikasi sesi Admin.

---

## Testing Scenarios

### Integration Test
- Get `/api/facilities` mengembalikan array berisi koordinat float valid.
- Verifikasi Leaflet CSS & JS terload tanpa error Window object undefined pada SSR.

---

## AI Agent Instructions

### Frontend Agent
- Pastikan Leaflet dipanggil secara dynamic import (`next/dynamic`) dengan `{ ssr: false }` untuk menghindari error SSR Node.js environment.
