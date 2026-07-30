# Coding Conventions — Website Profil Desa Sukabanjar

## Naming Convention

### Files & Folders

| Jenis | Format | Contoh |
|---|---|---|
| Halaman (Page) | `kebab-case` | `aspirasi-pengaduan/page.tsx` |
| Komponen React | `PascalCase` | `HeroBanner.tsx`, `AspirationForm.tsx` |
| Utility / Helper | `camelCase` | `formatDate.ts`, `generateSlug.ts` |
| Hook Custom | `camelCase` (prefix `use`) | `useVillageProfile.ts` |
| API Route | `kebab-case` | `api/village-profile/route.ts` |
| Style Module | `kebab-case` | `hero-banner.module.css` |
| Konstanta | `SCREAMING_SNAKE_CASE` | `API_ENDPOINTS.ts` |

### Variabel & Fungsi

| Jenis | Format | Contoh |
|---|---|---|
| Variabel | `camelCase` | `senderName`, `isAnonymous` |
| Fungsi | `camelCase` | `handleSubmit()`, `fetchArticles()` |
| Komponen React | `PascalCase` | `AspirationForm`, `ArticleCard` |
| Interface / Type | `PascalCase` | `Aspiration`, `VillageProfile` |
| Enum | `PascalCase` | `AspirationCategory` |
| Konstanta | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE`, `ASPIRATION_CATEGORIES` |

### Database (Prisma)

| Jenis | Format | Contoh |
|---|---|---|
| Model | `PascalCase` (singular) | `Aspiration`, `Article`, `Umkm` |
| Field | `camelCase` | `senderName`, `isRead`, `createdAt` |

---

## Folder Structure (Rencana)

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group halaman publik
│   │   ├── page.tsx              # Landing Page
│   │   ├── profil/page.tsx       # Profil Desa
│   │   ├── aspirasi/page.tsx     # Form Aspirasi
│   │   ├── peta/page.tsx         # Peta Interaktif
│   │   ├── umkm/page.tsx         # Katalog UMKM
│   │   ├── wisata/page.tsx       # Listing Wisata
│   │   ├── berita/page.tsx       # Portal Berita
│   │   └── berita/[slug]/page.tsx # Detail Berita
│   │
│   ├── admin/                    # Route group admin CMS
│   │   ├── layout.tsx            # Admin layout (sidebar + auth guard)
│   │   ├── page.tsx              # Dashboard
│   │   ├── profil/page.tsx       # Manajemen Profil Desa
│   │   ├── aspirasi/page.tsx     # Inbox Aspirasi
│   │   ├── berita/page.tsx       # Manajemen Berita
│   │   ├── umkm/page.tsx         # Manajemen UMKM
│   │   ├── wisata/page.tsx       # Manajemen Wisata
│   │   ├── peta/page.tsx         # Manajemen Peta
│   │   └── perangkat/page.tsx    # Manajemen Perangkat Desa
│   │
│   ├── api/                      # API Routes
│   │   ├── village-profile/route.ts
│   │   ├── aspirations/route.ts
│   │   ├── articles/route.ts
│   │   ├── umkm/route.ts
│   │   ├── tourism/route.ts
│   │   ├── facilities/route.ts
│   │   ├── apparatus/route.ts
│   │   └── auth/route.ts
│   │
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Komponen reusable
│   ├── ui/                       # Komponen UI primitif
│   ├── layout/                   # Header, Footer, Sidebar
│   ├── forms/                    # Form components
│   └── sections/                 # Section components (Hero, Stats, dll.)
│
├── lib/                          # Utility & konfigurasi
│   ├── prisma.ts                 # Prisma client instance
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React hooks
│
├── types/                        # TypeScript type definitions
│
└── constants/                    # Konstanta aplikasi
```

---

## Clean Code Rules

### 1. Prinsip Umum
- Setiap file maksimal **300 baris**. Jika lebih, pecah menjadi komponen/modul terpisah.
- Setiap fungsi hanya mengerjakan **satu tugas** (Single Responsibility Principle).
- Gunakan **nama deskriptif** yang jelas tanpa singkatan ambigu.
- Hindari *magic numbers/strings* — gunakan konstanta.

### 2. TypeScript Strict Mode
- Aktifkan `strict: true` di `tsconfig.json`.
- Selalu definisikan tipe data eksplisit untuk parameter fungsi dan return value.
- Hindari penggunaan `any` — gunakan `unknown` jika tipe tidak pasti.

### 3. Komponen React
- Gunakan **functional component** dengan hooks.
- Pisahkan **logic** (hooks/utils) dari **presentasi** (JSX).
- Props yang kompleks harus didefinisikan dengan `interface`.
- Gunakan `React.memo()` untuk komponen yang sering re-render dengan props stabil.

### 4. API Routes
- Validasi input di setiap endpoint.
- Gunakan `try-catch` untuk error handling.
- Return response dengan format konsisten: `{ success, data, error }`.
- Implementasi rate limiting pada endpoint publik (aspirasi).

### 5. Styling
- Prioritaskan Tailwind CSS utility classes.
- Gunakan `@apply` directive untuk pattern yang berulang.
- Responsif: Mobile-first approach (`sm:`, `md:`, `lg:`, `xl:`).

### 6. Git Commit Convention
- Format: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Contoh: `feat(aspirasi): add aspiration form with anonymous option`
