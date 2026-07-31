# Changelog — Website Profil Desa Sukabanjar

Dokumen ini memuat catatan riwayat perubahan (*changelog*) project Website Profil Desa Sukabanjar secara kronologis mengikuti standar [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] - 2026-07-31

### Added
- **Inisialisasi Project Base Next.js 14:**
  - Membuat `package.json` dengan dependensi Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, Supabase SDK, Framer Motion, Leaflet, Lucide React, Bcryptjs, dan ts-node.
  - Membuat `tsconfig.json` dengan konfigurasi strict mode, moduleResolution `"bundler"`, path alias `@/*`, dan penunjuk `"typeRoots": ["./node_modules/@types"]`.
  - Membuat `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, dan `.gitignore`.
- **Database & Cloud Supabase Integration:**
  - Menambahkan file skema Prisma (`prisma/schema.prisma`) yang mendefinisikan 8 model tabel: `VillageProfile`, `Aspiration`, `Apparatus`, `Article`, `Umkm`, `Tourism`, `Facility`, dan `User`.
  - Menyiapkan file template `.env.example`, `.env.local`, dan `.env` yang terintegrasi dengan Supabase Public API Keys & Connection Pooler.
  - Membuat script seeder database (`prisma/seed.ts`) yang mengisi data awal Profil Desa Sukabanjar dan akun Admin CMS pertama (`admin` / `admin123`).
  - Menambahkan helper koneksi singleton Prisma (`src/lib/prisma.ts`) dan Supabase Client (`src/lib/supabase.ts`).
- **Layout & Base UI Components:**
  - Membuat `src/app/globals.css` dengan Tailwind directives dan variabel CSS tema.
  - Membuat `src/app/layout.tsx` dan `src/app/page.tsx` sebagai struktur dasar aplikasi.
- **Mobile-First & Responsive UX Guidelines:**
  - Menambahkan instruksi dan standar **Mobile-First Approach** pada `PRD.md`, `README.md`, `overview.md`, dan `conventions.md` untuk menjamin tampilan fleksibel di seluruh ukuran layar (Smartphone, Tablet, Laptop, Desktop).

### Changed
- **Konfigurasi Koneksi Supabase PostgreSQL:**
  - Mengubah string koneksi `DATABASE_URL` ke Supabase **Session Pooler Port 5432** (`aws-0-ap-southeast-1.pooler.supabase.com:5432`) untuk mendukung operasi DDL migrasi skema tabel (`db push`) dan operasi DML (`db seed`) secara stabil pada jaringan IPv4.
- **Prisma Seed Script:**
  - Mengubah perintah seed pada `package.json` menjadi `npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` untuk menjamin kompatibilitas di Windows PowerShell.

### Fixed
- **VS Code TypeScript Warning (`tsconfig.json`):**
  - Mengatasi peringatan `Cannot find type definition file for 'node'` dengan memasang paket `@types/node` terbaru dan menyertakan `"typeRoots": ["./node_modules/@types"]` pada `tsconfig.json`.
- **Koneksi Database Timeout/P1001:**
  - Mengatasi masalah koneksi direct host Supabase port 5432 dengan beralih ke Session Pooler host `aws-0-ap-southeast-1.pooler.supabase.com`.
- **Chunk Loading Error (`./819.js`):**
  - Membersihkan folder cache `.next` yang bentrok akibat eksekusi `npx next build` saat `npm run dev` sedang aktif.

---

## 2026-07-30 14:50

### Added
- Inisialisasi dokumen PRD v2.0 (Product Requirement Document).
- Struktur Knowledge Base project lengkap (`01-project`, `02-development`, `03-management`, `04-agent-output`).
- Dokumentasi `overview`, `architecture`, `database`, `features`, `tech-stack`.
- Dokumentasi `conventions`, `API`, `testing`, `deployment`.
- Backlog task, progress tracker, decisions log.

### Changed
- Memperbarui modul E-Aspirasi & Pengaduan Warga dari sistem ticketing menjadi model pengiriman pesan langsung (seperti email).
- Menghapus fitur Generator Tiket Laporan (`ASP-2026-xxx`).
- Menghapus fitur Cek Status Aspirasi.
- Menghapus input Nomor WhatsApp/Telepon pada form aspirasi.
- Menyederhanakan model Prisma `Aspiration` (menghapus field: `ticketCode`, `phoneNumber`, `status`, `response`; menambah: `isRead`).
- Mengubah modul admin dari tracking/balasan tiket menjadi Inbox Pesan Aspirasi.

### Removed
- Field `ticketCode`, `phoneNumber`, `status`, `response` pada model Aspiration.
- Istilah "Kode Tiket / Resi" dari glosarium PRD.
