# Website Profil & Portal Digital Desa Sukabanjar

Website profil dan portal informasi digital untuk Desa Sukabanjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan, Lampung.

Dibangun sebagai Program Kerja (Progja) Kuliah Kerja Nyata (KKN) dengan prinsip **Zero-Cost Infrastructure** (Rp 0/bulan).

---

## Project Overview

Platform web yang menyajikan profil desa, potensi UMKM, destinasi wisata, peta interaktif fasilitas publik, portal berita, dan saluran aspirasi/pengaduan digital bagi warga. Seluruh konten dikelola secara dinamis melalui Panel Admin CMS oleh Perangkat Desa.

---

## Goals

1. **Digitalisasi Informasi Desa** — Profil, UMKM, wisata, struktur pemerintahan
2. **Kanal Aspirasi Publik** — Pengiriman pesan aspirasi/pengaduan (model pesan langsung)
3. **Pemetaan Fasilitas Publik** — Peta interaktif berbasis OpenStreetMap
4. **Kearsipan Digital** — Portal berita, artikel, dan pengumuman
5. **Kemandirian Pengelolaan** — Full Dynamic CMS untuk Perangkat Desa
6. **Mobile-First & Responsive UX** — Tampilan fleksibel & optimal di seluruh layar (HP, Tablet, Laptop, Desktop)

---

## Architecture Summary

```
[Browser] → [Vercel CDN] → [Next.js App Router] → [Prisma ORM] → [Supabase PostgreSQL]
                                                                 → [Supabase Storage]
```

- **Frontend & Backend:** Next.js (App Router) + TypeScript
- **Database & Storage:** Supabase PostgreSQL (Free Tier) + Supabase Storage
- **Peta:** Leaflet.js + OpenStreetMap
- **Deployment:** Vercel Platform (Hobby Plan — Free)
- **Containerization:** Tanpa Docker (100% Cloud Serverless Stack)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + Framer Motion + React Bits |
| Database | Supabase PostgreSQL (Free Tier) |
| ORM | Prisma ORM |
| Map | Leaflet.js + OpenStreetMap |
| Storage | Supabase Storage / Cloudinary Free |
| Deployment | Vercel Platform (Hobby Plan) |

---

## Folder Structure

```text
sukabanjar-webprofile/
├── context/                    ← Knowledge Base & AI Context (SSOT)
│   ├── PRD.md                  ← Product Requirement Document Utama
│   ├── PROJECT_STATE.md        ← Kondisi project saat ini
│   ├── README.md               ← Panduan navigasi & AI Agent Governance
│   ├── 01-project/             ← Informasi global project (overview, architecture, database, tech-stack)
│   ├── 02-development/         ← Panduan pengembangan (conventions, api, testing, deployment)
│   ├── 03-management/          ← Tracking & manajemen (progress, backlog, decisions, changelog)
│   ├── 04-agent-output/        ← Audit trail & arsip output AI Agent
│   ├── 05-setup/               ← Setup lingkungan lokal & cloud (Zero to Hero)
│   │   ├── setup-sequence.md        ← MASTER urutan setup kronologis dari nol
│   │   ├── local-development.md     ← Panduan menjalankan aplikasi di lokal
│   │   ├── supabase-setup.md        ← Panduan setup Supabase DB & Storage
│   │   ├── environment-variables.md ← Dokumentasi variabel lingkungan (.env.local)
│   │   ├── database-setup.md        ← Panduan setup PostgreSQL & Prisma ORM
│   │   ├── docker-setup.md          ← Status Docker (TIDAK DIGUNAKAN)
│   │   └── troubleshooting.md       ← Penanganan masalah umum
│   └── 06-modules/             ← Spesifikasi modular (1 file = 1 modul)
│       ├── auth.md             ← Modul Autentikasi Admin CMS
│       ├── profile.md          ← Modul Profil & Visi-Misi Desa
│       ├── apparatus.md        ← Modul Perangkat Desa
│       ├── aspirations.md      ← Modul E-Aspirasi & Pengaduan Warga
│       ├── facilities.md       ← Modul Peta Interaktif Fasilitas
│       ├── umkm.md             ← Modul UMKM & Direct WA
│       ├── tourism.md          ← Modul Wisata & Galeri Foto
│       └── articles.md         ← Modul Portal Berita & Artikel
├── src/                        ← Source code (akan dibuat)
├── prisma/                     ← Prisma schema (akan dibuat)
├── public/                     ← Static assets (akan dibuat)
├── .gitignore
├── README.md                   ← File ini
└── package.json                ← Dependencies (akan dibuat)
```

---

## AI Agent Workflow & Priority

Untuk mengerjakan task tertentu, AI Agent membaca dokumen dengan urutan prioritas:
1. `PRD.md`
2. `PROJECT_STATE.md`
3. `context/05-setup/setup-sequence.md`
4. `context/03-management/decisions.md`
5. `context/06-modules/<module>.md`

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Generate Prisma client & push schema ke Supabase
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Run development server
npm run dev
```

---

## License

Project ini dikembangkan untuk kepentingan Program KKN di Desa Sukabanjar.