# Troubleshooting & Common Issues — Website Profil Desa Sukabanjar

## 1. Prisma Client Not Found / Invalid Import

**Gejala:** Error `Cannot find module '@prisma/client'` saat menjalankan aplikasi.

**Solusi:**
```sh
npx prisma generate
```

---

## 2. Leaflet Window is Not Defined (SSR Error)

**Gejala:** Error `ReferenceError: window is not defined` saat memuat halaman peta interaktif.

**Solusi:**
Pastikan komponen Leaflet di-import secara dinamis di Next.js dengan opsi `ssr: false`:

```typescript
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  { ssr: false }
);
```

---

## 3. Database Connection Refused / Timeout

**Gejala:** Error `PrismaClientInitializationError: Can't reach database server`.

**Solusi:**
1. Periksa variabel `DATABASE_URL` di `.env.local`.
2. Jika menggunakan Supabase Cloud, pastikan kuota database belum mencapai batas dan status Supabase project aktif (*Active*).
3. Jika menggunakan Docker/PostgreSQL lokal, pastikan service PostgreSQL berjalan (`docker compose ps` / `sudo service postgresql status`).

---

## 4. File Upload Fail (Supabase Storage Error)

**Gejala:** Gagal mengunggah foto bukti aspirasi, foto berita, atau foto UMKM.

**Solusi:**
1. Pastikan bucket storage (misal: `sukabanjar-assets`) sudah dibuat di Supabase Dashboard.
2. Periksa RLS (Row Level Security) kebijakan storage agar mengizinkan publik upload (untuk bukti aspirasi) atau admin upload.

---

## 5. Next.js Image Optimization Error (External Domain)

**Gejala:** Error `Invalid src prop on next/image, hostname is not configured under images in next.config.js`.

**Solusi:**
Tambahkan domain hostname (Supabase / Cloudinary) ke file `next.config.js`:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};
```
