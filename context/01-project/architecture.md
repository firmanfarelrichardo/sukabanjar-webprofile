# Arsitektur Teknis — Website Profil Desa Sukabanjar

## Diagram Arsitektur

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                      │
│  ┌─────────────────────┐    ┌──────────────────────────────────┐    │
│  │   Public Pages       │    │   Admin Panel (CMS)              │    │
│  │   (SSR/SSG)          │    │   (Client-Side Protected)        │    │
│  │                       │    │                                    │    │
│  │  - Landing Page       │    │  - Dashboard                      │    │
│  │  - Profil Desa        │    │  - Manajemen Profil Desa          │    │
│  │  - Berita/Artikel     │    │  - Manajemen Berita               │    │
│  │  - UMKM               │    │  - Manajemen UMKM & Wisata       │    │
│  │  - Wisata              │    │  - Manajemen Peta Fasilitas      │    │
│  │  - Peta Interaktif    │    │  - Manajemen Perangkat Desa       │    │
│  │  - Form Aspirasi      │    │  - Inbox Aspirasi Warga           │    │
│  └─────────────────────┘    └──────────────────────────────────┘    │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS (Vercel Edge)
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER (Server)                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  API Routes (/api/*)                                          │    │
│  │                                                                │    │
│  │  - /api/village-profile   (GET, PUT)                           │    │
│  │  - /api/aspirations       (GET, POST, DELETE)                  │    │
│  │  - /api/articles          (GET, POST, PUT, DELETE)             │    │
│  │  - /api/umkm              (GET, POST, PUT, DELETE)             │    │
│  │  - /api/tourism           (GET, POST, PUT, DELETE)             │    │
│  │  - /api/facilities        (GET, POST, PUT, DELETE)             │    │
│  │  - /api/apparatus         (GET, POST, PUT, DELETE)             │    │
│  │  - /api/auth              (POST - Login)                       │    │
│  └──────────────────────────────┬───────────────────────────────┘    │
│                                  │                                    │
│  ┌──────────────────────────────▼───────────────────────────────┐    │
│  │  PRISMA ORM (Type-Safe Query Builder)                         │    │
│  └──────────────────────────────┬───────────────────────────────┘    │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │    SUPABASE (Free Tier)      │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ PostgreSQL Database     │  │
                    │  │ (500MB Free)            │  │
                    │  └────────────────────────┘  │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Supabase Storage        │  │
                    │  │ (Media/Image Assets)    │  │
                    │  └────────────────────────┘  │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Supabase Auth           │  │
                    │  │ (Admin Authentication)  │  │
                    │  └────────────────────────┘  │
                    └─────────────────────────────┘
```

---

## Modul Sistem

| No | Modul | Deskripsi |
|---|---|---|
| 1 | Landing Page | Hero banner dinamis, quick access grid, statistik count up, ticker pengumuman |
| 2 | Profil & Informasi Desa | Sejarah, visi-misi, struktur organisasi, demografi |
| 3 | E-Aspirasi & Pengaduan | Formulir pengiriman pesan aspirasi (seperti email) |
| 4 | Peta Interaktif | Peta Leaflet.js + OpenStreetMap dengan pin marker fasilitas |
| 5 | UMKM & Potensi Desa | Katalog produk lokal dengan integrasi WhatsApp penjual |
| 6 | Wisata & Pemandangan | Listing destinasi wisata dengan galeri foto |
| 7 | Berita & Pengumuman | Portal artikel berita kegiatan desa & KKN |
| 8 | Panel Admin CMS | Full dynamic content management untuk semua modul |

---

## Komponen Utama

### Frontend
- **Next.js App Router** — Framework utama (SSR + SSG)
- **TypeScript** — Type-safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animasi transisi halus
- **React Bits** — Komponen UI modern (Text Pressure, Tilted Card, Spotlight Card, Count Up, dll.)
- **Leaflet.js** — Peta interaktif
- **Chart.js / Recharts** — Visualisasi data demografi

### Backend
- **Next.js API Routes** — Server-side API endpoints
- **Prisma ORM** — Database query builder & schema migration
- **Supabase Auth** — Autentikasi admin

### Database & Storage
- **Supabase PostgreSQL** — Database relasional (Free Tier 500MB)
- **Supabase Storage / Cloudinary Free** — Penyimpanan media gambar

### Deployment
- **Vercel Platform (Hobby Plan)** — CI/CD otomatis dari GitHub + SSL/HTTPS

---

## Data Flow

```
[Warga/Pengunjung] ──► [Browser] ──► [Vercel CDN/Edge]
                                          │
                                          ▼
                                    [Next.js Server]
                                          │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                        [SSR Pages]  [API Routes]  [SSG Pages]
                                          │
                                          ▼
                                    [Prisma ORM]
                                          │
                              ┌───────────┼───────────┐
                              ▼                       ▼
                      [PostgreSQL DB]         [Supabase Storage]
                      (Data CRUD)             (Upload Gambar)
```

**Alur Pengiriman Aspirasi Warga:**
1. Warga mengisi formulir aspirasi (nama/anonim, kategori, judul, isi pesan, foto opsional)
2. Data dikirim via POST ke API endpoint `/api/aspirations`
3. Prisma ORM menyimpan record ke tabel `Aspiration` di PostgreSQL
4. Jika ada foto, file diunggah ke Supabase Storage dan URL disimpan di field `attachment`
5. Warga melihat konfirmasi pengiriman berhasil di layar
6. Admin membuka Inbox Aspirasi di Panel Admin → membaca pesan → menandai `isRead`
