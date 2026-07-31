# Changelog — Website Profil Desa Sukabanjar

Dokumen ini mencatat seluruh riwayat perubahan, pembaruan fitur, perbaikan bug, dan migrasi sistem pada proyek Website Profil Desa Sukabanjar.

---

## [Unreleased / Recent Updates] — 2026-07-31

### 🛠️ Redesign Admin UX: Mode Kelola Visual Desa (In-Context Admin Mode)
- **FIXED (Header Collision):** Mengeliminasi bentrokan visual antara Header Publik dan Sidebar Admin pada rute `/admin`.
- **NEW (Admin Provider & Top Control Bar):** Menambahkan `AdminProvider` di `src/context/AdminContext.tsx` dan bilah kontrol melayang `AdminControlBar.tsx` di bagian paling atas layar.
- **NEW (In-Place Edit Buttons):** Menambahkan tombol `[ ✏️ Edit Bagian Ini ]` pada komponen `HeroSection`, `VisionMissionSection`, dan `HistorySection` yang hanya muncul saat Admin login.
- **NEW (Inline Edit Modal):** Menambahkan `InlineEditModal.tsx` dengan huruf besar, kontras tinggi, dan tombol `[ 💾 Simpan Perubahan ]` hijau mencolok yang sangat ramah pengguna untuk perangkat desa tua maupun muda.
- **NEW (Admin Inbox Modal):** Menambahkan `AdminInboxModal.tsx` untuk membaca dan memoderasi laporan aspirasi warga langsung tanpa perlu navigasi rumit.

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
