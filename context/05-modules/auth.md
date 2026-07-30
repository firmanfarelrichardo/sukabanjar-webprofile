# MODULE: AUTHENTICATION

## Overview

Modul Autentikasi menangani akses keamanan ke Panel Admin CMS Desa Sukabanjar. Modul ini memastikan hanya pengguna terautentikasi dengan peran Admin yang dapat melakukan perubahan data (CRUD) pada seluruh modul CMS.

---

## Objectives

- Mengamankan akses Panel Admin Desa dari pengguna publik yang tidak berwenang.
- Mengelola login, logout, dan otentikasi sesi berbasis JWT / Supabase Auth.
- Menjamin Type-Safe RBAC (Role-Based Access Control) sederhana.

---

## Stakeholders

### User Publik
- **Akses:** Non-authenticated (Read-Only ke halaman publik, Write ke form aspirasi).

### Admin Desa
- **Akses:** Authenticated (Full Access Read-Write-Delete ke Panel CMS dan Inbox Aspirasi).

---

## Functional Requirements

- **FR-AUTH-001:** Admin dapat melakukan login dengan kombinasi username/email dan password.
- **FR-AUTH-002:** Sistem melakukan verifikasi password terenkripsi (hash).
- **FR-AUTH-003:** Sistem menerbitkan token sesi (JWT / Supabase Auth Session) setelah login berhasil.
- **FR-AUTH-004:** Admin dapat melakukan logout untuk mengakhiri sesi.
- **FR-AUTH-005:** Route `/admin/*` dan API mutation (`POST`, `PUT`, `DELETE`) dilindungi oleh Auth Guard Middleware.

---

## Business Rules

- **BR-AUTH-001:** Hanya ada 1 role dalam sistem CMS yaitu `ADMIN`.
- **BR-AUTH-002:** Sesi login kadaluarsa otomatis setelah durasi tertentu (misal: 24 jam).
- **BR-AUTH-003:** Percobaan login gagal berulang kali dibatasi (Rate Limiting).

---

## Workflow

### Login Flow
1. Admin membuka halaman `/admin/login`.
2. Admin memasukkan `username` dan `password`.
3. System mengirim POST request ke `/api/auth/login`.
4. Backend memverifikasi kredensial di database (tabel `User`).
5. Jika valid, backend mengirimkan HTTP-Only Cookie / Token JWT dan mengarahkan admin ke `/admin/dashboard`.

### Logout Flow
1. Admin mengklik tombol "Logout" di Navbar Panel Admin.
2. System mengirim POST request ke `/api/auth/logout`.
3. Sesi dihancurkan/cookie dihapus.
4. User di-redirect ke `/admin/login`.

---

## Database Design

### Tables

#### `User`

| Column | Type | Constraint | Deskripsi |
|---|---|---|---|
| id | String | PK, UUID | Primary Key |
| username | String | Unique | Username Admin |
| password | String | Required | Hashed Password |
| role | String | Default: "ADMIN" | Role pengguna |
| createdAt | DateTime | Default: now() | Timestamp pembuatan |

### Relationships
- Tidak ada relasi ke tabel lain (Standalone table).

---

## Backend Design

### Endpoints / Handlers
- `POST /api/auth/login` — Verifikasi kredensial & terbitkan token.
- `POST /api/auth/logout` — Hapus token / akhiri sesi.
- `GET /api/auth/me` — Ambil data profile admin terautentikasi.

### Middleware
- `middleware.ts` — Auth Guard untuk memeriksa token pada request route `/admin/*` dan API non-GET.

---

## API Endpoints

### POST `/api/auth/login`
- **Request Body:** `{ "username": "admin", "password": "..." }`
- **Response (200):** `{ "success": true, "data": { "token": "...", "user": { "username": "admin" } } }`
- **Error (401):** `{ "success": false, "error": "Username atau password salah" }`

### POST `/api/auth/logout`
- **Response (200):** `{ "success": true, "message": "Berhasil logout" }`

---

## Frontend Design

### Pages
- `/admin/login` — Halaman login admin.

### Components
- `LoginForm.tsx` — Form input username & password dengan indikator loading.
- `AdminAuthGuard.tsx` — Wrapper pembatas akses halaman admin.

---

## UI / UX Requirements

- Layout form login bersih, minimalis, dan responsif.
- Tampilan pesan kesalahan (toast/alert) jika login gagal.
- Indikator loading saat memproses login.

---

## Validation Rules

- `username`: Required, min 3 karakter, trim whitespace.
- `password`: Required, min 6 karakter.

---

## Security Rules

- Password **wajib** disimpan dalam bentuk Hash (Bcrypt / Argon2).
- Token autentikasi disimpan di HTTP-Only, Secure, SameSite Cookie.
- Endpoint login dilindungi oleh Rate Limiter (maksimal 5 percobaan per menit).

---

## Testing Scenarios

### Unit Test
- Hash verification function.
- Token generator & verifier.

### Integration Test
- Successful login flow → Return token & cookie.
- Failed login with wrong password → Return 401 error.
- Accessing protected route without token → Redirect to `/admin/login`.

---

## Dependencies

- **Internal Modules:** Seluruh modul Admin CMS.
- **External Services:** Supabase Auth (jika memakai Supabase Auth bawaan) atau Jose / Bcrypt.

---

## AI Agent Instructions

### Backend Agent
- Gunakan HTTP-Only Cookie untuk menyimpan sesi autentikasi.
- Pastikan middleware memblokir semua request API mutasi (`POST`, `PUT`, `DELETE`) jika header/cookie token tidak valid.

### Frontend Agent
- Implementasikan form login dengan state management yang bersih dan feedback visual jelas.
- Redirect otomatis ke `/admin/dashboard` jika admin sudah terautentikasi.

---

## Known Issues
- Belum ada fitur reset password via email (reset dilakukan manual via database/seed script).

---

## Future Improvements
- Fitur Multi-User Admin (Super Admin & Staf Admin).
- Fitur 2FA (Two-Factor Authentication) untuk keamanan ekstra.
