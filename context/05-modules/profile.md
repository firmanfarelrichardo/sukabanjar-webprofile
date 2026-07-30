# MODULE: VILLAGE PROFILE

## Overview

Modul Profil Desa mengelola seluruh data identitas utama Desa Sukabanjar, mencakup Sejarah Desa, Visi & Misi, data alamat kantor, kontak, serta data demografi warga desa. Modul ini mendukung pengelolaan 100% Full Dynamic CMS.

---

## Objectives

- Menyajikan narasi sejarah pembentukan desa lengkap dengan dokumentasi foto.
- Menampilkan teks Visi Desa dan poin-poin Misi Desa secara dinamis.
- Menyajikan visualisasi data demografi desa (mata pencaharian, pendidikan, kelompok umur).
- Memungkinkan Admin Desa memperbarui data profil desa kapan saja via CMS.

---

## Stakeholders

### User Publik
- **Akses:** Read-Only (Membaca sejarah, visi-misi, kontak, dan grafik demografi desa).

### Admin Desa
- **Akses:** Read-Write (Memperbarui identitas desa, teks sejarah, dan daftar poin visi-misi).

---

## Functional Requirements

- **FR-PRF-001:** Menampilkan banner hero profil desa dengan foto dan judul dari database.
- **FR-PRF-002:** Menampilkan narasi Sejarah Desa dengan format Rich Text.
- **FR-PRF-003:** Menampilkan Visi Desa dan dynamic list poin-poin Misi Desa.
- **FR-PRF-004:** Menampilkan grafik interaktif statistik Demografi Desa (Chart.js / Recharts).
- **FR-PRF-005:** Admin dapat mengubah nama desa, kecamatan, kabupaten, provinsi, email, no. telp, dan alamat kantor.
- **FR-PRF-006:** Admin dapat mengedit Visi Desa dan menamba/edit/menghapus poin Misi Desa.

---

## Business Rules

- **BR-PRF-001:** Data profil desa tersimpan dalam 1 record utama (Single Record Schema).
- **BR-PRF-002:** Misi disimpan dalam format Array of Strings agar mudah diurutkan dan dikelola di CMS.

---

## Workflow

### Update Profil Desa (Admin)
1. Admin membuka Panel Admin → `Manajemen Profil Desa`.
2. Admin mengubah data pada form identitas / Rich Text editor sejarah / list editor visi-misi.
3. Admin mengklik "Simpan Perubahan".
4. System mengirim request `PUT /api/village-profile`.
5. Database memperbarui record `VillageProfile`.
6. Halaman publik otomatis menampilkan data terbaru.

---

## Database Design

### Tables

#### `VillageProfile`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| name | String | Default: "Sukabanjar" | Nama Desa |
| subdistrict | String | Default: "Sidomulyo" | Kecamatan |
| district | String | Default: "Lampung Selatan" | Kabupaten |
| province | String | Default: "Lampung" | Provinsi |
| logoUrl | String? | Nullable | URL Logo Desa |
| heroImageUrl | String? | Nullable | URL Banner Utama |
| history | String | Text | Narasi Sejarah Desa |
| vision | String | Text | Teks Visi Utama |
| missions | String[] | Array of String | List Poin Misi Desa |
| phone | String? | Nullable | Telepon Balai Desa |
| email | String? | Nullable | Email Resmi Desa |
| address | String? | Nullable | Alamat Balai Desa |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `GET /api/village-profile` — Ambil data profil desa (Public).
- `PUT /api/village-profile` — Perbarui data profil desa (Admin Only).

---

## API Endpoints

### GET `/api/village-profile`
- **Response (200):** `{ "success": true, "data": { "name": "Sukabanjar", "history": "...", "vision": "...", "missions": ["..."] } }`

### PUT `/api/village-profile`
- **Request Body:** `{ "name": "Sukabanjar", "vision": "...", "missions": ["Misi 1", "Misi 2"] }`
- **Response (200):** `{ "success": true, "data": { ... } }`

---

## Frontend Design

### Pages
- `/profil` — Halaman profil desa publik.
- `/admin/profil` — Halaman CMS manajemen profil desa.

### Components
- `HistorySection.tsx` — Tampilan narasi sejarah & foto legendaris.
- `VisionMissionSection.tsx` — Display Visi & Misi (dengan animasi Aurora BG / React Bits).
- `DemographicsChart.tsx` — Grafik demografi interaktif.
- `VisionMissionEditor.tsx` — Dynamic list input untuk Admin.

---

## UI / UX Requirements

- Penggunaan komponen React Bits **Aurora / Waves BG** pada section Visi-Misi.
- Grafik demografi responsif (dapat disesuaikan layar mobile & desktop).
- Editor Visi & Misi yang intuitif di Panel Admin (dapat drag/reorder/hapus item).

---

## Validation Rules

- `name`, `subdistrict`, `district`, `province`: Required.
- `history`, `vision`: Required, tidak boleh kosong.
- `missions`: Array tidak boleh kosong (minimal 1 poin misi).

---

## Security Rules

- Endpoint `PUT /api/village-profile` dilindungi middleware admin.
- Sanitasi Rich Text input sejarah untuk mencegah XSS injection.

---

## Testing Scenarios

### Unit Test
- Validasi array missions pada request body update.
- Sanitasi HTML output Rich Text sejarah.

### Integration Test
- Update profil desa via admin → GET publik menampilkan data terupdate.

---

## Dependencies

- **Internal Modules:** Admin Dashboard.
- **External Services:** Supabase Storage (untuk upload logo & hero image).

---

## AI Agent Instructions

### Backend Agent
- Buat logicupsert agar jika data record `VillageProfile` belum ada di DB, sistem otomatis membuat 1 record default.

### Frontend Agent
- Gunakan Recharts / Chart.js untuk menampilkan grafik demografi secara interaktif.
