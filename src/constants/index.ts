import {
  Home,
  Users,
  BarChart3,
  MessageSquareText,
  MapPin,
  ShoppingBag,
  Palmtree,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

/* ================================================================
   NAVIGATION — Menu Publik
   ================================================================ */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Profil', href: '/profil', icon: Users },
  { label: 'Statistik', href: '/statistik', icon: BarChart3 },
  { label: 'Aspirasi', href: '/aspirasi', icon: MessageSquareText },
  { label: 'Peta', href: '/peta', icon: MapPin },
  { label: 'UMKM', href: '/umkm', icon: ShoppingBag },
  { label: 'Wisata', href: '/wisata', icon: Palmtree },
  { label: 'Berita', href: '/berita', icon: Newspaper },
];

/* ================================================================
   SITE INFO — Informasi Desa untuk Footer & Metadata
   ================================================================ */

export const SITE_INFO = {
  name: 'Desa Sukabanjar',
  fullName: 'Desa Sukabanjar, Kecamatan Sidomulyo',
  tagline: 'Website Profil & Portal Digital',
  description:
    'Portal resmi Desa Sukabanjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan, Provinsi Lampung.',
  address: 'Jl. Raya Desa Sukabanjar, Kec. Sidomulyo, Kab. Lampung Selatan, Lampung',
  phone: '081234567890',
  email: 'desa.sukabanjar@gmail.com',
  year: new Date().getFullYear(),
} as const;

/* ================================================================
   FOOTER LINKS
   ================================================================ */

export const FOOTER_NAV_ITEMS = [
  { label: 'Profil Desa', href: '/profil' },
  { label: 'Statistik & Demografi', href: '/statistik' },
  { label: 'Aspirasi Warga', href: '/aspirasi' },
  { label: 'Peta Fasilitas', href: '/peta' },
  { label: 'UMKM Desa', href: '/umkm' },
  { label: 'Destinasi Wisata', href: '/wisata' },
  { label: 'Berita & Artikel', href: '/berita' },
];
