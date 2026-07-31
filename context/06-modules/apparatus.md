# MODULE: VILLAGE APPARATUS

## Overview

Modul Perangkat Desa mengelola hirarki struktur organisasi Pemerintahan Desa Sukabanjar (Kepala Desa, Sekretaris Desa, Kepala Dusun, dan Staf). Modul ini memungkinkan publik melihat bagan organisasi desa dan Admin mengelola daftar perangkat desa secara dinamis.

---

## Objectives

- Menampilkan struktur hirarki kepemimpinan dan perangkat desa lengkap dengan foto, nama, dan jabatan.
- Memberikan fleksibilitas bagi Admin Desa untuk menambah, mengedit, menghapus, serta mengatur urutan posisi (`orderNum`) perangkat desa.

---

## Stakeholders

### User Publik
- **Akses:** Read-Only (Melihat foto, nama, dan jabatan perangkat desa pada hirarki).

### Admin Desa
- **Akses:** Read-Write-Delete (Mengelola daftar perangkat desa dan mengunggah foto profil).

---

## Functional Requirements

- **FR-APP-001:** Menampilkan card hirarki perangkat desa terurut berdasarkan `orderNum`.
- **FR-APP-002:** Admin dapat menambah data Perangkat Desa (Nama, Jabatan, Foto, Urutan).
- **FR-APP-003:** Admin dapat mengedit data atau mengganti foto perangkat desa.
- **FR-APP-004:** Admin dapat menghapus data perangkat desa.

---

## Business Rules

- **BR-APP-001:** Urutan tampilan hirarki ditentukan secara eksplisit oleh field `orderNum` (semakin kecil angka `orderNum`, semakin tinggi posisi hirarki).

---

## Workflow

### Tambah Perangkat Desa (Admin)
1. Admin membuka Panel Admin → `Manajemen Perangkat Desa`.
2. Admin mengisi Form: Nama, Jabatan, Urutan Posisi, dan Mengunggah Foto Profil.
3. System mengirim POST request ke `/api/apparatus`.
4. Foto diunggah ke Supabase Storage, URL disimpan di database.
5. Record `Apparatus` berhasil dibuat.

---

## Database Design

### Tables

#### `Apparatus`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| name | String | Required | Nama Perangkat Desa |
| role | String | Required | Jabatan (misal: "Kepala Desa") |
| imageUrl | String? | Nullable | URL Foto Profil |
| orderNum | Int | Default: 0 | Nomor urut hirarki tampilan |
| createdAt | DateTime | Default: now() | Timestamp Pembuatan |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `GET /api/apparatus` — Ambil daftar perangkat desa terurut (Public).
- `POST /api/apparatus` — Tambah perangkat desa (Admin Only).
- `PUT /api/apparatus/:id` — Edit perangkat desa (Admin Only).
- `DELETE /api/apparatus/:id` — Hapus perangkat desa (Admin Only).

---

## API Endpoints

### GET `/api/apparatus`
- **Response (200):** `{ "success": true, "data": [ { "id": "...", "name": "Budi Santoso", "role": "Kepala Desa", "orderNum": 1 } ] }`

### POST `/api/apparatus`
- **Request Body:** `{ "name": "Budi Santoso", "role": "Kepala Desa", "imageUrl": "...", "orderNum": 1 }`
- **Response (201):** `{ "success": true, "data": { ... } }`

---

## Frontend Design

### Pages
- `/profil` (Section Struktur Organisasi).
- `/admin/perangkat` — Halaman CMS manajemen perangkat desa.

### Components
- `ApparatusCard.tsx` — Card tampilan perangkat desa dengan Spotlight Card (React Bits).
- `ApparatusGrid.tsx` — Grid hirarki pengelompokan posisi.
- `ApparatusFormModal.tsx` — Modal form tambah/edit perangkat desa.

---

## UI / UX Requirements

- Penggunaan komponen React Bits **Spotlight Card** pada Card Profil Perangkat Desa.
- Tata letak hirarki yang jelas (Kepala Desa di paling atas, diikuti Sekdes, Kaur/Kasi, dan Kadus).

---

## Validation Rules

- `name`: Required, min 2 karakter.
- `role`: Required.
- `orderNum`: Integer, min 0.

---

## Security Rules

- Operations `POST`, `PUT`, `DELETE` dilindungi Auth Middleware Admin.

---

## Testing Scenarios

### Integration Test
- Get `/api/apparatus` mengembalikan list terurut berdasarkan `orderNum` ASC.
- Delete `/api/apparatus/:id` menghapus record dan gambar terkait di storage.

---

## AI Agent Instructions

### Frontend Agent
- Manfaatkan React Bits Spotlight Card untuk efek visual hover pada foto dan nama perangkat desa.
