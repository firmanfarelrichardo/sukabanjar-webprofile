# Database Setup — Website Profil Desa Suka Banjar

## Database Engine

- **Engine:** PostgreSQL 15+ (Supabase Free Tier / Local PostgreSQL)
- **ORM:** Prisma ORM

---

## Connection Configuration

### Environment Variable (`.env.local`)
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public"
```

Jika menggunakan Docker / Local PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Suka Banjar_db?schema=public"
```

---

## Migration & Schema Synchronization

Aplikasi ini menggunakan Prisma ORM untuk mengelola struktur skema tabel.

```sh
# Generate Prisma Client
npx prisma generate

# Push Skema Prisma ke Database (Development)
npx prisma db push

# Opsional: Membuka Prisma Studio (GUI Browser untuk melihat data)
npx prisma studio
```

---

## Initial Data Seeder (Database Seed)

Untuk mengisi data awal (Profil Desa default dan Akun Admin pertama):

```sh
npx prisma db seed
```

---

## Tabel Utama dalam Database

1. `VillageProfile` — Identitas & Visi-Misi Desa
2. `Aspiration` — Pesan Aspirasi & Pengaduan Warga (Simple Text Message Model)
3. `Apparatus` — Perangkat Desa & Struktur Organisasi
4. `Article` — Portal Berita & Pengumuman
5. `Umkm` — Katalog Produk UMKM
6. `Tourism` — Destinasi Wisata
7. `Facility` — Penanda Peta Fasilitas Publik
8. `User` — Akun Admin CMS
