# Current Project State — Website Profil Desa Suka Banjar

**Terakhir Diperbarui:** 2026-07-31

---

## Current Sprint & Progress Status

| Aspek | Status |
|---|---|
| **Fase Saat Ini** | Setup Base Infrastructure & Database Cloud Selesai (Tahap 1-5 Selesai 100%) |
| **Progress Keseluruhan** | 20% |
| **Alur Pengembangan** | Database ➔ Backend ➔ Endpoint List ➔ Sample JSON Responses ➔ UI Components ➔ Frontend |
| **Blocker Aktif** | Tidak Ada |
| **Target Deployment** | Vercel Platform + Supabase Cloud (Zero-Cost Stack) |

---

## Standar Alur Kerja Pengembangan Per Modul (Strict Workflow)

Sesuai ketentuan `Project-Knowledge Base with AI Context.md`, setiap modul wajib dikerjakan mengikuti 6 tahap berurutan berikut:

```text
1. Database        : Skema Prisma, constraint, index, migrasi, dan seed data modul
2. Backend         : Service layer, Prisma queries, validasi Zod/types, dan business logic
3. Endpoint List   : Kontrak REST API (Method, Path, Auth, Payload, Query Params, Status Code)
4. Sample JSON     : Dokumentasi JSON Response (Success, Empty State, Validation Error, Auth Error, System Error)
5. UI Components   : Komponen & template UI reusable berbasis Mobile-First & React Bits
6. Frontend        : Halaman publik/admin, routing, state management, API client integration
```

---

## Urutan Rencana Eksekusi Modul

1. **Modul 0: Core Foundation & UI Layout Base** (Navbar, Footer, Mobile Navigation, Layout Root)
2. **Modul 1: Profil Desa & Visi-Misi** (`06-modules/profile.md`)
3. **Modul 2: Perangkat Desa & Struktur Organisasi** (`06-modules/apparatus.md`)
4. **Modul 3: E-Aspirasi & Pengaduan Warga** (`06-modules/aspirations.md`)
5. **Modul 4: Peta Interaktif Fasilitas Publik** (`06-modules/facilities.md`)
6. **Modul 5: UMKM & Potensi Desa** (`06-modules/umkm.md`)
7. **Modul 6: Destinasi Wisata & Pemandangan Alam** (`06-modules/tourism.md`)
8. **Modul 7: Berita, Artikel & Pengumuman** (`06-modules/articles.md`)
9. **Modul 8: Autentikasi & Panel Admin CMS** (`06-modules/auth.md`)
10. **Modul 9: Integrasi Landing Page Utama** (Hero Banner, Quick Access, Count Up Stats, Ticker Pengumuman)

---

## Kondisi Modul (`context/06-modules/`)

| No | Modul | File Context | Status | Catatan |
|---|---|---|---|---|
| 0 | Core UI Base | `02-development/conventions.md` | 🔄 Siap Dikerjakan | Base layout, Navbar, Footer, UI primitives |
| 1 | Profil Desa & Visi-Misi | `06-modules/profile.md` | ⏳ Antrean #1 | Sejarah, Visi-Misi, Demografi Chart |
| 2 | Perangkat Desa | `06-modules/apparatus.md` | ⏳ Antrean #2 | Struktur organisasi & Spotlight Card |
| 3 | E-Aspirasi & Pengaduan | `06-modules/aspirations.md` | ⏳ Antrean #3 | Form pesan direct (tanpa tiket/status) |
| 4 | Peta Interaktif | `06-modules/facilities.md` | ⏳ Antrean #4 | Leaflet.js + OpenStreetMap |
| 5 | UMKM & Potensi Desa | `06-modules/umkm.md` | ⏳ Antrean #5 | Katalog + Tilted Card + Direct WA |
| 6 | Wisata & Pemandangan | `06-modules/tourism.md` | ⏳ Antrean #6 | Listing wisata + Tilted Card |
| 7 | Berita & Artikel | `06-modules/articles.md` | ⏳ Antrean #7 | Portal berita + WYSIWYG editor |
| 8 | Autentikasi Admin & CMS | `06-modules/auth.md` | ⏳ Antrean #8 | Auth guard, JWT, & Admin Dashboard |

---

## Document Priority AI Agent

```text
1. PRD.md
2. PROJECT_STATE.md
3. 05-setup/setup-sequence.md
4. 03-management/decisions.md
5. 06-modules/<module>.md
```
