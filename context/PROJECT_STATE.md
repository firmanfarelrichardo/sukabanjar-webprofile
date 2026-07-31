# PROJECT STATE — Website Profil Desa Sukabanjar

**Terakhir Diperbarui:** 2026-07-31

---

## Status Keseluruhan

| Aspek | Status |
|---|---|
| **Fase Saat Ini** | Perencanaan, Setup & Dokumentasi Modular |
| **Progress Keseluruhan** | 0% (Belum mulai development) |
| **Blocker Aktif** | Tidak ada |
| **Deployment Target** | Vercel + Supabase Cloud (Tanpa Docker) |

---

## Kondisi Modul (`context/06-modules/`)

| No | Modul | File Context | Status | Catatan |
|---|---|---|---|---|
| 1 | Autentikasi Admin | `06-modules/auth.md` | ⬜ Belum Mulai | Auth guard & JWT / Supabase Auth |
| 2 | Profil Desa & Visi-Misi | `06-modules/profile.md` | ⬜ Belum Mulai | Sejarah, Visi-Misi, Demografi |
| 3 | Perangkat Desa | `06-modules/apparatus.md` | ⬜ Belum Mulai | Struktur organisasi & Spotlight Card |
| 4 | E-Aspirasi & Pengaduan | `06-modules/aspirations.md` | ⬜ Belum Mulai | Form pesan direct (tanpa tiket/status) |
| 5 | Peta Interaktif | `06-modules/facilities.md` | ⬜ Belum Mulai | Leaflet.js + OpenStreetMap |
| 6 | UMKM & Potensi Desa | `06-modules/umkm.md` | ⬜ Belum Mulai | Katalog + Tilted Card + Direct WA |
| 7 | Wisata & Pemandangan | `06-modules/tourism.md` | ⬜ Belum Mulai | Listing wisata + Tilted Card |
| 8 | Berita & Artikel | `06-modules/articles.md` | ⬜ Belum Mulai | Portal berita + WYSIWYG editor |

---

## Panduan Setup (`context/05-setup/`)

- `05-setup/setup-sequence.md` — **MASTER** urutan setup kronologis dari npm install s/d Vercel deploy
- `05-setup/local-development.md` — Langkah menjalankan project di mesin lokal
- `05-setup/supabase-setup.md` — Panduan pembuatan & konfigurasi Supabase DB & Storage
- `05-setup/environment-variables.md` — Daftar variabel lingkungan (.env.local)
- `05-setup/database-setup.md` — Konfigurasi PostgreSQL & Prisma ORM
- `05-setup/docker-setup.md` — Status Docker (TIDAK DIGUNAKAN)
- `05-setup/troubleshooting.md` — Penanganan masalah umum

---

## Document Priority AI Agent

```text
1. PRD.md
2. PROJECT_STATE.md
3. 05-setup/setup-sequence.md
4. 03-management/decisions.md
5. 06-modules/<module>.md
```
