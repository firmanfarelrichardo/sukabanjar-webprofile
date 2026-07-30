# MODULE: ARTICLES (PORTAL BERITA, ARTIKEL & PENGUMUMAN)

## Overview

Modul Portal Berita & Artikel berfungsi sebagai kearsipan digital dan sarana publikasi informasi desa. Modul ini menyajikan berita kegiatan pemerintahan desa, program kerja KKN, pengumuman publik, serta artikel pembangunan.

---

## Objectives

- Menyajikan berita terbaru dan kearsipan kegiatan desa secara teratur.
- Menyediakan pencarian kata kunci dan filter kategori artikel.
- Memungkinkan Admin Desa menulis berita menggunakan Editor WYSIWYG serta mengelola status publikasi (*Draft / Published*).

---

## Stakeholders

### User Publik (Masyarakat / Pembaca)
- **Akses:** Read-Only (Membaca artikel published, mencari berita, memfilter kategori, dan membagikan ke media sosial).

### Admin Desa
- **Akses:** Read-Write-Delete (Menulis berita baru, mengedit artikel, mengunggah foto cover, mengatur status Draft/Published, dan menghapus artikel).

---

## Functional Requirements

- **FR-ART-001:** Grid portal berita publik dengan pencarian judul & filter kategori (*Berita Utama, Pengumuman, KKN Corner, Pembangunan*).
- **FR-ART-002:** Halaman detail pembacaan artikel berbasis URL slug unik (`/berita/[slug]`).
- **FR-ART-003:** Fitur tombol Share ke media sosial (WhatsApp, Facebook, Twitter/X, Copy Link).
- **FR-ART-004:** Editor WYSIWYG di Panel Admin untuk penulisan konten (Bold, Italic, List, Insert Image/Link).
- **FR-ART-005:** Pengaturan status publikasi (*Draft / Published*).

---

## Business Rules

- **BR-ART-001:** Halaman publik **hanya** menampilkan artikel yang berstatus `isDraft: false` (Published).
- **BR-ART-002:** Slug artikel bersifat unik (`@unique`) dan digenerate otomatis dari judul artikel.

---

## Workflow

### Publikasi Artikel (Admin)
1. Admin membuka Panel Admin → `Manajemen Berita & Artikel`.
2. Admin mengklik tombol *"Tambah Berita Baru"*.
3. Admin menginput Judul, Kategori, Mengunggah Foto Cover, dan Menulis Konten di Editor WYSIWYG.
4. Admin memilih status: *Published* (`isDraft: false`).
5. System mengirim POST request ke `/api/articles`.
6. Backend membuat slug unik dan menyimpan artikel.
7. Artikel langsung tampil di portal berita publik `/berita`.

---

## Database Design

### Tables

#### `Article`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| title | String | Required | Judul Berita / Artikel |
| slug | String | Unique | URL Slug Ramah SEO |
| content | String | Text | Isi Konten Artikel (Format HTML WYSIWYG) |
| category | String | Required | Kategori (*Pengumuman, Kegiatan, KKN, Pembangunan*) |
| imageUrl | String? | Nullable | URL Foto Cover Artikel |
| isDraft | Boolean | Default: false | Status Publikasi (true=Draft, false=Published) |
| author | String | Default: "Admin Desa" | Nama Penulis Artikel |
| createdAt | DateTime | Default: now() | Timestamp Pembuatan / Publikasi |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `GET /api/articles` — Ambil daftar artikel published (Public) atau semua artikel (Admin).
- `GET /api/articles/:slug` — Ambil detail artikel berdasarkan slug (Public).
- `POST /api/articles` — Buat artikel baru (Admin Only).
- `PUT /api/articles/:id` — Edit artikel (Admin Only).
- `DELETE /api/articles/:id` — Hapus artikel (Admin Only).

---

## API Endpoints

### GET `/api/articles`
- **Query Params:** `category`, `search`, `isDraft`, `page`, `limit`
- **Response (200):** `{ "success": true, "data": { "articles": [...], "total": 15 } }`

### GET `/api/articles/:slug`
- **Response (200):** `{ "success": true, "data": { "id": "...", "title": "...", "content": "..." } }`

---

## Frontend Design

### Pages
- `/berita` — Halaman portal berita publik.
- `/berita/[slug]` — Halaman detail pembacaan artikel.
- `/admin/berita` — Halaman CMS manajemen artikel & editor WYSIWYG.

### Components
- `ArticleCard.tsx` — Card tampilan artikel berita.
- `ArticleSearchFilter.tsx` — Bar pencarian & filter kategori.
- `WysiwygEditor.tsx` — Integration editor teks kaya (Rich Text Editor).
- `SocialShareButtons.tsx` — Tombol share media sosial.

---

## UI / UX Requirements

- Tampilan pembacaan artikel yang nyaman (*Typography Clean*), rasio baris memadai, dan ukuran gambar yang proporsional.
- Indikator badge kategori berwarna pada setiap artikel.
- Pagination / infinite scroll jika jumlah artikel banyak.

---

## Validation Rules

- `title`: Required, min 5 karakter.
- `content`: Required, min 20 karakter.
- `category`: Required.

---

## Security Rules

- Sanitasi HTML output konten dari WYSIWYG editor sebelum di-render ke browser untuk mencegah XSS.
- API mutasi (`POST`, `PUT`, `DELETE`) dilindungi oleh Sesi Auth Admin.

---

## AI Agent Instructions

### Backend Agent
- Buat fungsi helper generator `slug` otomatis yang menangani karakter khusus dan menambahkan postfix unik jika terjadi bentrokan slug.

### Frontend Agent
- Gunakan `DOMPurify` / sanitasi HTML yang aman saat menggunakan `dangerouslySetInnerHTML` untuk me-render isi konten artikel.
