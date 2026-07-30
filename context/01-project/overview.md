# Overview — Website Profil & Portal Digital Desa Sukabanjar

## Ringkasan Project

Website Profil & Portal Informasi Digital Desa Sukabanjar adalah sebuah platform web yang dibangun sebagai bagian dari Program Kerja (Progja) Kuliah Kerja Nyata (KKN). Platform ini bertujuan menyajikan profil desa, potensi UMKM, destinasi wisata, struktur pemerintahan, serta menyediakan kanal aspirasi dan pengaduan digital bagi warga secara efisien, modern, dan sepenuhnya gratis dalam operasional bulanan.

---

## Stakeholder

| Stakeholder | Peran | Deskripsi |
|---|---|---|
| **Perangkat Desa (Admin Desa)** | Pengelola Konten (CMS Admin) | Mengelola seluruh konten website melalui Panel Admin, termasuk membaca & mengelola Inbox Aspirasi warga. |
| **Warga Desa / Wisatawan (User Publik)** | Pengunjung / Pengirim Aspirasi | Mengakses informasi desa, UMKM, wisata, berita, peta, dan menyampaikan pesan aspirasi/pengaduan. |
| **Tim KKN** | Pengembang & Pendamping | Membangun, menguji, dan melakukan serah terima website kepada Perangkat Desa. |

---

## Tujuan Sistem

1. **Digitalisasi Informasi Desa:** Menyajikan data profil, potensi UMKM, destinasi wisata, serta struktur pemerintahan desa secara dinamis, menarik, dan mudah diakses.
2. **Kanal Aspirasi Publik:** Menyediakan sarana digital berbasis pengiriman pesan (seperti email) bagi warga untuk menyampaikan aspirasi, saran, atau pengaduan secara cepat, aman, dan praktis.
3. **Pemetaan Fasilitas Publik:** Menampilkan lokasi bangunan dan fasilitas penting desa berbasis peta interaktif tanpa biaya lisensi API Key.
4. **Kearsipan Digital:** Menyediakan modul artikel, berita, dan pengumuman kegiatan desa maupun program KKN secara teratur.
5. **Kemandirian Pengelolaan (CMS Dinamis):** Memastikan seluruh konten website (termasuk Visi & Misi) dapat diubah oleh Perangkat Desa secara mandiri melalui Panel Admin.

---

## Ruang Lingkup

### In Scope

- Halaman profil desa (sejarah, visi-misi, demografi, struktur organisasi)
- Modul E-Aspirasi & Pengaduan Warga (pengiriman pesan teks langsung)
- Peta Interaktif Bangunan & Fasilitas Penting (Leaflet.js + OpenStreetMap)
- Katalog UMKM & Potensi Desa
- Listing Destinasi Wisata
- Portal Berita, Artikel & Pengumuman
- Panel Admin CMS (Full Dynamic)
- Inbox Pesan Aspirasi pada Panel Admin

### Out of Scope

- Sistem e-commerce / transaksi online
- Sistem login untuk warga/user publik
- Generator tiket/resi untuk aspirasi
- Fitur cek status aspirasi oleh warga
- Integrasi notifikasi WhatsApp/SMS untuk aspirasi
- Aplikasi mobile native
- Multi-bahasa (i18n)

---

## Indikator Keberhasilan (Key Results)

| Indikator | Target |
|---|---|
| Biaya Pemeliharaan | Rp 0/bulan (Free Tier Infrastructure) |
| Performa Website | Skor Google Lighthouse > 90 (Performance, Accessibility, SEO) |
| Kemudahan Operasional | Admin dapat mengelola konten & membaca aspirasi dalam < 5 menit |
