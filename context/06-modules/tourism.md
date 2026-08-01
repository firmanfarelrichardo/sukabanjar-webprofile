# MODULE: TOURISM (WISATA & PEMANDANGAN ALAM)

## Overview

Modul Wisata mempublikasikan destinasi tempat wisata, keindahan alam, dan spot potensial di Desa Suka Banjar (sawah terasering, perbukitan, saung kumpul, dan area sungai). Modul ini membantu menarik kunjungan wisatawan serta memperkenalkan potensi pariwisata desa secara visual.

---

## Objectives

- Menyajikan listing destinasi wisata desa dengan galeri foto resolusi tinggi.
- Menyediakan rincian informasi lokasi, jam operasional, tiket masuk, dan rute aksesibilitas.
- Memungkinkan Admin Desa mengelola daftar tempat wisata secara dinamis.

---

## Stakeholders

### User Publik (Wisatawan / Warga)
- **Akses:** Read-Only (Melihat tempat wisata, galeri foto, deskripsi, dan petunjuk lokasi).

### Admin Desa
- **Akses:** Read-Write-Delete (Mengelola tempat wisata, mengunggah foto tempat wisata, dan mengedit informasi rute).

---

## Functional Requirements

- **FR-TRS-001:** Listing destinasi wisata dengan Tilted Card / Spotlight Card.
- **FR-TRS-002:** Detail wisata: Nama Destinasi, Deskripsi Lengkap, Informasi Lokasi/Rute, dan Foto utama/galeri.
- **FR-TRS-003:** Integrasi petunjuk lokasi ke Google Maps.
- **FR-TRS-004:** Form Admin untuk Menambah, Mengedit, dan Menghapus destinasi wisata.

---

## Business Rules

- **BR-TRS-001:** Destinasi wisata ditampilkan publik secara urut dari yang paling baru ditambahkan atau diatur secara khusus.

---

## Workflow

### Kelola Destinasi Wisata (Admin)
1. Admin membuka Panel Admin → `Manajemen Wisata`.
2. Admin mengisi Form: Nama Tempat, Deskripsi, Rute/Lokasi, dan Mengunggah Foto.
3. System mengirim POST request ke `/api/tourism`.
4. Foto diunggah ke Supabase Storage, data disimpan di database PostgreSQL.
5. Destinasi wisata baru tampil di halaman publik `/wisata`.

---

## Database Design

### Tables

#### `Tourism`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| title | String | Required | Nama Tempat Wisata |
| description | String | Text | Deskripsi Lengkap Wisata |
| location | String | Required | Informasi Rute / Alamat Lokasi |
| imageUrl | String? | Nullable | URL Foto Utama Wisata |
| createdAt | DateTime | Default: now() | Timestamp Pembuatan |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `GET /api/tourism` — Ambil seluruh daftar wisata (Public).
- `POST /api/tourism` — Tambah tempat wisata baru (Admin Only).
- `PUT /api/tourism/:id` — Edit data tempat wisata (Admin Only).
- `DELETE /api/tourism/:id` — Hapus tempat wisata (Admin Only).

---

## API Endpoints

### GET `/api/tourism`
- **Response (200):** `{ "success": true, "data": [ { "id": "...", "title": "Bukit Panorama Suka Banjar", "description": "...", "location": "Dusun 2" } ] }`

### POST `/api/tourism`
- **Request Body:** `{ "title": "Bukit Panorama", "description": "...", "location": "Dusun 2", "imageUrl": "..." }`
- **Response (201):** `{ "success": true, "data": { ... } }`

---

## Frontend Design

### Pages
- `/wisata` — Halaman listing & galeri destinasi wisata desa.
- `/admin/wisata` — Halaman CMS manajemen wisata.

### Components
- `TourismCard.tsx` — Card destinasi wisata menggunakan **Tilted Card** (React Bits).
- `TourismDetailModal.tsx` — Modal pembacaan detail deskripsi & rute.
- `TourismFormModal.tsx` — Modal form input admin.

---

## UI / UX Requirements

- Tampilan gambar resolusi tinggi dengan efek lazy loading.
- Mikro-interaksi React Bits Tilted Card pada hover card.
- Tampilan rute lokasi yang jelas dan tombol menuju Google Maps.

---

## Validation Rules

- `title`, `description`, `location`: Required.

---

## Security Rules

- Operations mutasi (`POST`, `PUT`, `DELETE`) terproteksi oleh Admin Auth.

---

## AI Agent Instructions

### Frontend Agent
- Gunakan Next.js `<Image>` component untuk pengoptimalan gambar otomatis dan responsive sizing.
