# Changelog — Website Profil Desa Suka Banjar

Dokumen ini mencatat seluruh riwayat perubahan, pembaruan fitur, perbaikan bug, dan migrasi sistem pada proyek Website Profil Desa Suka Banjar.

---

## [1.1.0] — 2026-08-30

### ✨ Fitur Baru & Peningkatan Sistem (Modul 06)
- **NEW (Panduan Lengkap SEO & Google Indexing):** Menyusun file dokumentasi resmi [`SEO_GUIDE.md`](file:///c:/laragon/www/sukabanjar-webprofile/context/05-setup/SEO_GUIDE.md) yang mencakup 13 bab persiapan, pembuatan robots.txt, sitemap.xml, metadata, hingga verifikasi Google Search Console menggunakan URL produksi resmi `https://desasukabanjar.vercel.app`.
- **NEW (Otomasi Robots & Sitemap):** Menambahkan [`src/app/robots.ts`](file:///c:/laragon/www/sukabanjar-webprofile/src/app/robots.ts) dan [`src/app/sitemap.ts`](file:///c:/laragon/www/sukabanjar-webprofile/src/app/sitemap.ts) berbasis URL resmi `https://desasukabanjar.vercel.app`.
- **NEW (Layout 2 Baris Horizontal Scroll / Swipe & Modal Pop Up):** Memperbarui tampilan aparatur desa di beranda dengan format **tepat 2 baris vertikal** yang dapat di-scroll/swipe secara horizontal (`grid-rows-2 grid-flow-col auto-cols-[...]`) dilengkapi tombol geser navigasi kiri & kanan, serta integrasi [`OfficialBiodataModal.tsx`](file:///c:/laragon/www/sukabanjar-webprofile/src/components/ui/OfficialBiodataModal.tsx) untuk menampilkan pop-up biodata instan.
- **NEW (Biodata Aparatur & Halaman Profil Khusus):** Menambahkan field TTL, Jenis Kelamin, Alamat, dan Deskripsi Pengabdian pada model `Apparatus`, membuat API [`/api/apparatus/[id]`](file:///c:/laragon/www/sukabanjar-webprofile/src/app/api/apparatus/[id]/route.ts) dan halaman publik interaktif [`/aparatur/[id]`](file:///c:/laragon/www/sukabanjar-webprofile/src/app/aparatur/[id]/page.tsx).
- **IMPROVED (Format Kalender Tanggal Lahir):** Mengubah input tanggal lahir di admin menjadi kalender interaktif (`type="date"`) dan memformat tampilan publik ke format waktu kalender Indonesia yang rapi (contoh: `12 Mei 1980`).
- **NEW (Embed Google Maps Baru):** Memperbarui titik koordinat resmi Kantor Desa Suka Banjar pada `Footer.tsx`.
- **IMPROVED (Presisi Edit Manual SIPDeskel):** Arsitektur *Dual Persistence* (In-Memory + PostgreSQL Upsert) pada `src/app/api/statistik/route.ts` dan `AdminSipdeskelTab.tsx` untuk sinkronisasi akurat Dusun, RW, dan RT.
- **IMPROVED (Splash Screen Centering & Responsiveness):** Menyelaraskan posisi tengah presisi (vertikal & horizontal) pada `IntroSplashOverlay.tsx`, menyinkronkan logo desa resmi dari SIPDeskel (`useVillageProfile`), dan memperbaiki aspek rasio logo di seluruh perangkat.
- **DATABASE (Schema Migration):** Menambahkan kolom `birthPlace`, `birthDate`, `gender`, `address`, `description` pada tabel `Apparatus` serta membuat tabel `DemografiDusun`, `DemografiUsia`, `DemografiPendidikan`, `DemografiPekerjaan`, dan `SyncLog`.

---

## [1.0.0] — 2026-07-31

### 🚀 Peluncuran Seluruh Modul (Modul 0 s.d. Modul 8)
- **Modul 0:** Core Foundation, Layout, & Theme Centralized (`src/lib/theme.ts`).
- **Modul 1:** Landing Page (`/`) dengan Hero Banner, Announcement Ticker, Quick Access, CountUp Stats, Artikel & UMKM Preview.
- **Modul 2:** Informasi & Profil Desa (`/profil`) dengan Sejarah, Visi-Misi, Perangkat Desa, Grafik Demografi.
- **Modul 3:** E-Aspirasi & Pengaduan Warga (`/aspirasi`) dengan formulir pengaduan direct, opsi anonim, notifikasi sukses, dan FAQ.
- **Modul 4:** Peta Interaktif Fasilitas (`/peta`) dengan Leaflet.js custom markers & petunjuk rute Google Maps.
- **Modul 5:** Katalog UMKM Desa (`/umkm`) dengan live search, filter kategori, dan tombol order WhatsApp direct.
- **Modul 6:** Destinasi Wisata Desa (`/wisata`) dengan card destinasi alam & panduan etika berkunjung.
- **Modul 7:** Portal Berita & Pengumuman (`/berita` & `/berita/[slug]`) dengan detail pembacaan ber-slug dan tombol share media sosial.
- **Modul 8:** Admin CMS Autentikasi (`/admin/login`) dengan password hashing `bcryptjs`.
