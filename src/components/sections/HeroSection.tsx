'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquareText, MapPin } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  name: string;
  subdistrict: string;
  district: string;
  province: string;
  heroImageUrl?: string | null;
  heroSubtitle?: string | null;
}

export default function HeroSection({
  name,
  subdistrict,
  district,
  province,
  heroImageUrl,
  heroSubtitle,
}: HeroSectionProps) {
  const { isAdmin, isEditMode, updateLiveText } = useAdmin();

  const defaultSubtitle =
    heroSubtitle ||
    'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan pariwisata Desa Sukabanjar.';

  const [subtitleText, setSubtitleText] = useState(defaultSubtitle);

  useEffect(() => {
    setSubtitleText(defaultSubtitle);
  }, [defaultSubtitle]);

  const handleSubtitleChange = (val: string) => {
    setSubtitleText(val);
    updateLiveText('heroSubtitle', val);
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-primary-950">
      {/* Dynamic Background Image Overlay if provided */}
      {heroImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
      )}

      {/* Background Decorative Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative container-section text-center py-20 pt-36 sm:pt-40 md:pt-36 space-y-8 z-10">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/10">
          <MapPin size={14} className="text-primary-400" />
          <span className="text-xs font-medium text-white/80">
            Kec. {subdistrict}, Kab. {district}, {province}
          </span>
        </div>

        {/* Dynamic Title & Standalone Editable Subtitle */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.1] text-balance font-heading">
            Selamat Datang di{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-emerald-300 to-accent-400">
              Desa {name}
            </span>
          </h1>

          {/* Standalone Subtitle Textbox for Beranda */}
          {isAdmin && isEditMode ? (
            <div className="max-w-3xl mx-auto space-y-1">
              <label className="block text-xs font-bold text-amber-400 uppercase">
                ✏️ Edit Subtitle Banner Beranda Langsung:
              </label>
              <textarea
                rows={3}
                value={subtitleText}
                onChange={(e) => handleSubtitleChange(e.target.value)}
                className="w-full text-base sm:text-lg md:text-xl text-slate-100 bg-white/10 p-3.5 rounded-2xl border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-medium leading-relaxed"
                placeholder="Tuliskan subtitle deskripsi banner beranda..."
              />
            </div>
          ) : (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
              {subtitleText}
            </p>
          )}
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none">
          <Link
            href="/profil"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary-600 text-white font-semibold text-sm sm:text-base hover:bg-primary-500 transition-all duration-200 shadow-xl shadow-primary-600/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
          >
            Jelajahi Profil Desa
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/aspirasi"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm sm:text-base hover:bg-white/20 transition-all duration-200 backdrop-blur-md hover:-translate-y-0.5"
          >
            <MessageSquareText size={18} className="text-accent-400" />
            Sampaikan Aspirasi
          </Link>
        </div>
      </div>
    </section>
  );
}
