import Link from 'next/link';
import {
  MessageSquareText,
  MapPin,
  ShoppingBag,
  Palmtree,
  Newspaper,
  Users,
  ArrowRight,
} from 'lucide-react';

const quickAccessItems = [
  {
    label: 'Profil Desa',
    description: 'Sejarah, visi-misi, & struktur',
    href: '/profil',
    icon: Users,
    color: 'from-emerald-500 to-green-600',
  },
  {
    label: 'Aspirasi Warga',
    description: 'Sampaikan aspirasi Anda',
    href: '/aspirasi',
    icon: MessageSquareText,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    label: 'Peta Fasilitas',
    description: 'Lokasi fasilitas publik',
    href: '/peta',
    icon: MapPin,
    color: 'from-amber-500 to-orange-600',
  },
  {
    label: 'UMKM Desa',
    description: 'Katalog produk lokal',
    href: '/umkm',
    icon: ShoppingBag,
    color: 'from-rose-500 to-pink-600',
  },
  {
    label: 'Wisata Desa',
    description: 'Destinasi & pemandangan alam',
    href: '/wisata',
    icon: Palmtree,
    color: 'from-teal-500 to-cyan-600',
  },
  {
    label: 'Berita & Artikel',
    description: 'Kabar terbaru desa',
    href: '/berita',
    icon: Newspaper,
    color: 'from-violet-500 to-purple-600',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative container-section text-center py-20 pt-28 md:pt-20 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-medium text-white/70">
              Website Profil & Portal Digital
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Selamat Datang di{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-emerald-300 to-accent-400">
                Desa Sukabanjar
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Kecamatan Sidomulyo, Kabupaten Lampung Selatan, Provinsi Lampung. 
              Portal informasi, aspirasi warga, dan potensi desa.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-500 transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Jelajahi Profil Desa
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/aspirasi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              <MessageSquareText size={16} />
              Sampaikan Aspirasi
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="section-padding bg-slate-50">
        <div className="container-section">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-heading">
              Akses Cepat
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Temukan informasi dan layanan digital Desa Sukabanjar dengan mudah
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className="font-semibold text-sm text-slate-800 mb-1">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-400 leading-relaxed hidden sm:block">
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
