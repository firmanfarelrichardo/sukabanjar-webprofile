# Frontend & UI Design System — Desa Suka Banjar

> Dokumen referensi lengkap untuk seluruh aspek visual frontend: palet warna, tipografi, spacing, komponen, animasi, dan pedoman responsif.

---

## 1. Color Palette

### Primary — Hijau Alam Desa
Warna utama yang merepresentasikan nuansa alam pedesaan, kesuburan, dan pertumbuhan.

| Token | HEX | Kegunaan |
|-------|-----|----------|
| `primary-50` | `#f0fdf4` | Background state hover, highlight ringan |
| `primary-100` | `#dcfce7` | Background badge, tag, alert sukses |
| `primary-200` | `#bbf7d0` | Border aktif, outline ringan |
| `primary-300` | `#86efac` | Ikon dekoratif, indikator |
| `primary-400` | `#4ade80` | Gradient hero text, aksen terang |
| `primary-500` | `#22c55e` | **Warna utama** — tombol, link aktif, ikon utama |
| `primary-600` | `#16a34a` | Tombol hover, nav link aktif |
| `primary-700` | `#15803d` | Tombol pressed, teks tebal |
| `primary-800` | `#166534` | Heading gelap, elemen kontras |
| `primary-900` | `#14532d` | Background gelap, footer aksen |
| `primary-950` | `#052e16` | Background hero section gelap |

### Accent — Emas Hangat
Warna aksen untuk elemen penting, CTA sekunder, dan penekanan visual.

| Token | HEX | Kegunaan |
|-------|-----|----------|
| `accent-50` | `#fffbeb` | Background tooltip, notifikasi |
| `accent-100` | `#fef3c7` | Background badge warning |
| `accent-200` | `#fde68a` | Highlight teks, star rating |
| `accent-300` | `#fcd34d` | Ikon dekoratif, ornamen |
| `accent-400` | `#fbbf24` | Badge harga, status |
| `accent-500` | `#f59e0b` | **Warna aksen utama** — CTA sekunder, highlight |
| `accent-600` | `#d97706` | Tombol aksen hover |
| `accent-700` | `#b45309` | Teks aksen gelap |
| `accent-800` | `#92400e` | Heading aksen |
| `accent-900` | `#78350f` | Background aksen gelap |

### Neutral — Slate
Warna netral untuk teks, background, border, dan elemen UI umum.

| Token | HEX | Kegunaan |
|-------|-----|----------|
| `slate-50` | `#f8fafc` | Background halaman, surface |
| `slate-100` | `#f1f5f9` | Background card, border ringan |
| `slate-200` | `#e2e8f0` | Border default, separator |
| `slate-300` | `#cbd5e1` | Scrollbar, placeholder |
| `slate-400` | `#94a3b8` | Teks sekunder, caption |
| `slate-500` | `#64748b` | Teks helper, subtitle |
| `slate-600` | `#475569` | Teks body, nav link default |
| `slate-700` | `#334155` | Teks kuat, label |
| `slate-800` | `#1e293b` | Heading, teks utama |
| `slate-850` | `#172033` | Footer border gelap |
| `slate-900` | `#0f172a` | **Foreground utama**, heading, footer bg |
| `slate-925` | `#0d1526` | Background gelap alternatif |
| `slate-950` | `#080f1e` | Background paling gelap |

### CSS Custom Properties (Design Tokens)

```css
:root {
  --background: #ffffff;     /* Background halaman */
  --foreground: #0f172a;     /* Warna teks utama */
  --surface: #f8fafc;        /* Background section abu muda */
  --surface-elevated: #ffffff; /* Card / elevated surface */
  --border: #e2e8f0;         /* Border default */
  --border-light: #f1f5f9;   /* Border sangat ringan */
  --navbar-height: 4rem;     /* Tinggi navbar */
}
```

### Gradien yang Digunakan

| Nama | Kelas Tailwind | Konteks |
|------|----------------|---------|
| Hero Background | `from-slate-900 via-slate-800 to-primary-950` | Background hero section |
| Hero Text | `from-primary-400 via-emerald-300 to-accent-400` | Judul hero "Desa Suka Banjar" |
| Logo Badge | `from-primary-500 to-primary-700` | Logo placeholder di navbar & footer |
| Gradient Text | `.gradient-text` → `from-primary-600 via-primary-500 to-accent-500` | Heading dekoratif |

### Warna per Modul (Quick Access Icons)

| Modul | Gradien Ikon |
|-------|-------------|
| Profil Desa | `from-emerald-500 to-green-600` |
| Aspirasi Warga | `from-blue-500 to-indigo-600` |
| Peta Fasilitas | `from-amber-500 to-orange-600` |
| UMKM Desa | `from-rose-500 to-pink-600` |
| Wisata Desa | `from-teal-500 to-cyan-600` |
| Berita & Artikel | `from-violet-500 to-purple-600` |

---

## 2. Tipografi

### Font Families

