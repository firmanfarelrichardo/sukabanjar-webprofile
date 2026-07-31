import Link from 'next/link';
import { ChevronRight, BarChart3, Users } from 'lucide-react';

export default function StatistikHero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-primary-950 text-white py-16 md:py-24 pt-36 sm:pt-40 md:pt-36 overflow-hidden">
      {/* Background Decorative Orbs */}
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
          <span className="text-primary-400 font-semibold">Statistik & Demografi</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <BarChart3 size={14} className="text-accent-400 animate-pulse" />
          <span className="text-xs text-white/80 font-medium">
            Data Terbuka Kependudukan Desa
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight text-balance">
          Statistik & Demografi{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-emerald-300 to-accent-400">
            Desa Sukabanjar
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed text-balance">
          Informasi transparan mengenai komposisi kependudukan, distribusi dusun, jenis mata pencaharian, tingkat pendidikan, dan kelompok usia warga desa.
        </p>

        {/* Update Tag */}
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
          <Users size={13} />
          <span>Data Terbaru Tahun 2026</span>
        </div>
      </div>
    </section>
  );
}
