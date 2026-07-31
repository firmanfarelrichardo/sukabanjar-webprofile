import Link from 'next/link';
import { ChevronRight, MapPin, Building2 } from 'lucide-react';

interface ProfileHeroProps {
  villageName?: string;
  subdistrict?: string;
  district?: string;
}

export default function ProfileHero({
  villageName = 'Sukabanjar',
  subdistrict = 'Sidomulyo',
  district = 'Lampung Selatan',
}: ProfileHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-primary-950 text-white py-16 md:py-24 pt-36 sm:pt-40 md:pt-36 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-section relative z-10 text-center max-w-3xl mx-auto space-y-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <Link href="/" className="hover:text-primary-400 transition-colors">
            Beranda
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-primary-400 font-semibold">Profil Desa</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Building2 size={14} className="text-accent-400" />
          <span className="text-xs text-white/80 font-medium">
            Informasi Pemerintahan & Kelembagaan
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight text-balance">
          Profil & Identitas{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-emerald-300 to-accent-400">
            Desa {villageName}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed text-balance">
          Mengenal lebih dekat sejarah berdiri, visi-misi, susunan organisasi pemerintahan, serta gambaran umum demografi penduduk Desa Sukabanjar.
        </p>

        {/* Location Info */}
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 pt-2">
          <MapPin size={14} className="text-primary-400" />
          <span>Kecamatan {subdistrict}, Kabupaten {district}</span>
        </div>
      </div>
    </section>
  );
}
