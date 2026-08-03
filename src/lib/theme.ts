/**
 * ============================================================
 * THEME CONFIG — Single Source of Truth untuk Color Palette
 * ============================================================
 *
 * WARNA UTAMA WEBSITE: #0086C9 (Ocean Blue / Ocean Azure)
 * Variasi warna pendukung (Gold Amber, Emerald Green, Coral)
 * diselaraskan secara alami dan harmonis dengan gradien biru.
 */

// ─── PRIMARY: #0086C9 (Ocean Azure Blue) ───────────────────
export const primary = {
  50:  '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0086C9',  // ← Warna dasar utama (#0086C9)
  600: '#006ca3',  // ← Dark ocean blue
  700: '#005480',  // ← Rich navy ocean
  800: '#003e5f',  // ← Midnight ocean
  900: '#002b43',  // ← Deep dark blue
  950: '#001929',  // ← Deepest midnight navy
} as const;

// ─── ACCENT: Emas Warm Gold / Amber (Harmonis dengan Biru) ──
export const accent = {
  50:  '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',  // ← Warna aksen utama (Warm Gold)
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
} as const;

// ─── NEUTRAL: Extend warna netral dengan Deep Ocean Blue Tone ─
export const neutralExtend = {
  850: '#002338',
  925: '#001a2b',
  950: '#00121f',
} as const;

// ─── SEMANTIC: Warna fungsional ─────────────────────────────
export const semantic = {
  background:       '#ffffff',
  foreground:       '#0f172a',
  surface:          '#f8fafc',
  surfaceElevated:  '#ffffff',
  border:           '#e2e8f0',
  borderLight:      '#f1f5f9',
} as const;

// ─── GRADIENTS: Preset Gradien Elegan Berbasis #0086C9 ───────
export const gradients = {
  heroBackground: 'from-[#001929] via-[#003e5f] to-[#0086C9]',
  heroText:       'from-sky-300 via-white to-amber-300',
  logoBadge:      'from-[#0086C9] to-[#005480]',
  gradientText:   'from-[#0086C9] via-sky-400 to-[#F59E0B]',
} as const;

// ─── MODULE COLORS: Modul Quick Access & Badges ──────────────
export const moduleColors = {
  profil:   'from-sky-500 to-indigo-600',
  aspirasi: 'from-[#0086C9] to-cyan-600',
  peta:     'from-amber-500 to-orange-500',
  umkm:     'from-emerald-500 to-teal-600',
  galeri:   'from-cyan-500 to-[#0086C9]',
  berita:   'from-blue-600 to-indigo-700',
} as const;

// ─── EXPORT GABUNGAN untuk Tailwind Config ──────────────────
export const themeColors = {
  background: `var(--background)`,
  foreground: `var(--foreground)`,
  primary,
  accent,
  slate: neutralExtend,
} as const;
