# 🌐 Panduan Lengkap SEO & Indexing Google untuk Website Desa (Next.js & Vercel)

Panduan ini disusun secara bertahap dan mudah dipahami oleh pemula untuk mendaftarkan website resmi **Desa Suka Banjar** (`https://desasukabanjar.vercel.app`) berbasis **Next.js (App Router)** yang di-hosting di **Vercel** ke **Google Search Console**, hingga website berhasil terindeks dan muncul pada hasil pencarian Google.

---

## 📑 Daftar Isi
1. [Persiapan Awal](#1-persiapan-awal)
2. [Membuat File robots.txt](#2-membuat-file-robotstxt)
3. [Membuat File sitemap.xml](#3-membuat-file-sitemapxml)
4. [Menambahkan Metadata SEO Dasar](#4-menambahkan-metadata-seo-dasar)
5. [Deploy Ulang Perubahan ke Vercel](#5-deploy-ulang-perubahan-ke-vercel)
6. [Verifikasi robots.txt dan sitemap.xml Publik](#6-verifikasi-robotstxt-dan-sitemapxml-publik)
7. [Mendaftarkan Website ke Google Search Console](#7-mendaftarkan-website-ke-google-search-console)
8. [Mengirim Sitemap ke Google](#8-mengirim-sitemap-ke-google)
9. [Meminta Google Mengindeks Website (Request Indexing)](#9-meminta-google-mengindeks-website-request-indexing)
10. [Cara Mengecek Website yang Sudah Terindeks](#10-cara-mengecek-website-yang-sudah-terindeks)
11. [Estimasi Waktu & Faktor Indexing](#11-estimasi-waktu--faktor-indexing)
12. [Troubleshooting & Solusi Masalah Umum](#12-troubleshooting--solusi-masalah-umum)
13. [Checklist Akhir](#13-checklist-akhir)

---

## 1. Persiapan Awal

Sebelum mendaftarkan website ke Google, pastikan website memenuhi persyaratan dasar berikut agar robot perayap Google (*Googlebot*) dapat membaca konten dengan lancar.

### Syarat Wajib Website:
1. **Dapat Diakses Secara Publik**: Website sudah aktif (*Live*) di internet pada alamat `https://desasukabanjar.vercel.app` dan tidak memerlukan login khusus/kata sandi jaringan untuk membukanya.
2. **Tidak Mengalami Error 500 / Blank Screen**: Setiap halaman utama memberikan kode status HTTP `200 OK`.
3. **Bebas Tag Pembatas Indeks**: Pastikan tidak ada kode `<meta name="robots" content="noindex" />` pada halaman publik.

### Cara Memeriksa:
- Buka browser Anda dalam **Mode Samaran (Incognito / Private Window)**.
- Buka alamat website: `https://desasukabanjar.vercel.app`
- Pastikan halaman beranda, profil desa, berita, dan layanan lainnya terbuka dengan cepat dan tanpa pesan error.

---

## 2. Membuat File robots.txt

### Apa itu robots.txt?
`robots.txt` adalah file teks sederhana yang dibaca pertama kali oleh Googlebot saat mengunjungi website Anda. File ini memberitahu mesin pencari halaman mana saja yang **boleh dijelajahi** (*allow*) dan halaman mana yang **tidak boleh dijelajahi** (*disallow*, seperti folder admin atau endpoint API pribadi).

### Cara Terbaik di Next.js App Router:
Next.js menyediakan cara otomatis yang sangat praktis melalui pembuatan file **`src/app/robots.ts`**.

Lokasi file:  
📁 `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Domain utama website resmi Desa Suka Banjar
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desasukabanjar.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/api/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

> **Keunggulan Metode Ini**: Next.js akan otomatis meng-generate rute publik `https://desasukabanjar.vercel.app/robots.txt` secara dinamis tanpa perlu membuat file teks manual di folder `public`.

---

## 3. Membuat File sitemap.xml

### Apa itu sitemap.xml?
`sitemap.xml` adalah peta hierarki seluruh halaman website Anda. File ini membantu Google menemukan seluruh artikel, galeri, produk UMKM, dan halaman penting di website desa dalam satu daftar terstruktur.

### Pilihan 1: Menggunakan Bawaan Next.js App Router (Sangat Direkomendasikan & Paling Sederhana)
Tanpa perlu menginstal package tambahan, gunakan file:  
📁 `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desasukabanjar.vercel.app';
  const currentDate = new Date();

  // Daftar rute statis halaman website desa
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/profil',
    '/statistik',
    '/berita',
    '/galeri',
    '/umkm',
    '/wisata',
    '/peta',
    '/aspirasi',
    '/kkn',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency:
      route === '' || route === '/berita' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Daftar rute artikel berita dinamis dari database
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { isDraft: false },
      select: { slug: true, updatedAt: true, createdAt: true },
      take: 100,
    });

    articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/berita/${art.slug}`,
      lastModified: art.updatedAt || art.createdAt || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.warn('Error fetching articles for sitemap:', err);
  }

  return [...staticRoutes, ...articleRoutes];
}
```

---

### Pilihan 2: Menggunakan Package `next-sitemap` (Opsi Tambahan)
Jika di kemudian hari website memiliki ribuan artikel dinamis dan ingin di-generate otomatis saat proses build:

1. **Install Package**:
   ```bash
   npm install next-sitemap
   ```
2. **Buat file konfigurasi `next-sitemap.config.js` di root folder project**:
   ```javascript
   /** @type {import('next-sitemap').IConfig} */
   module.exports = {
     siteUrl: process.env.SITE_URL || 'https://desasukabanjar.vercel.app',
     generateRobotsTxt: true,
     exclude: ['/admin/*', '/api/*'],
     robotsTxtOptions: {
       policies: [
         { userAgent: '*', allow: '/' },
         { userAgent: '*', disallow: ['/admin', '/api'] },
       ],
     },
   };
   ```
3. **Tambahkan script di `package.json`**:
   ```json
   "scripts": {
     "postbuild": "next-sitemap"
   }
   ```

---

## 4. Menambahkan Metadata SEO Dasar

Google membaca judul (*Title*), ringkasan (*Description*), serta gambar pratinjau (*Open Graph / OG Image*) dari metadata halaman website Anda.

Buka file:  
📁 `src/app/layout.tsx`

Konfigurasi objek `metadata` yang telah terpasang:

```typescript
import type { Metadata } from 'next';
import { SITE_INFO } from '@/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desasukabanjar.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [
    'Desa Suka Banjar',
    'Profil Desa Suka Banjar',
    'Sidomulyo',
    'Lampung Selatan',
    'Pemerintah Desa Suka Banjar',
    'UMKM Desa Suka Banjar',
    'Galeri Desa',
    'Aspirasi Warga',
    'Peta Fasilitas',
    'Statistik Kependudukan',
  ],
  authors: [{ name: 'Pemerintah Desa Suka Banjar' }],
  creator: 'Pemerintah Desa Suka Banjar',
  publisher: 'Pemerintah Desa Suka Banjar',
  
  // Open Graph (Untuk Tampilan Share di WhatsApp, Facebook, Telegram, dll.)
  openGraph: {
    title: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    description: SITE_INFO.description,
    url: baseUrl,
    type: 'website',
    locale: 'id_ID',
    siteName: SITE_INFO.name,
    images: [
      {
        url: '/images/logos/logo_desa_sipdeskel.jpg',
        width: 1200,
        height: 630,
        alt: 'Logo & Banner Resmi Desa Suka Banjar',
      },
    ],
  },

  // Pengaturan Robot Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

---

## 5. Deploy Ulang Perubahan ke Vercel

Setelah menambahkan file `robots.ts`, `sitemap.ts`, dan metadata SEO di `layout.tsx`, simpan dan kirim perubahan ke repository GitHub:

1. Buka terminal di project Anda, lalu jalankan:
   ```bash
   git add .
   git commit -m "feat: setup robots.txt, sitemap.xml, dan metadata SEO Google desasukabanjar.vercel.app"
   git push origin main
   ```
2. Buka dashboard [Vercel Dashboard](https://vercel.com/dashboard).
3. Pastikan proses **Deployment** selesai dengan status **Ready** (ikon centang hijau).

---

## 6. Verifikasi robots.txt dan sitemap.xml Publik

Sebelum mendaftar ke Google Search Console, lakukan verifikasi mandiri di browser Anda:

### 1. Periksa robots.txt
- Buka tautan: `https://desasukabanjar.vercel.app/robots.txt`
- **Hasil yang benar**: Muncul teks polos yang memuat:
  ```text
  User-Agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/admin/
  Disallow: /api/auth/

  Sitemap: https://desasukabanjar.vercel.app/sitemap.xml
  ```

### 2. Periksa sitemap.xml
- Buka tautan: `https://desasukabanjar.vercel.app/sitemap.xml`
- **Hasil yang benar**: Muncul struktur XML rapi berisi daftar URL halaman website Anda (`https://desasukabanjar.vercel.app/`, `/profil`, `/berita`, `/statistik`, `/umkm`, dll).

---

## 7. Mendaftarkan Website ke Google Search Console

Google Search Console (GSC) adalah alat resmi dari Google untuk memantau keberadaan dan indeks website Anda di hasil pencarian.

### Langkah demi Langkah:

1. **Buka Google Search Console**:
   - Kunjungi [https://search.google.com/search-console](https://search.google.com/search-console)
   - Masuk (*Login*) menggunakan akun Google resmi desa atau pengelola website.

2. **Tambahkan Properti (Add Property)**:
   - Klik menu dropdown properti di kiri atas, lalu pilih **+ Tambahkan properti (+ Add property)**.
   - Pada pop-up yang muncul, pilih opsi di sebelah kanan: **Awalan URL (URL Prefix)**.
   - Masukkan URL lengkap website:
     ```
     https://desasukabanjar.vercel.app
     ```
   - Klik tombol **Terus (Continue)**.

3. **Verifikasi Kepemilikan (Paling Mudah untuk Next.js / Vercel)**:
   - Pada metode verifikasi, pilih **Tag HTML (HTML tag)**.
   - Google akan memberikan sebaris kode meta seperti:
     ```html
     <meta name="google-site-verification" content="KODE_UNIK_DARI_GOOGLE" />
     ```
   - Salin nilai `KODE_UNIK_DARI_GOOGLE` tersebut.
   - Buka file `src/app/layout.tsx` pada project Anda, lalu tambahkan field `verification` di dalam objek `metadata`:
     ```typescript
     export const metadata: Metadata = {
       // ... metadata lainnya
       verification: {
         google: 'KODE_UNIK_DARI_GOOGLE',
       },
     };
     ```
   - Commit & Push ke GitHub (`git add . && git commit -m "chore: add google site verification" && git push`).
   - Tunggu Vercel selesai melakukan deploy (sekitar 30-60 detik).
   - Kembali ke layar Google Search Console, lalu klik tombol **Verifikasi (Verify)**.
   - Akan muncul notifikasi hijau: **"Kepemilikan diverifikasi" (Ownership verified)**.

---

## 8. Mengirim Sitemap ke Google

Setelah properti terverifikasi, kirim sitemap agar Googlebot mengetahui seluruh rute website Anda secara menyeluruh:

1. Pada menu navigasi sidebar sebelah kiri Google Search Console, klik menu **Peta Situs (Sitemaps)**.
2. Di bagian **Tambahkan peta situs baru (Add a new sitemap)**, masukkan teks:
   ```
   sitemap.xml
   ```
3. Klik tombol **Kirim (Submit)**.
4. Tunggu beberapa saat lalu refresh halaman.
5. Pastikan status pada kolom *Status* berubah menjadi **Berhasil (Success)** berwarna hijau.

---

## 9. Meminta Google Mengindeks Website (Request Indexing)

Untuk mempercepat Google memproses halaman beranda website baru tanpa harus menunggu antrean perayapan rutin mingguan:

1. Di bagian atas Google Search Console, cari bilah pencarian **"Periksa URL apa pun di [domain]" (URL Inspection)**.
2. Ketikkan URL beranda website Anda:
   ```
   https://desasukabanjar.vercel.app/
   ```
   Lalu tekan tombol **Enter**.
3. Google akan memeriksa URL tersebut. Karena website baru, biasanya status awal adalah *"URL tidak ada di Google"* (URL is not on Google).
4. Klik tombol **Uji URL Langsung (Test Live URL)** di sebelah kanan atas.
5. Setelah pengujian berhasil dan menghasilkan centang hijau, klik tombol **Minta Pengindeksan (Request Indexing)**.
6. Lakukan langkah yang sama untuk beberapa halaman penting lainnya:
   - `https://desasukabanjar.vercel.app/profil`
   - `https://desasukabanjar.vercel.app/berita`
   - `https://desasukabanjar.vercel.app/statistik`
   - `https://desasukabanjar.vercel.app/umkm`
   - `https://desasukabanjar.vercel.app/aspirasi`

---

## 10. Cara Mengecek Website yang Sudah Terindeks

Setelah meminta pengindeksan, Anda dapat mengecek status apakah website sudah masuk ke database pencarian Google dengan 2 cara:

### Cara 1: Menggunakan Perintah Pencarian `site:`
Buka Google Search ([google.com](https://www.google.com)), lalu ketikkan perintah khusus:

```
site:desasukabanjar.vercel.app
```

Jika website sudah terindeks, Google akan menampilkan seluruh daftar halaman website Anda pada hasil pencarian.

### Cara 2: Mencari Berdasarkan Kata Kunci Nama Desa
Ketikkan nama resmi desa Anda di kolom pencarian Google:
```
Desa Suka Banjar Sidomulyo Lampung Selatan
```
Website Anda akan muncul di hasil pencarian teratas dengan judul dan deskripsi yang telah diatur pada metadata.

---

## 11. Estimasi Waktu & Faktor Indexing

### Estimasi Waktu:
- **Pengindeksan Awal (URL Inspection Request)**: Biasanya membutuhkan waktu antara **1 hingga 7 hari kerja**.
- **Indeks Seluruh Halaman Sitemap**: Biasanya membutuhkan waktu antara **1 hingga 2 minggu**.

### Faktor yang Mempengaruhi Kecepatan Indexing:
1. **Umur Domain**: Domain baru membutuhkan waktu pengenalan oleh algoritma Google.
2. **Kestabilan Server**: Hosting Vercel memiliki uptime 99.99% dan response time cepat (sangat disukai oleh Googlebot).
3. **Konten Orisinal**: Informasi desa yang lengkap, unik, dan bermanfaat bagi masyarakat mempercepat validasi kualitas oleh Google.
4. **Tautan Eksternal (Backlink)**: Menyertakan link `https://desasukabanjar.vercel.app` di media sosial resmi (Facebook, Instagram, YouTube Desa) akan sangat mempercepat Googlebot menemukan website Anda.

---

## 12. Troubleshooting & Solusi Masalah Umum

| Masalah | Penyebab Umum | Solusi Praktis |
| :--- | :--- | :--- |
| **Sitemap berstatus "Tidak dapat diambil" (Couldn't fetch)** | Googlebot belum sempat mengambil file atau URL salah ketik | Pastikan saat mengetik di GSC hanya menuliskan `sitemap.xml`. Coba klik ulang tombol submit atau tunggu 1x24 jam. |
| **Robots.txt memblokir halaman** | Terdapat baris `Disallow: /` | Buka `src/app/robots.ts`, pastikan baris `allow: '/'` aktif dan hanya memblokir folder `/admin/`. |
| **Status "Ditemukan - saat ini tidak diindeks" (Discovered - currently not indexed)** | Halaman sudah masuk antrean perayap Google namun belum diproses | Masuk ke menu *Inspeksi URL*, klik *Uji URL Langsung*, lalu klik *Minta Pengindeksan*. |
| **Metadata pratinjau WhatsApp/Google tidak berubah** | Cache browser atau cache server lama masih tersimpan | Lakukan deploy ulang di Vercel, lalu gunakan alat [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) untuk membersihkan cache Open Graph. |

---

## 13. Checklist Akhir

Gunakan daftar periksa di bawah ini untuk memastikan seluruh tahapan telah selesai dengan sempurna:

- [ ] **Website Online**: Website aktif pada `https://desasukabanjar.vercel.app` dan dapat diakses dari browser mode incognito.
- [ ] **robots.txt Tersedia**: URL `https://desasukabanjar.vercel.app/robots.txt` dapat dibuka dan valid.
- [ ] **sitemap.xml Tersedia**: URL `https://desasukabanjar.vercel.app/sitemap.xml` menampilkan daftar halaman website.
- [ ] **Metadata SEO Terpasang**: `title`, `description`, `keywords`, dan `openGraph` sudah diatur di `src/app/layout.tsx`.
- [ ] **Deploy Vercel Berhasil**: Status deployment di Vercel Dashboard berwarna hijau (*Ready*).
- [ ] **Google Search Console Terhubung**: Properti `https://desasukabanjar.vercel.app` berhasil diverifikasi kepemilikannya.
- [ ] **Sitemap Berhasil Dikirim**: `sitemap.xml` berstatus *Success* di menu Peta Situs GSC.
- [ ] **Request Indexing Selesai**: Beranda dan halaman utama telah diajukan melalui fitur *Inspeksi URL*.
- [ ] **Uji Pencarian Google**: Perintah `site:desasukabanjar.vercel.app` dicoba secara berkala.

---

*Dokumen ini dirancang sebagai panduan resmi setup SEO website desa Suka Banjar.*
