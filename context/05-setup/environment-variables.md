# Environment Variables — Website Profil Desa Suka Banjar

Dokumen ini menjelaskan seluruh variabel lingkungan (*environment variables*) yang digunakan pada aplikasi Website Profil Desa Suka Banjar.

---

## APP CONFIGURATION

### `NEXT_PUBLIC_BASE_URL`
- **Deskripsi:** URL utama aplikasi Next.js.
- **Format:** URL string (misal: `http://localhost:3000` di lokal, `https://Suka Banjar.vercel.app` di production).
- **Default:** `http://localhost:3000`
- **Secret:** Tidak (Public).

---

## DATABASE (Prisma & PostgreSQL)

### `DATABASE_URL`
- **Deskripsi:** Connection string PostgreSQL (Supabase / Local DB).
- **Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
- **Secret:** Ya (Private server-side only).

---

## SUPABASE (Auth & Storage)

### `NEXT_PUBLIC_SUPABASE_URL`
- **Deskripsi:** URL Endpoint Supabase Project.
- **Format:** `https://<project-ref>.supabase.co`
- **Secret:** Tidak (Public client-side).

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Deskripsi:** Public Anonymous Key Supabase untuk request dari browser.
- **Format:** JWT string.
- **Secret:** Tidak (Public client-side).

### `SUPABASE_SERVICE_ROLE_KEY`
- **Deskripsi:** Service Role Key dengan privilege penuh bypass RLS (hanya dipakai di server API route).
- **Format:** JWT string.
- **Secret:** Ya (Private server-side only).

---

## AUTHENTICATION

### `JWT_SECRET`
- **Deskripsi:** Secret key yang digunakan untuk menandatangani dan memverifikasi JWT token Admin.
- **Format:** Random String (minimal 32 karakter).
- **Secret:** Ya (Private server-side only).

---

## DOCKER (Jika Digunakan)

### `COMPOSE_PROJECT_NAME`
- **Deskripsi:** Nama project Docker Compose.
- **Default:** `Suka Banjar_webprofile`

### `APP_PORT`
- **Deskripsi:** Port host yang diekspos untuk Next.js application.
- **Default:** `3000`

### `DB_PORT`
- **Deskripsi:** Port host yang diekspos untuk PostgreSQL container.
- **Default:** `5432`
