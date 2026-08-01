# MODULE: ASPIRATIONS (E-ASPIRASI & PENGADUAN)

## Overview

Modul E-Aspirasi & Pengaduan Warga menyediakan sarana digital berbasis pengiriman pesan langsung (seperti formulir pesan/email) bagi warga Desa Suka Banjar untuk menyampaikan aspirasi, saran, atau pengaduan secara praktis, cepat, dan aman. Modul ini tidak menggunakan generator tiket resi, tidak memerlukan nomor WhatsApp/telepon, dan tidak menyediakan fitur tracking status laporan oleh warga.

---

## Objectives

- Menyediakan saluran komunikasi satu arah yang efisien dari warga ke Balai Desa.
- Memberikan perlindungan privasi warga dengan opsi centang *Sembunyikan Nama / Anonim*.
- Menyediakan lampiran foto bukti laporan secara opsional.
- Menyediakan interface **Inbox Pesan Aspirasi** bagi Admin Desa untuk membaca, memfilter, menandai `isRead`, dan mengelola pesan masuk.

---

## Stakeholders

### User Publik (Warga Desa)
- **Akses:** Write (Mengisi dan mengirim formulir pesan aspirasi/pengaduan).

### Admin Desa (Perangkat Desa)
- **Akses:** Read & Manage (Membaca pesan inbox, melihat foto bukti, menandai dibaca (`isRead`), memfilter kategori/tanggal, dan menghapus pesan).

---

## Functional Requirements

- **FR-ASP-001:** Formulir Pengajuan Pesan Aspirasi publik dengan bidang input:
  - Nama Pelapor
  - Centang Opsi Anonim ("Sembunyikan Nama")
  - Kategori Laporan (*Fasilitas Publik, Kebersihan/Lingkungan, Keamanan, Saran/Masukan, Lainnya*)
  - Judul & Detail Isi Pesan Aspirasi
  - Unggah Lampiran Foto Bukti (Opsional)
- **FR-ASP-002:** Notifikasi konfirmasi pengiriman berhasil di layar browser tanpa resi/tiket.
- **FR-ASP-003:** Tabel Inbox Aspirasi di Panel Admin lengkap dengan status *Belum Dibaca / Sudah Dibaca*, filter kategori, dan pencarian kata kunci.
- **FR-ASP-004:** Detail modal/page untuk membaca isi lengkap pesan dan mengunduh/melihat lampiran foto bukti.
- **FR-ASP-005:** Admin dapat mengubah status `isRead` menjadi `true` saat pesan dibuka/dibaca.
- **FR-ASP-006:** Admin dapat menghapus pesan aspirasi dari inbox.

---

## Business Rules

- **BR-ASP-001:** Jika warga mencentang *Anonim* (`isAnonymous: true`), sistem secara otomatis menyimpan `senderName` sebagai string `"Anonim"` di database server.
- **BR-ASP-002:** Modul ini tidak menyimpan nomor telepon / WhatsApp pelapor dan tidak menerbitkan kode tiket/resi.
- **BR-ASP-003:** Pesan aspirasi yang baru dikirim secara default memiliki status `isRead: false`.

---

## Workflow

### Submit Aspirasi (Warga)
1. Warga membuka halaman `/aspirasi`.
2. Warga menginput Nama (atau mencentang Anonim), memilih Kategori, menginput Judul & Isi Pesan, dan mengunggah Foto Bukti (opsional).
3. Warga mengklik "Kirim Pesan".
4. Frontend mengirim POST request ke `/api/aspirations`.
5. Backend menyimpan pesan ke database PostgreSQL tabel `Aspiration`.
6. Layar menampilkan modal/toast konfirmasi: *"Terima kasih, pesan aspirasi/pengaduan Anda telah terkirim ke Balai Desa Suka Banjar."*

### Read & Manage Inbox (Admin)
1. Admin membuka Panel Admin → `Inbox Aspirasi`.
2. Admin melihat daftar pesan (urut dari yang paling baru).
3. Admin mengklik baris pesan untuk membaca detailnya.
4. System mengirim request `PATCH /api/aspirations/:id` untuk mengubah `isRead: true`.
5. Admin dapat mengunduh foto bukti atau menghapus pesan.

