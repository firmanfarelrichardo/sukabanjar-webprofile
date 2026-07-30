# Context — Website Profil Desa Sukabanjar

Folder `context/` adalah **Single Source of Truth (SSOT)** dan **AI Context Repository** untuk seluruh dokumentasi, spesifikasi, dan knowledge base project Website Profil & Portal Digital Desa Sukabanjar.

---

## Urutan Prioritas Pembacaan Dokumentasi (AI Agent Governance)

Setiap AI Agent wajib membaca dokumen dengan urutan berikut sebelum melakukan tindakan:

```text
1. PRD.md
2. PROJECT_STATE.md
3. 03-management/decisions.md
4. File modul terkait pada 05-modules/<module>.md
5. Dokumen pendukung lainnya
```

*Contoh:* Jika mengerjakan fitur E-Aspirasi, agent cukup membaca:
- `PRD.md`
- `PROJECT_STATE.md`
- `03-management/decisions.md`
- `05-modules/aspirations.md`

---

## Struktur Folder

```
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
└── 05-modules/           ← Spesifikasi modular (1 file = 1 modul)
    ├── auth.md           ← Autentikasi Admin CMS
    ├── profile.md        ← Identitas, Sejarah, Visi & Misi Desa
    ├── apparatus.md      ← Perangkat Desa & Struktur Organisasi
    ├── aspirations.md    ← E-Aspirasi & Pengaduan Warga (Direct Message Model)
    ├── facilities.md     ← Peta Interaktif & Fasilitas Publik (Leaflet.js)
    ├── umkm.md           ← Katalog UMKM & Direct WhatsApp
    ├── tourism.md        ← Destinasi Wisata & Galeri Foto
    └── articles.md       ← Portal Berita, Artikel & Pengumuman
```

---

## Aturan Pembaruan Dokumentasi bagi AI Agent

- **Setiap Perubahan Sistem:** Wajib memperbarui `03-management/changelog.md`, `03-management/progress.md`, dan `03-management/backlog.md`.
- **Setiap Keputusan Baru:** Wajib memperbarui `03-management/decisions.md`.
- **Setiap Selesai Task:** Wajib memperbarui `PROJECT_STATE.md` dan menyimpan hasil kerja ke `04-agent-output/`.
