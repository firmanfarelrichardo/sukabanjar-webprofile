# Context — Website Profil Desa Suka Banjar

Folder `context/` adalah **Single Source of Truth (SSOT)** dan **AI Context Repository** untuk seluruh dokumentasi, spesifikasi, dan knowledge base project Website Profil & Portal Digital Desa Suka Banjar.

---

## Document Priority (AI Agent Governance)

Setiap AI Agent wajib membaca dokumen dengan urutan berikut sebelum melakukan tugas:

```text
1. PRD.md
2. PROJECT_STATE.md
3. 05-setup/setup-sequence.md (jika task perlu memahami urutan setup / menjalankan project)
4. 03-management/decisions.md
5. 06-modules/<module>.md (file modul terkait)
6. Dokumen pendukung lainnya
```

*Contoh:* Jika mengerjakan modul E-Aspirasi:
```text
PRD.md
PROJECT_STATE.md
05-setup/setup-sequence.md
03-management/decisions.md
06-modules/aspirations.md
```

---

## Directory Structure

```text
context/
│
├── PRD.md                ← Sumber kebenaran utama (Product Requirement Document)
├── PROJECT_STATE.md      ← Kondisi project saat ini (snapshot & task aktif)
├── README.md             ← File ini (panduan navigasi SSOT)
│
├── 01-project/           ← Informasi global project
│   ├── overview.md       ← Ringkasan, stakeholder, tujuan, ruang lingkup
│   ├── architecture.md   ← Diagram arsitektur, modul, data flow
│   ├── database.md       ← ERD, daftar tabel, Prisma schema global
│   └── tech-stack.md     ← Stack teknis lengkap & estimasi biaya
│
├── 02-development/       ← Panduan pengembangan
│   ├── conventions.md    ← Naming convention, folder structure, clean code
│   ├── api.md            ← Dokumentasi standar API global & error codes
│   ├── testing.md        ← Strategi testing (unit, integration, UAT, Lighthouse)
│   └── deployment.md     ← Panduan deployment ke Vercel + Supabase
│
├── 03-management/        ← Tracking & manajemen project
│   ├── progress.md       ← Progress tracker (overall %)
│   ├── backlog.md        ← Daftar task & prioritas
│   ├── decisions.md      ← Log keputusan arsitektur & desain
│   └── changelog.md      ← Catatan perubahan sistem
│
├── 04-agent-output/      ← Audit trail & arsip output AI Agent
│   ├── README.md         ← Panduan penyimpanan output
│   ├── backend/          ← Output API, server logic, database
│   ├── frontend/         ← Output komponen UI, halaman
│   ├── database/         ← Output schema, migrasi, seed
│   ├── devops/           ← Output deployment, CI/CD
│   ├── documentation/    ← Output dokumentasi
│   └── research/         ← Output riset teknologi
│
├── 05-setup/             ← Panduan setup lingkungan lokal & cloud (Zero to Hero)
│   ├── setup-sequence.md        ← MASTER urutan setup kronologis & sistematis dari nol
│   ├── SEO_GUIDE.md             ← Panduan Lengkap SEO & Google Search Console Indexing
│   ├── local-development.md     ← Panduan menjalankan aplikasi di lokal
│   ├── supabase-setup.md        ← Panduan setup database PostgreSQL & Storage Supabase
│   ├── environment-variables.md ← Dokumentasi variabel lingkungan (.env.local)
│   ├── database-setup.md        ← Panduan setup PostgreSQL & Prisma ORM
│   ├── docker-setup.md          ← Status Docker (TIDAK DIGUNAKAN)
│   └── troubleshooting.md       ← Penanganan masalah umum
│
└── 06-modules/           ← Spesifikasi modular (1 file = 1 modul)
    ├── auth.md           ← Autentikasi Admin CMS
    ├── profile.md        ← Identitas, Sejarah, Visi & Misi Desa
    ├── apparatus.md      ← Perangkat Desa & Struktur Organisasi
    ├── aspirations.md    ← E-Aspirasi & Pengaduan Warga (Direct Message Model)
    ├── facilities.md     ← Peta Interaktif & Fasilitas Publik (Leaflet.js)
    ├── umkm.md           ← Katalog UMKM & Direct WhatsApp
    ├── tourism.md        ← Destinasi Wisata & Galeri Foto
    ├── articles.md       ← Portal Berita, Artikel & Pengumuman
    └── features-and-improvements.md ← Fitur Baru & Perbaikan (Biodata Aparatur, Maps Baru, SIPDeskel Persistence, Splash)
```

---

## Aturan Pembaruan Dokumentasi bagi AI Agent

- **Setiap Perubahan Sistem:** Wajib memperbarui `03-management/changelog.md`, `03-management/progress.md`, dan `03-management/backlog.md`.
- **Setiap Keputusan Baru:** Wajib memperbarui `03-management/decisions.md`.
- **Setiap Selesai Task:** Wajib memperbarui `PROJECT_STATE.md` dan menyimpan hasil kerja ke `04-agent-output/`.
