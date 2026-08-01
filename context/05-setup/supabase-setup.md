# Supabase Database & Storage Setup — Website Profil Desa Suka Banjar

Dokumen ini berisi panduan lengkap pembuatan dan konfigurasi **Supabase Free Tier** dari nol untuk database PostgreSQL dan Supabase Storage media gambar pada Website Profil Desa Suka Banjar.

---

## Prerequisites & Kuota Free Tier

| Komponen | Kuota Free Tier | Penggunaan di Desa Suka Banjar |
|---|---|---|
| Database PostgreSQL | 500 MB | Menyimpan 8 tabel data desa (profil, berita, UMKM, aspirasi, dll.) |
| Storage Bucket | 1 GB | Penyimpanan foto berita, UMKM, destinasi wisata, & foto bukti aspirasi |
| Monthly Active Users | 50,000 MAU | Autentikasi Admin Desa CMS |
| Bandwidth Egress | 2 GB / bulan | Cukup untuk kebutuhan trafik profil desa |

---

## LANGKAH 1: Membuat Project Supabase Baru

1. Buka [supabase.com](https://supabase.com) dan login/register menggunakan akun GitHub.
2. Pada Dashboard Supabase, klik tombol **"New Project"**.
3. Isi formulir konfigurasi project:
   - **Organization:** Pilih nama organisasi Anda (misal: `KKN-Suka Banjar` / Personal).
   - **Name:** `Suka Banjar-webprofile` (atau `desa-Suka Banjar`).
   - **Database Password:** Buat password database yang kuat dan **catat/simpan password ini**.
   - **Region:** Pilih **Singapore (`ap-southeast-1`)** untuk latensi terendah dari Indonesia.
   - **Pricing Plan:** Pilih **Free ($0/month)**.
4. Klik **"Create new project"** dan tunggu proses inisialisasi database (sekitar 1-2 menit).

---

## LANGKAH 2: Mengambil Connection String & API Keys

Setelah project berhasil dibuat, ambil kredensial berikut dari Supabase Dashboard:

### 1. Database Connection String (untuk Prisma ORM)
- Buka **Project Settings (ikon roda gigi)** → **Database**.
- Gulir ke bagian **Connection String** → pilih tab **URI**.
- Salin string koneksi:
  ```text
  postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
  ```
  *(Ganti `[YOUR-PASSWORD]` dengan password database yang Anda buat di Langkah 1).*

> **Catatan Serverless / Connection Pooling:** Jika menggunakan Vercel Serverless Functions, Anda juga bisa menggunakan Connection Pooling URI (port `6543`) dengan menambahkan query parameter `?pgbouncer=true`.

### 2. API Keys & URL (untuk Supabase Client & Storage)
- Buka **Project Settings** → **API**.
- Salin variabel berikut:
  - **Project URL:** `https://[PROJECT-REF].supabase.co`
  - **anon / public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
  - **service_role / secret key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...` *(Private! Jangan di-commit ke Git)*.

---

## LANGKAH 3: Konfigurasi `.env.local`

Buat atau edit file `.env.local` pada project Next.js Anda:

```env
# Database PostgreSQL Connection (Prisma)
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@db.PROJECT_REF_ANDA.supabase.co:5432/postgres?schema=public"

# Supabase Public API Kredensial
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF_ANDA.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="ANON_KEY_ANDA"

# Supabase Service Role Key (Private Server-Side Only)
SUPABASE_SERVICE_ROLE_KEY="SERVICE_ROLE_KEY_ANDA"

# JWT Secret untuk Autentikasi Admin Custom
JWT_SECRET="buat-string-rahasia-minimal-32-karakter"

# Base URL Aplikasi
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## LANGKAH 4: Sinkronisasi Skema Prisma ke Supabase

Setelah `.env.local` terkonfigurasi, jalankan perintah Prisma di terminal lokal:

```sh
# 1. Generate Prisma Client SDK
npx prisma generate

# 2. Push skema model ke database Supabase
npx prisma db push

# 3. Seed data awal (Profil desa & akun admin pertama)
npx prisma db seed
```

**Verifikasi Database:**
- Buka Supabase Dashboard → **Table Editor**.
- Pastikan 8 tabel berikut sudah terbentuk: `VillageProfile`, `Aspiration`, `Apparatus`, `Article`, `Umkm`, `Tourism`, `Facility`, `User`.

---

## LANGKAH 5: Setup Supabase Storage Bucket (Penyimpanan Foto)

Supabase Storage digunakan untuk menyimpan foto aset berita, UMKM, wisata, dan bukti foto aspirasi warga.

### 1. Membuat Bucket Media Utama
1. Buka Supabase Dashboard → **Storage**.
2. Klik tombol **"New bucket"**.
3. Isi nama bucket: **`Suka Banjar-assets`**.
4. Aktifkan opsi **"Public bucket"** (agar foto dapat diakses dan ditampilkan di browser publik).
5. Klik **"Save"**.

### 2. Aturan Akses (Storage Policies / RLS)
Secara default, public bucket mengizinkan dibaca oleh siapa saja. Jika ingin memperketat unggahan foto:
- Buka **Storage** → **Policies** → pilih bucket `Suka Banjar-assets`.
- **Policy 1 (Public Read):** Allow `SELECT` for `anon` & `authenticated` (ALL users).
- **Policy 2 (Upload Foto Bukti Aspirasi):** Allow `INSERT` for `anon` (agar warga bisa upload foto bukti laporan).
- **Policy 3 (Admin Manage Assets):** Allow `INSERT`, `UPDATE`, `DELETE` for `authenticated` (Admin Desa).

---

## LANGKAH 6: Verification Checklist

- [ ] Project Supabase berhasil dibuat di Region Singapore.
- [ ] Connection String `DATABASE_URL` di `.env.local` sudah terisi password yang benar.
- [ ] Running `npx prisma db push` berhasil tanpa error connection.
- [ ] 8 tabel terbukti muncul di Supabase **Table Editor**.
- [ ] Storage Bucket `Suka Banjar-assets` sudah dibuat dan diset ke **Public**.
- [ ] `npm run dev` dapat mengakses data dari Supabase tanpa hambatan.
