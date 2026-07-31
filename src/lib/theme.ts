/**
 * ============================================================
 * THEME CONFIG — Single Source of Truth untuk Color Palette
 * ============================================================
 *
 * File ini adalah SATU-SATUNYA tempat untuk mengubah warna.
 * Tailwind config dan CSS variables akan otomatis mengikuti.
 *
 * CARA GANTI WARNA:
 * 1. Ubah nilai HEX di objek `colors` di bawah.
 * 2. Restart `npm run dev`.
 * 3. Selesai — seluruh website akan mengikuti warna baru.
 *
 * TIPS:
 * - Gunakan https://uicolors.app untuk generate shade 50–950 dari 1 warna dasar.
 * - Pastikan kontras warna memenuhi WCAG AA (minimal 4.5:1 untuk teks).
 */

// ─── PRIMARY: Warna utama brand ─────────────────────────────
// Default: Hijau alam desa — merepresentasikan kesuburan & pertumbuhan.
// Untuk mengganti, ubah seluruh shade atau generate dari warna dasar baru.
export const primary = {
  50:  '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',  // ← Warna dasar utama
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
} as const;

// ─── ACCENT: Warna aksen / penekanan ────────────────────────
// Default: Emas hangat — untuk CTA, badge, dan highlight penting.
export const accent = {
  50:  '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',  // ← Warna aksen utama
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
} as const;

// ─── NEUTRAL: Warna netral untuk teks, background, border ──
// Default: Slate — tone biru-abu profesional.
// Extend saja shade custom, Tailwind sudah punya slate bawaan.
export const neutralExtend = {
  850: '#172033',
  925: '#0d1526',
  950: '#080f1e',
} as const;

// ─── SEMANTIC: Warna dengan makna fungsional ────────────────
// Digunakan sebagai CSS custom properties di globals.css.
export const semantic = {
  background:       '#ffffff',
  foreground:       '#0f172a',
  surface:          '#f8fafc',
  surfaceElevated:  '#ffffff',
  border:           '#e2e8f0',
  borderLight:      '#f1f5f9',
} as const;

// ─── GRADIENTS: Preset gradien yang digunakan ───────────────
// Format: array of Tailwind gradient classes.
export const gradients = {
  heroBackground: 'from-slate-900 via-slate-800 to-primary-950',
  heroText:       'from-primary-400 via-emerald-300 to-accent-400',
  logoBadge:      'from-primary-500 to-primary-700',
  gradientText:   'from-primary-600 via-primary-500 to-accent-500',
} as const;

// ─── MODULE COLORS: Warna ikon per modul Quick Access ───────
// Setiap modul punya gradien unik untuk identitas visual.
export const moduleColors = {
  profil:   'from-emerald-500 to-green-600',
  aspirasi: 'from-blue-500 to-indigo-600',
  peta:     'from-amber-500 to-orange-600',
  umkm:     'from-rose-500 to-pink-600',
  wisata:   'from-teal-500 to-cyan-600',
  berita:   'from-violet-500 to-purple-600',
} as const;

// ─── EXPORT GABUNGAN untuk Tailwind Config ──────────────────
export const themeColors = {
  background: `var(--background)`,
  foreground: `var(--foreground)`,
  primary,
  accent,
  slate: neutralExtend,
} as const;