| Jenis | Font | Sumber | CSS Variable | Kegunaan |
|-------|------|--------|-------------|----------|
| **Body / Sans** | [Inter](https://fonts.google.com/specimen/Inter) | Google Fonts (`next/font/google`) | `--font-inter` | Teks body, paragraf, label, tombol |
| **Heading / Display** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Google Fonts (`next/font/google`) | `--font-plus-jakarta` | H1–H6, judul section, nama menu |

### Konfigurasi Tailwind

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-plus-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

### Hierarki Tipografi

| Elemen | Ukuran Mobile | Ukuran Desktop | Weight | Font |
|--------|---------------|----------------|--------|------|
| **H1 (Hero)** | `text-4xl` (36px) | `text-6xl` – `text-7xl` (60–72px) | `font-extrabold` | Plus Jakarta Sans |
| **H2 (Section Title)** | `text-2xl` (24px) | `text-3xl` – `text-4xl` (30–36px) | `font-bold` | Plus Jakarta Sans |
| **H3 (Card Title)** | `text-lg` (18px) | `text-xl` (20px) | `font-bold` | Plus Jakarta Sans |
| **Body Text** | `text-base` (16px) | `text-base` – `text-lg` (16–18px) | `font-normal` | Inter |
| **Caption / Helper** | `text-sm` (14px) | `text-sm` (14px) | `font-normal` | Inter |
| **Badge / Tag** | `text-xs` (12px) | `text-xs` (12px) | `font-medium` / `font-semibold` | Inter |
| **Tiny Label** | `text-[10px]` (10px) | `text-[10px]` (10px) | `font-normal` | Inter |

### Base Heading Styles

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-plus-jakarta), var(--font-inter), system-ui, sans-serif;
  @apply font-bold tracking-tight text-slate-900;
}
```

---

## 3. Spacing & Layout

### Container

```css
.container-section {
  @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

| Breakpoint | Padding Horizontal |
|------------|-------------------|
| Default (mobile) | `px-4` (16px) |
| `sm:` (640px+) | `px-6` (24px) |
| `lg:` (1024px+) | `px-8` (32px) |
| Max Width | `max-w-7xl` (1280px) |

### Section Spacing

```css
.section-padding {
  @apply py-16 md:py-20 lg:py-24;
}
```

| Breakpoint | Padding Vertikal |
|------------|-----------------|
| Default (mobile) | `py-16` (64px) |
| `md:` (768px+) | `py-20` (80px) |
| `lg:` (1024px+) | `py-24` (96px) |

### Navbar

| Properti | Nilai |
|----------|-------|
| Tinggi | `h-16` (64px / `--navbar-height: 4rem`) |
| Posisi | `fixed top-0` + `z-50` |
| Scroll Effect | Transparan → `navbar-solid` (blur + shadow) |

---

## 4. Breakpoints (Mobile-First)

| Alias | Min Width | Target |
|-------|-----------|--------|
| Default | `0px` | Smartphone (320px – 639px) |
| `sm:` | `640px` | Smartphone landscape / tablet kecil |
| `md:` | `768px` | Tablet — **titik transisi mobile ↔ desktop nav** |
| `lg:` | `1024px` | Laptop / desktop kecil |
| `xl:` | `1280px` | Desktop |
| `2xl:` | `1536px` | Monitor besar |

### Perilaku Responsif Utama

| Komponen | Mobile (< md) | Desktop (≥ md) |
|----------|---------------|----------------|
| Navbar Links | Hidden, ganti hamburger menu | Horizontal inline links |
| Mobile Menu | Slide-in panel 280px | Tidak tampil |
| Footer | 1 kolom stack | 2 kolom `sm:` → 3 kolom `lg:` |
| Hero Title | `text-4xl` | `text-6xl` – `text-7xl` |
| CTA Buttons | Stack vertikal | Horizontal `flex-row` |
| Quick Access Grid | 2 kolom | 3 kolom `sm:` → 6 kolom `lg:` |

---

## 5. Komponen UI Reusable

### Glass Card

```css
.glass-card {
  @apply bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg;
}
```

### Navbar Solid

```css
.navbar-solid {
  @apply bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100;
}
```

### Gradient Text

```css
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500;
}
```

### Radius & Shadow Standards

| Elemen | Border Radius | Shadow |
|--------|---------------|--------|
| Button | `rounded-xl` (12px) | `shadow-lg shadow-primary-600/25` |
| Card | `rounded-2xl` (16px) | `shadow-lg` / hover `shadow-xl` |
| Badge | `rounded-full` | — |
| Logo Icon | `rounded-lg` (8px) | `shadow-md shadow-primary-500/20` |
| Input Field | `rounded-lg` (8px) | — |
| Mobile Menu | — | `shadow-2xl` |

---

## 6. Animasi & Micro-Interactions

### Keyframes Tersedia

| Nama | Class Tailwind | Durasi | Kegunaan |
|------|---------------|--------|----------|
| `fadeIn` | `animate-fade-in` | 0.5s ease-out | Elemen muncul halus |
| `slideUp` | `animate-slide-up` | 0.5s ease-out | Content masuk dari bawah |
| `slideDown` | `animate-slide-down` | 0.3s ease-out | Dropdown, tooltip |
| `slideInRight` | `animate-slide-in-right` | 0.3s ease-out | Mobile menu masuk |
| `slideOutRight` | `animate-slide-out-right` | 0.3s ease-out | Mobile menu keluar |

### Framer Motion (MobileMenu)

```typescript
// Panel slide-in
initial={{ x: '100%' }}
animate={{ x: 0 }}
exit={{ x: '100%' }}
transition={{ type: 'spring', damping: 25, stiffness: 250 }}

// Staggered link items
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.05 }}
```

### Hover & Transition Standards

| Elemen | Efek Hover | Durasi |
|--------|-----------|--------|
| Nav Link | Color change + `bg-slate-50` | `duration-200` |
| Card | `-translate-y-1` + `shadow-lg` + border color | `duration-300` |
| Button Primary | `bg-primary-500` + `-translate-y-0.5` + shadow glow | `duration-200` |
| Footer Link | `text-primary-400` | `duration-200` |
| Quick Access Icon | `scale-110` | `duration-300` |

---

## 7. Pemetaan Komponen React Bits

Komponen dari library [React Bits](https://react-bits.dev) untuk efek visual premium:

| Komponen React Bits | Implementasi |
|---------------------|-------------|
| Text Pressure / Split Text | Title Hero "Selamat Datang di Desa Suka Banjar" |
| Tilted Card | Card Katalog UMKM & Card Destinasi Wisata |
| Spotlight Card | Card Profil Perangkat Desa & Preview Pesan Aspirasi |
| Count Up | Angka Statistik Penduduk, Luas Desa, & Total UMKM |
| Infinite Scroll / Ticker | Running Text Pengumuman & Logo Instansi/KKN |
| Aurora / Waves BG | Background Section Visi-Misi & Header Form Aspirasi |

---

## 8. Ikon

| Library | Package | Kegunaan |
|---------|---------|----------|
| [Lucide React](https://lucide.dev) | `lucide-react` | Seluruh ikon UI (navigasi, kontak, fitur) |

### Ikon yang Digunakan

| Ikon | Konteks |
|------|---------|
| `Home` | Nav: Beranda |
| `Users` | Nav: Profil |
| `MessageSquareText` | Nav: Aspirasi |
| `MapPin` | Nav: Peta, Footer alamat |
| `ShoppingBag` | Nav: UMKM |
| `Palmtree` | Nav: Wisata |
| `Newspaper` | Nav: Berita |
| `Menu` / `X` | Hamburger toggle |
| `ArrowRight` | CTA button |
| `Phone` | Footer kontak |
| `Mail` | Footer email |

---

## 9. File Referensi Implementasi

| File | Deskripsi |
|------|-----------|
| ⭐ [theme.ts](file:///c:/laragon/www/Suka Banjar-webprofile/src/lib/theme.ts) | **Single source of truth** — ubah warna di sini |
| [tailwind.config.ts](file:///c:/laragon/www/Suka Banjar-webprofile/tailwind.config.ts) | Import warna dari `theme.ts`, config font & animasi |
| [globals.css](file:///c:/laragon/www/Suka Banjar-webprofile/src/app/globals.css) | CSS tokens & utility components (sync manual dengan `theme.ts`) |
| [layout.tsx](file:///c:/laragon/www/Suka Banjar-webprofile/src/app/layout.tsx) | Root layout, font loading, SEO metadata |
| [constants/index.ts](file:///c:/laragon/www/Suka Banjar-webprofile/src/constants/index.ts) | Data navigasi & site info |
| [utils.ts](file:///c:/laragon/www/Suka Banjar-webprofile/src/lib/utils.ts) | Helper `cn()` (clsx + tailwind-merge) |
| [Navbar.tsx](file:///c:/laragon/www/Suka Banjar-webprofile/src/components/layout/Navbar.tsx) | Navbar responsif |
| [MobileMenu.tsx](file:///c:/laragon/www/Suka Banjar-webprofile/src/components/layout/MobileMenu.tsx) | Mobile menu Framer Motion |
| [Footer.tsx](file:///c:/laragon/www/Suka Banjar-webprofile/src/components/layout/Footer.tsx) | Footer 3-kolom |

---

## 10. Cara Mengganti Color Palette

> **Cukup edit 1 file:** [`src/lib/theme.ts`](file:///c:/laragon/www/Suka Banjar-webprofile/src/lib/theme.ts)

**Langkah:**
1. Buka `src/lib/theme.ts`
2. Ubah nilai HEX pada objek `primary`, `accent`, atau `semantic`
3. Jika mengubah `semantic`, update juga nilai CSS di `globals.css` `:root`
4. Restart `npm run dev`
5. Seluruh website otomatis mengikuti warna baru

**Tips generate shade:**
- Gunakan [UIColors.app](https://uicolors.app) — paste 1 warna dasar, dapatkan shade 50–950
- Gunakan [Tailwind Color Generator](https://www.tints.dev) sebagai alternatif