---

## Database Design

### Tables

#### `Aspiration`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| senderName | String | Required | Nama Pengirim (atau "Anonim") |
| isAnonymous | Boolean | Default: false | Penanda Mode Anonim |
| category | String | Required | Kategori Laporan |
| title | String | Required | Judul Pesan Aspirasi |
| content | String | Text | Detail Isi Pesan |
| attachment | String? | Nullable | URL Foto Bukti Laporan |
| isRead | Boolean | Default: false | Status Penanda Dibaca Admin |
| createdAt | DateTime | Default: now() | Timestamp Dikirim |
| updatedAt | DateTime | UpdatedAt | Timestamp Pembaruan |

---

## Backend Design

### Endpoints
- `POST /api/aspirations` — Kirim pesan aspirasi baru (Public).
- `GET /api/aspirations` — Ambil daftar inbox aspirasi (Admin Only).
- `PATCH /api/aspirations/:id` — Tandai pesan dibaca / ubah `isRead` (Admin Only).
- `DELETE /api/aspirations/:id` — Hapus pesan aspirasi (Admin Only).

---

## API Endpoints

### POST `/api/aspirations`
- **Request Body:**
  ```json
  {
    "senderName": "Ahmad Maulana",
    "isAnonymous": false,
    "category": "Fasilitas Publik",
    "title": "Lampu Jalan Dusun 2 Mati",
    "content": "Mohon perbaikan lampu jalan dekat pos ronda...",
    "attachment": "https://storage.supabase.co/..."
  }
  ```
- **Response (201):** `{ "success": true, "data": { "id": "...", "message": "Pesan berhasil terkirim" } }`

### GET `/api/aspirations`
- **Query Params:** `category`, `isRead`, `search`, `page`, `limit`
- **Response (200):** `{ "success": true, "data": { "aspirations": [...], "total": 12 } }`

---

## Frontend Design

### Pages
- `/aspirasi` — Halaman formulir pengiriman aspirasi publik.
- `/admin/aspirasi` — Halaman Panel Admin Inbox Aspirasi.

### Components
- `AspirationForm.tsx` — Form input aspirasi publik.
- `AspirationInboxTable.tsx` — Tabel inbox pesan di panel admin dengan indikator badge (Unread/Read).
- `AspirationDetailModal.tsx` — Modal pembacaan detail pesan & foto lampiran.

---

## UI / UX Requirements

- Penggunaan komponen React Bits **Aurora / Waves BG** pada header form aspirasi.
- Desain form yang bersih, ramah seluler, dan mudah dipahami warga desa.
- Indikator visual jelas pada inbox admin untuk pesan yang *Belum Dibaca* (bold / icon badge).

---

## Validation Rules

- `senderName`: Required (jika `isAnonymous: true`, diisi otomatis `"Anonim"`).
- `category`: Required (salah satu dari list kategori resmi).
- `title`: Required, min 5 karakter.
- `content`: Required, min 10 karakter.
- `attachment`: Optional, gambar maksimal 5MB (JPG, PNG, WEBP).

---

## Security Rules

- Rate Limiting pada endpoint `POST /api/aspirations` (maksimal 3 pengiriman per IP per 5 menit) untuk mencegah spamming.
- Endpoint `GET`, `PATCH`, dan `DELETE` dilindungi Auth Guard Admin.

---

## Testing Scenarios

### Unit Test
- Cek penanganan mode anonim: Jika `isAnonymous` bernilai true, `senderName` harus berubah menjadi `"Anonim"`.

### Integration Test
- Post pesan baru → Tersimpan di DB → Muncul di GET Inbox Admin dengan `isRead: false`.
- Patch `isRead: true` → State pesan ter-update menjadi sudah dibaca.

---

## AI Agent Instructions

### Backend Agent
- Pastikan tidak ada field `ticketCode`, `phoneNumber`, `status`, atau `response` pada handler/schema aspirasi.

### Frontend Agent
- Buat tampilan konfirmasi yang ramah setelah form submit tanpa memberikan kode resi/tiket.
