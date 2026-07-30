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

---

## Architecture Summary

```
[Browser] → [Vercel CDN] → [Next.js App Router] → [Prisma ORM] → [Supabase PostgreSQL]
                                                                 → [Supabase Storage]
```

- **Frontend & Backend:** Next.js (App Router) + TypeScript
- **Database:** Supabase PostgreSQL (Free Tier)
- **Peta:** Leaflet.js + OpenStreetMap
- **Deployment:** Vercel Platform (Hobby Plan — Free)

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

```
sukabanjar-webprofile/
├── context/                    ← Knowledge Base & AI Context (SSOT)
│   ├── PRD.md                  ← Product Requirement Document Utama
│   ├── PROJECT_STATE.md        ← Kondisi project saat ini
│   ├── README.md               ← Panduan navigasi & AI Agent Governance
│   ├── 01-project/             ← Informasi global project (overview, architecture, database, tech-stack)
│   ├── 02-development/         ← Panduan pengembangan (conventions, api, testing, deployment)
│   ├── 03-management/          ← Tracking & manajemen (progress, backlog, decisions, changelog)
│   ├── 04-agent-output/        ← Audit trail & arsip output AI Agent
│   └── 05-modules/             ← Spesifikasi modular (1 file = 1 modul)
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

## AI Agent Workflow

Untuk mengerjakan task modul tertentu, AI Agent membaca dokumen dengan urutan prioritas:
1. `PRD.md`
2. `PROJECT_STATE.md`
3. `context/03-management/decisions.md`
4. `context/05-modules/<module>.md`

---

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

---

## License

Project ini dikembangkan untuk kepentingan Program KKN di Desa Sukabanjar.