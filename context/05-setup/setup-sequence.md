# Master Urutan Setup Project — Website Profil Desa Sukabanjar

Dokumen ini memuat **urutan alur setup secara rinci, kronologis, dan sistematis** untuk membangun dan menjalankan Website Profil Desa Sukabanjar dari nol hingga *live deployment*.

> **Catatan Arsitektur:** Project ini **TIDAK menggunakan Docker**. Pengembangan dan infrastruktur berfokus 100% pada ekosistem **Next.js + Prisma ORM + Supabase (Database & Storage) + Vercel (Hosting & CI/CD)** dengan prinsip Zero-Cost Infrastructure.

---

## DIAGRAM ALUR SETUP (CHRONOLOGICAL FLOW)

```text
[TAHAP 1] Prerequisites Lokal (Node.js, Git, Repository)
    │
    ▼
[TAHAP 2] Install Dependencies Project (npm install)
    │
    ▼
[TAHAP 3] Setup Cloud Supabase (Database PostgreSQL & Storage Bucket)
    │
    ▼
[TAHAP 4] Konfigurasi Environment Variables (.env.local)
    │
    ▼
[TAHAP 5] Setup & Migrate Database (Prisma Generate, Push & Seed)
    │
    ▼
[TAHAP 6] Running & Testing Lokal (npm run dev)
    │
    ▼
[TAHAP 7] Deployment Production (GitHub + Vercel)
```

---

## RINCIAN LANGKAH DEMI LANGKAH

### TAHAP 1: Kebutuhan Perangkat Lunak Lokal (Prerequisites)

Pastikan perangkat komputer pengembang telah terinstall software dasar berikut:
1. **Node.js:** Versi LTS (v18.x atau v20.x). Cek dengan `node -v`.
2. **npm:** Versi 9.x atau 10.x (bawaan Node.js). Cek dengan `npm -v`.
3. **Git:** Cek dengan `git --version`.

---

### TAHAP 2: Inisialisasi Project & Install Dependencies

1. Clone repository dari GitHub ke komputer lokal:
   ```sh
   git clone https://github.com/<username>/sukabanjar-webprofile.git
   cd sukabanjar-webprofile
   ```
2. Jalankan perintah instalasi seluruh paket/library yang dibutuhkan (Next.js, Tailwind CSS, Prisma, Supabase SDK, Framer Motion, Leaflet, dll.):
   ```sh
   npm install
   ```

---

### TAHAP 3: Setup Cloud Infrastructure (Supabase Database & Storage)

*Sebelum menjalankan aplikasi di lokal, layanan backend Supabase harus disiapkan terlebih dahulu.*

1. **Buat Project Supabase:**
   - Login ke [supabase.com](https://supabase.com).
   - Buat project baru bernama `sukabanjar-webprofile`.
   - Pilih Region **Singapore (`ap-southeast-1`)** dan buat Password Database.
2. **Ambil Kredensial Connection:**
   - **Database Connection URI:** Ambil dari Settings → Database → Connection String (URI).
   - **API Keys:** Ambil `URL`, `anon public key`, dan `service_role key` dari Settings → API.
3. **Buat Storage Bucket:**
   - Buka menu **Storage** → Buat Bucket baru bernama **`sukabanjar-assets`**.
   - Centang opsi **Public Bucket** agar gambar dapat diakses publik.

*(Panduan gambar & RLS policy selengkapnya ada di `context/05-setup/supabase-setup.md`)*.

---

### TAHAP 4: Konfigurasi Environment Variables Lokal

1. Salin file template environment:
   ```sh
   cp .env.example .env.local
   ```
2. Buka `.env.local` di code editor dan isi sesuai data dari Supabase (Tahap 3):
   ```env
   # Connection string ke Supabase PostgreSQL
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"

   # Supabase Public API Key
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY-ANDA]"
   SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY-ANDA]"

   # Secret Auth Local
   JWT_SECRET="rahasia-jwt-sukabanjar-32-karakter"

   # URL Lokal
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

---

### TAHAP 5: Setup & Migrasi Database via Prisma ORM

Setelah `.env.local` terisi kredensial Supabase, lakukan migrasi skema tabel ke cloud:

1. **Generate Client SDK Prisma:**
   ```sh
   npx prisma generate
   ```
2. **Push Skema ke Supabase PostgreSQL:**
   ```sh
   npx prisma db push
   ```
   *(Sistem akan membuat 8 tabel otomatis: VillageProfile, Aspiration, Apparatus, Article, Umkm, Tourism, Facility, User).*
3. **Seed Data Awal (Admin & Profil Desa Default):**
   ```sh
   npx prisma db seed
   ```

---

### TAHAP 6: Menjalankan & Memeriksa Aplikasi di Lokal

1. Jalankan development server Next.js:
   ```sh
   npm run dev
   ```
2. Buka browser di `http://localhost:3000`:
   - [x] **Halaman Publik (`/`):** Tampil hero banner, statistik, peta, UMKM, berita.
   - [x] **Form Aspirasi (`/aspirasi`):** Coba kirim 1 pesan tes.
   - [x] **Login Admin (`/admin/login`):** Login menggunakan akun admin hasil seed.
   - [x] **Inbox Admin (`/admin/aspirasi`):** Pastikan pesan tes masuk ke inbox.

---

### TAHAP 7: Deployment Production (GitHub + Vercel)

1. **Push Seluruh Kode ke GitHub:**
   ```sh
   git add .
   git commit -m "feat: complete project setup"
   git push origin main
   ```
2. **Deploy di Vercel Dashboard:**
   - Login ke [vercel.com](https://vercel.com) dan buat **New Project**.
   - Import repository `sukabanjar-webprofile` dari GitHub.
   - Masukkan seluruh variabel lingkungan dari `.env.local` ke menu **Environment Variables** di Vercel.
   - Klik **Deploy**.
3. **Build Command otomatis Vercel:** `npx prisma generate && next build`.
4. Website Desa Sukabanjar resmi live dengan SSL/HTTPS gratis!

---

## RINGKASAN URUTAN SINGKAT (CHEATSHEET)

```sh
# 1. Clone & Install
git clone https://github.com/<user>/sukabanjar-webprofile.git
cd sukabanjar-webprofile
npm install

# 2. Setup Env (Sesuaikan kredensial Supabase)
cp .env.example .env.local

# 3. Migrate & Seed Database Supabase
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Run Server Local
npm run dev

# 5. Push & Deploy ke Vercel via GitHub
```
