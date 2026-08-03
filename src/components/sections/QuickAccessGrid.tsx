'use client';

import Link from 'next/link';
import {
  Users,
  BarChart3,
  MessageSquareText,
  MapPin,
  ShoppingBag,
  Camera,
  Newspaper,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';

const modules = [
  {
    id: 'profil',
    title: 'Profil & Sejarah Desa',
    subtitle: 'Kelembagaan, Visi-Misi & Tata Kelola Desa',
    description:
      'Mengenal berdiri Desa Suka Banjar, susunan struktur organisasi perangkat balai desa, visi-misi pembangunan, serta arah tata kelola pemerintahan yang transparan.',
    href: '/profil',
    icon: Users,
    tag: 'Informasi Desa',
    image: '/images/modules/profil.png',
    accentColor: 'from-[#0086C9] to-sky-600',
  },
  {
    id: 'statistik',
    title: 'Statistik & Demografi Penduduk',
    subtitle: 'Transparansi Data Kependudukan Real-time',
    description:
      'Akses data terbuka jumlah 5.153 jiwa warga desa, pembagian 5 wilayah Dusun (Damar Lega, Katibung, Sandaran I & II, Sugih Waras), hingga grafik usia & pekerjaan.',
    href: '/statistik',
    icon: BarChart3,
    tag: 'Data Terbuka SIPDeskel',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-blue-600 to-[#0086C9]',
  },
  {
    id: 'aspirasi',
    title: 'E-Aspirasi & Pengaduan Warga',
    subtitle: 'Layanan Masukan & Pelaporan Fasilitas Publik',
    description:
      'Sampaikan aspirasi, saran pembangunan, atau pengaduan masalah warga secara online. Dilengkapi fitur aman tanpa perlu login dan opsi pelaporan rahasia / anonim.',
    href: '/aspirasi',
    icon: MessageSquareText,
    tag: 'Layanan Digital',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'peta',
    title: 'Peta Interaktif Fasilitas Desa',
    subtitle: 'Pemetaan Geospasial Fasilitas Umum & Sarana',
    description:
      'Jelajahi sebaran lokasi titik balai desa, sekolah, sarana kesehatan, tempat ibadah, serta titik UMKM desa melalui peta interaktif berbasis OpenStreetMap.',
    href: '/peta',
    icon: MapPin,
    tag: 'Geospasial Presisi',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-teal-600 to-[#0086C9]',
  },
  {
    id: 'umkm',
    title: 'Katalog UMKM & Produk Lokal',
    subtitle: 'Potensi Usaha Warga Desa Suka Banjar',
    description:
      'Dukung perekonomian warga dengan membeli keripik pisang, olahan kopi khas, hasil tani, dan kerajinan lokal. Terhubung langsung dengan pesan WhatsApp penjual.',
    href: '/umkm',
    icon: ShoppingBag,
    tag: 'Ekonomi Kerakyatan',
    image: '/images/modules/umkm.png',
    accentColor: 'from-emerald-600 to-teal-500',
  },
  {
    id: 'galeri',
    title: 'Galeri Momen & Pemandangan Desa',
    subtitle: 'Dokumentasi Visual Keindahan Alam Sidomulyo',
    description:
      'Koleksi foto pemandangan perbukitan hijau, saung persawahan, kegiatan kemasyarakatan, serta momen kebersamaan warga Desa Suka Banjar.',
    href: '/galeri',
    icon: Camera,
    tag: 'Dokumentasi Visual',
    image: '/images/modules/galeri.png',
    accentColor: 'from-sky-500 to-[#0086C9]',
  },
  {
    id: 'berita',
    title: 'Warta Berita & Pengumuman Desa',
    subtitle: 'Portal Kabar Kegiatan & Program KKN',
    description:
      'Informasi resmi seputar pembangunan fisik, jadwal pelayanan Balai Desa, pengumuman warga, serta warta kegiatan program kerja mahasiswa KKN.',
    href: '/berita',
    icon: Newspaper,
    tag: 'Kabar Terkini',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-[#0086C9] to-indigo-600',
  },
];

export default function QuickAccessGrid() {
  return (
    <section className="relative bg-[#f8fafc] py-16 sm:py-24 text-slate-900 overflow-hidden">
      {/* Background Ambient Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#0086C9]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="container-section relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-4">

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight text-slate-900 leading-tight">
            Akses Cepat Portal{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0086C9] via-sky-600 to-amber-500">
              Desa Suka Banjar
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-balance">
            Gulir ke bawah untuk mengeksplorasi setiap modul layanan publik, statistik, peta fasilitas, katalog UMKM, serta galeri pemandangan desa secara interaktif.
          </p>
        </div>

        {/* Parallax Scroll Stack Container */}
        <ScrollStack
          useWindowScroll={true}
          itemDistance={40}
          itemScale={0.03}
          itemStackDistance={24}
          stackPosition="12%"
          scaleEndPosition="5%"
          baseScale={0.88}
        >
          {modules.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollStackItem key={item.id}>
                <div className="group relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white min-h-[340px] sm:min-h-[380px] flex flex-col justify-between p-6 sm:p-10 transition-all duration-300">
                  {/* Card Background Image with Elegant Dark Gradient Overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
                  </div>

                  {/* Top Content Row inside Card */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accentColor} p-3 text-white shadow-lg flex items-center justify-center`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-sm">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-white/70 tracking-wider uppercase font-mono">
                      MODUL 0{index + 1} / 07
                    </span>
                  </div>

                  {/* Middle Main Content Row */}
                  <div className="relative z-10 my-4 space-y-3 max-w-2xl">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block font-heading">
                      {item.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight group-hover:text-sky-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-200 text-xs sm:text-sm sm:text-base leading-relaxed text-balance">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Button Row */}
                  <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r ${item.accentColor} text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group/btn`}
                    >
                      <span>Jelajahi Modul</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <span className="hidden sm:inline-block text-xs font-medium text-slate-300">
                      Desa Suka Banjar &copy; 2026
                    </span>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}
