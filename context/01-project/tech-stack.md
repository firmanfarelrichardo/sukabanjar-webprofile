# Tech Stack — Website Profil Desa Sukabanjar

## Prinsip Pemilihan Teknologi

- **Zero-Cost Infrastructure:** Seluruh teknologi memanfaatkan Free Tier tanpa biaya berlangganan bulanan.
- **Type-Safe & Scalable:** Penggunaan TypeScript dan Prisma ORM untuk keamanan tipe data dan kemudahan pemeliharaan.
- **Modern & Performant:** Framework modern dengan dukungan SSR/SSG untuk SEO maksimal.

---

## Stack Lengkap

### Frontend

| Teknologi | Versi | Fungsi | Alasan Pemilihan |
|---|---|---|---|
| **Next.js (App Router)** | Latest | Framework utama (SSR + SSG) | SEO maksimal, performa optimal, routing modern |
| **TypeScript** | Latest | Bahasa pemrograman | Type-safety, auto-complete, mencegah bug runtime |
| **Tailwind CSS** | Latest | Utility-first CSS framework | Kepraktisan styling, konsistensi desain, responsif |
| **Framer Motion** | Latest | Animasi & transisi | Transisi halus antar halaman & elemen UI |
| **React Bits** | Latest | Komponen UI modern | Text Pressure, Tilted Card, Spotlight Card, Count Up, dll. |
| **Leaflet.js** | Latest | Peta interaktif | 100% gratis, tanpa API Key Google Maps |
| **Chart.js / Recharts** | Latest | Visualisasi data | Grafik interaktif untuk data demografi desa |

### Backend

| Teknologi | Versi | Fungsi | Alasan Pemilihan |
|---|---|---|---|
| **Next.js API Routes** | Latest | Server-side API endpoints | Terintegrasi dalam satu framework, tanpa server terpisah |
| **Prisma ORM** | Latest | Database query builder & migration | Type-safe, auto-complete query, migrasi aman |

### Database & Storage

| Teknologi | Versi / Plan | Fungsi | Alasan Pemilihan |
|---|---|---|---|
| **Supabase PostgreSQL** | Free Tier (500MB) | Database relasional utama | Kapasitas cukup untuk data desa, fitur Auth & Storage bawaan |
| **Supabase Storage** | Free Tier | Penyimpanan media gambar | Upload foto berita, UMKM, galeri, bukti aspirasi |
| **Cloudinary** (alternatif) | Free Tier | CDN & optimasi gambar | Alternatif penyimpanan media dengan optimasi otomatis |

### Authentication

| Teknologi | Versi / Plan | Fungsi | Alasan Pemilihan |
|---|---|---|---|
| **Supabase Auth** | Free Tier | Autentikasi admin CMS | Bawaan Supabase, tanpa setup tambahan |

### Deployment & DevOps

| Teknologi | Plan | Fungsi | Alasan Pemilihan |
|---|---|---|---|
| **Vercel Platform** | Hobby Plan (Free) | Hosting & CI/CD | Deploy otomatis dari GitHub, SSL/HTTPS gratis |
| **GitHub** | Free | Version control & repository | CI/CD integration dengan Vercel |

### Map & Geolocation

| Teknologi | Lisensi | Fungsi | Alasan Pemilihan |
|---|---|---|---|
| **OpenStreetMap** | Open Source (Free) | Tile peta dasar | 100% gratis tanpa risiko tagihan |
| **Leaflet.js** | Open Source (Free) | Library peta interaktif | Ringan, responsif, tanpa biaya lisensi |

---

## Pemetaan Komponen UI React Bits

| Komponen React Bits | Implementasi |
|---|---|
| Text Pressure / Split | Title Hero "Selamat Datang di Desa Sukabanjar" |
| Tilted Card | Card Katalog UMKM & Card Destinasi Wisata |
| Spotlight Card | Card Profil Perangkat Desa & Preview Pesan Aspirasi |
| Count Up | Angka Statistik Penduduk, Luas Desa, & Total UMKM |
| Infinite Scroll / Ticker | Running Text Pengumuman & Logo Instansi/KKN |
| Aurora / Waves BG | Background Section Visi-Misi & Header Form Aspirasi |

---

## Estimasi Biaya Operasional Bulanan

| Layanan | Plan | Biaya/Bulan |
|---|---|---|
| Vercel | Hobby (Free) | Rp 0 |
| Supabase | Free Tier | Rp 0 |
| OpenStreetMap | Open Source | Rp 0 |
| Cloudinary (opsional) | Free Tier | Rp 0 |
| GitHub | Free | Rp 0 |
| **Total** | | **Rp 0** |
