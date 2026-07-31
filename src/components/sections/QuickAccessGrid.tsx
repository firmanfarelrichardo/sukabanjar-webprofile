import Link from 'next/link';
import {
  Users,
  BarChart3,
  MessageSquareText,
  MapPin,
  ShoppingBag,
  Palmtree,
  Newspaper,
  ArrowUpRight,
} from 'lucide-react';
import { moduleColors } from '@/lib/theme';

const modules = [
  {
    title: 'Profil & Sejarah',
    description: 'Sejarah desa, visi-misi, serta struktur organisasi pemerintahan.',
    href: '/profil',
    icon: Users,
    gradient: moduleColors.profil,
    tag: 'Informasi',
  },
  {
    title: 'Statistik & Demografi',
    description: 'Data kependudukan, distribusi dusun, jenis pekerjaan, & tingkat pendidikan.',
    href: '/statistik',
    icon: BarChart3,
    gradient: 'from-blue-600 to-indigo-700',
    tag: 'Data Terbuka',
  },
  {
    title: 'E-Aspirasi Warga',
    description: 'Formulir pengiriman pengaduan, masukan, & laporan fasilitas publik.',
    href: '/aspirasi',
    icon: MessageSquareText,
    gradient: moduleColors.aspirasi,
    tag: 'Layanan',
  },
  {
    title: 'Peta Interaktif',
    description: 'Peta sebaran fasilitas publik, tempat ibadah, sekolah, & sarana kesehatan.',
    href: '/peta',
    icon: MapPin,
    gradient: moduleColors.peta,
    tag: 'Geospasial',
  },
  {
    title: 'Katalog UMKM',
    description: 'Produk unggulan usaha warga lokal terintegrasi pesan WhatsApp.',
    href: '/umkm',
    icon: ShoppingBag,
    gradient: moduleColors.umkm,
    tag: 'Ekonomi',
  },
  {
    title: 'Wisata & Alam',
    description: 'Destinasi keindahan alam, saung kumpul, dan rute lokasi.',
    href: '/wisata',
    icon: Palmtree,
    gradient: moduleColors.wisata,
    tag: 'Potensi',
  },
  {
    title: 'Berita & Pengumuman',
    description: 'Kabar terbaru seputar kegiatan desa, pembangunan, & program KKN.',
    href: '/berita',
    icon: Newspaper,
    gradient: moduleColors.berita,
    tag: 'Kabar',
  },
];

export default function QuickAccessGrid() {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="container-section">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200">
            Layanan & Layar Utama
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Akses Cepat Portal Desa
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Pilih modul informasi atau layanan publik digital yang ingin Anda akses di Desa Sukabanjar.
          </p>
        </div>

        {/* Modular Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Top Header inside Card */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={24} />
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Arrow Link */}
                <div className="flex items-center text-xs font-semibold text-primary-600 group-hover:text-primary-700 gap-1 pt-2 border-t border-slate-100">
                  <span>Buka Modul</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
