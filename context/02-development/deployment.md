# Deployment — Website Profil Desa Sukabanjar

## Environment

### Development

| Variabel | Deskripsi |
|---|---|
| `DATABASE_URL` | Connection string Supabase PostgreSQL (dev) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `JWT_SECRET` | Secret key untuk JWT token auth |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` |

### Production

| Variabel | Deskripsi |
|---|---|
| `DATABASE_URL` | Connection string Supabase PostgreSQL (prod) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (prod) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (prod) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (prod) |
| `JWT_SECRET` | Secret key untuk JWT token auth (prod) |
| `NEXT_PUBLIC_BASE_URL` | `https://<domain>.vercel.app` |

---

## Infrastructure

### Vercel (Hosting & CI/CD)

- **Plan:** Hobby Plan (Free)
- **Build Command:** `npx prisma generate && next build`
- **Output Directory:** `.next`
- **Node.js Version:** 18.x / 20.x
- **Region:** Automatic (nearest)

### Supabase (Database & Storage)

- **Plan:** Free Tier
- **Database:** PostgreSQL 15+
- **Storage Limit:** 500MB database + 1GB file storage
- **Auth:** Email/Password (untuk admin)

---

## CI/CD Pipeline (Vercel + GitHub)

```
[Developer] ──push──► [GitHub Repository]
                              │
                              ▼
                    [Vercel Auto-Deploy]
                              │
                    ┌─────────┼─────────┐
                    ▼                   ▼
            [Preview Build]      [Production Build]
            (PR / Branch)        (main branch)
                    │                   │
                    ▼                   ▼
            [Preview URL]        [Production URL]
            (*.vercel.app)       (<domain>.vercel.app)
```

### Workflow

1. Developer push kode ke branch fitur di GitHub
2. Vercel otomatis membuat **Preview Deployment** untuk setiap PR
3. Setelah PR di-merge ke `main`, Vercel membuat **Production Deployment**
4. SSL/HTTPS otomatis terpasang di semua deployment

---

## Deployment Steps

### 1. Setup Awal

```bash
# Clone repository
git clone https://github.com/<username>/sukabanjar-webprofile.git
cd sukabanjar-webprofile

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan kredensial Supabase

# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed data awal (opsional)
npx prisma db seed

# Run development server
npm run dev
```

### 2. Deploy ke Vercel

```bash
# Install Vercel CLI (opsional)
npm i -g vercel

# Login
vercel login

# Deploy (production)
vercel --prod
```

**Atau via Dashboard:**
1. Buka [vercel.com](https://vercel.com)
2. Import repository GitHub
3. Set environment variables di project settings
4. Klik Deploy

### 3. Post-Deployment Checklist

- [ ] Environment variables sudah di-set di Vercel dashboard
- [ ] Prisma schema sudah di-push ke Supabase database
- [ ] Storage bucket sudah dibuat di Supabase (untuk foto)
- [ ] Admin user sudah di-seed ke database
- [ ] SSL/HTTPS aktif
- [ ] Custom domain (opsional) sudah dikonfigurasi
- [ ] Google Lighthouse test > 90

---

## Rollback

Vercel menyimpan seluruh deployment history. Untuk rollback:

1. Buka dashboard Vercel → Project → Deployments
2. Cari deployment sebelumnya yang stabil
3. Klik **"Promote to Production"**
4. Deployment lama langsung aktif kembali tanpa rebuild

---

## Monitoring

| Aspek | Tool |
|---|---|
| Performance | Vercel Analytics (built-in) |
| Error Tracking | Vercel Error Logs |
| Database | Supabase Dashboard (query stats, storage usage) |
| Uptime | Vercel Status Page |
