# Local Development Setup — Website Profil Desa Sukabanjar

## Prerequisites

- Node.js 18.x atau 20.x LTS
- npm (v9.x atau v10.x) atau pnpm / yarn
- Git
- PostgreSQL 15+ (lokal atau instance Supabase Free Tier)

---

## Docker Runtime (Jika Digunakan)

Jika project menggunakan Docker untuk pengetesan lokal:

```sh
# Jalankan container lokal
docker compose up -d --build

# Generate Prisma Client & Run Migration
docker compose exec app npx prisma generate
docker compose exec app npx prisma db push
```

*(Catatan: Jika tidak menggunakan Docker lokal, ikuti alur non-Docker di bawah ini).*

---

## Clone Repository

```sh
git clone https://github.com/<username>/sukabanjar-webprofile.git
cd sukabanjar-webprofile
```

---

## Install Dependencies

```sh
npm install
```

---

## Environment Setup

Salin file contoh environment variables ke file `.env.local`:

```sh
cp .env.example .env.local
```

Edit `.env.local` dan sesuaikan kredensial Supabase PostgreSQL & API keys:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
JWT_SECRET="super-secret-jwt-key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## Prisma Database Setup

```sh
# Generate Prisma Client (Type Definitions)
npx prisma generate

# Synchronize Schema to Database
npx prisma db push

# Seed Initial Data (Admin user & initial Village Profile)
npx prisma db seed
```

---

## Run Application (Development Server)

```sh
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## Verification

- Buka `http://localhost:3000` di browser → Halaman Landing Page muncul tanpa error.
- Buka `http://localhost:3000/admin/login` → Form Login Admin dapat diakses.
- Form E-Aspirasi (`http://localhost:3000/aspirasi`) dapat memuat formulir pesan.
