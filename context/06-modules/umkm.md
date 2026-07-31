# MODULE: UMKM (KATALOG PRODUK LOKAL & POTENSI DESA)

## Overview

Modul UMKM mempublikasikan potensi ekonomi dan produk unggulan warga Desa Sukabanjar (kuliner, kerajinan tangan, olahan hasil tani). Modul ini terintegrasi secara langsung dengan fitur **Direct WhatsApp** untuk mempermudah pengunjung memesan produk atau menghubungi pemilik UMKM secara langsung.

---

## Objectives

- Mempromosikan produk-produk UMKM lokal desa secara digital.
- Menghubungkan pembeli langsung ke penjual via pesan WhatsApp otomatis terformat.
- Memungkinkan Admin Desa menambahkan dan memperbarui katalog UMKM secara mandiri.

---

## Stakeholders

### User Publik (Pembeli / Wisatawan)
- **Akses:** Read & Action (Melihat katalog produk UMKM dan mengklik tombol "Beli / Hubungi Penjual" via WhatsApp).

### Admin Desa
- **Akses:** Read-Write-Delete (Mengelola produk UMKM, harga, foto, dan nomor WhatsApp pemilik usaha).

---

## Functional Requirements

- **FR-UMK-001:** Listing katalog produk UMKM dalam format grid card dinamis.
- **FR-UMK-002:** Detail card produk: Foto produk, Nama Produk, Nama Pemilik Usaha, Deskripsi, dan Harga.
- **FR-UMK-003:** Tombol *"Beli / Hubungi Penjual"* yang membuka aplikasi/web WhatsApp langsung ke nomor pemilik UMKM dengan format pesan default:
  `"Halo, saya tertarik dengan produk [Nama Produk] di Website Desa Sukabanjar. Apakah masih tersedia?"`
- **FR-UMK-004:** Form Admin untuk Menambah, Mengedit, dan Menghapus data UMKM.

---

## Business Rules

- **BR-UMK-001:** Nomor WhatsApp pemilik disanitasi ke format internasional (misal: `0812...` menjadi `62812...`).
- **BR-UMK-002:** Tidak ada sistem transaksi pembayaran di dalam website (Pure Showcase & Direct Communication).

---

## Workflow

### Pembelian Produk (Publik)
1. Pengunjung melihat Katalog UMKM di halaman `/umkm`.
2. Pengunjung memilih produk yang diinginkan.
3. Pengunjung mengklik tombol *"Beli / Hubungi Penjual"*.
4. System mengarahkan ke URL WhatsApp: `https://wa.me/628xxxxxx?text=Halo%20saya%20tertarik...`.
5. Percakapan berlanjut di WhatsApp.

---

## Database Design

### Tables

#### `Umkm`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| title | String | Required | Nama Usaha / Produk |
| ownerName | String | Required | Nama Pemilik UMKM |
| description | String | Text | Deskripsi Produk / Usaha |
| price | String | Required | Teks Harga (misal: "Rp 15.000 / porsi") |
| whatsapp | String | Required | Nomor WhatsApp (format terformat/bebas) |
| imageUrl | String? | Nullable | URL Foto Produk |
| createdAt | DateTime | Default: now() | Timestamp Pembuatan |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `GET /api/umkm` — Ambil seluruh daftar UMKM (Public).
- `POST /api/umkm` — Tambah UMKM baru (Admin Only).
- `PUT /api/umkm/:id` — Edit data UMKM (Admin Only).
- `DELETE /api/umkm/:id` — Hapus data UMKM (Admin Only).

---

## API Endpoints

### GET `/api/umkm`
- **Response (200):** `{ "success": true, "data": [ { "id": "...", "title": "Keripik Pisang Bu Siti", "price": "Rp 15.000", "whatsapp": "628123456789" } ] }`

### POST `/api/umkm`
- **Request Body:** `{ "title": "Keripik Pisang", "ownerName": "Siti", "description": "...", "price": "Rp 15.000", "whatsapp": "08123456789" }`
- **Response (201):** `{ "success": true, "data": { ... } }`

---

## Frontend Design

### Pages
- `/umkm` — Halaman katalog produk UMKM desa.
- `/admin/umkm` — Halaman CMS manajemen UMKM.

### Components
- `UmkmCard.tsx` — Card tampilan produk menggunakan **Tilted Card** (React Bits).
- `UmkmGrid.tsx` — Grid katalog produk.
- `UmkmFormModal.tsx` — Modal input data UMKM untuk admin.

---

## UI / UX Requirements

- Penggunaan komponen React Bits **Tilted Card** pada Card Katalog UMKM untuk efek 3D tilt visual menarik saat hover.
- Responsive grid 1 kolom (mobile), 2-3 kolom (desktop).
- Formatting harga yang rapi dan penanda nomor WhatsApp terverifikasi.

---

## Validation Rules

- `title`, `ownerName`, `price`, `whatsapp`: Required.
- `whatsapp`: Harus berupa string angka yang dapat diubah ke format internasional `62...`.

---

## Security Rules

- API mutasi (`POST`, `PUT`, `DELETE`) dilindungi Auth Admin.

---

## AI Agent Instructions

### Frontend Agent
- Implementasikan helper generator URL WhatsApp yang otomatis memformat `08...` menjadi `628...` dan mengencode teks pesan URL.
- Gunakan React Bits Tilted Card untuk menghadirkan visual wow-factor pada katalog produk.
