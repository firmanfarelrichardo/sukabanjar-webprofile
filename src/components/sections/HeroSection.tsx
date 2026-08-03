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
    'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan pariwisata Desa Suka Banjar.';

  const [subtitleText, setSubtitleText] = useState(defaultSubtitle);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setSubtitleText(defaultSubtitle);
  }, [defaultSubtitle]);

  // Smooth RAF parallax scroll listener for high FPS animation across mobile & desktop
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubtitleChange = (val: string) => {
    setSubtitleText(val);
    updateLiveText('heroSubtitle', val);
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Responsive 2-Layer Parallax Animation (Semua Ukuran Perangkat: Mobile, Tablet, Laptop, Desktop) */}
      <div className="parallax absolute inset-0 pointer-events-none z-0 w-full h-full">
        {/* Layer 1: Pemandangan Sawah & Langit Cerah Desa (data-speed="-0.7") */}
        <div
          className="layer parallax-layer opacity-100"
          data-speed="-0.7"
          style={{
            backgroundImage: `url(${heroImageUrl || '/images/hero/landscape_background_small.png'})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transform: `translate3d(0px, ${(scrollY * -0.65).toFixed(2)}px, 0px)`,
          }}
        />

        {/* Layer 2: Pemukiman Rumah Warga & Terasering Desa (data-speed="-0.2") */}
        <div
          className="layer parallax-layer opacity-95"
          data-speed="-0.2"
          style={{
            backgroundImage: `url('/images/hero/landscape_mountain_small.png')`,
            backgroundPosition: 'center bottom',
            backgroundSize: 'cover',
            height: '65%',
            top: 'auto',
            bottom: 0,
            WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            transform: `translate3d(0px, ${(scrollY * -0.2).toFixed(2)}px, 0px)`,
          }}
        />
      </div>

      {/* Subtle Ambient Vignette Overlay for High Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-slate-950/85 pointer-events-none z-0" />

      {/* Hero Content - Fully Responsive Layout */}
      <div className="relative container-section text-center py-12 sm:py-16 pt-28 sm:pt-36 md:pt-40 space-y-5 sm:space-y-6 z-10 px-4 sm:px-6">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md shadow-md">
          <MapPin size={12} className="text-sky-300 shrink-0" />
          <span className="text-[10px] sm:text-xs font-semibold text-white/95">
            Kec. {subdistrict}, Kab. {district}, {province}
          </span>
        </div>

        {/* Minimalist Title & Subtitle directly over Landscape */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] text-balance font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Selamat Datang di{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-sky-100 to-amber-300">
              Desa {name}
            </span>
          </h1>

          {/* Standalone Subtitle Textbox for Beranda */}
          {isAdmin && isEditMode ? (
            <div className="max-w-2xl mx-auto space-y-1">
              <label className="block text-xs font-bold text-amber-300 uppercase">
                Edit Subtitle Banner Beranda Langsung:
              </label>
              <textarea
                rows={3}
                value={subtitleText}
                onChange={(e) => handleSubtitleChange(e.target.value)}
                className="w-full text-xs sm:text-sm md:text-base text-slate-100 bg-black/60 p-3 rounded-2xl border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-medium leading-relaxed"
                placeholder="Tuliskan subtitle deskripsi banner beranda..."
              />
            </div>
          ) : (
            <p className="text-xs sm:text-sm md:text-base text-slate-100/90 max-w-2xl mx-auto font-medium leading-relaxed text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {subtitleText}
            </p>
          )}
        </div>

        {/* Minimalist Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/profil"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#0086C9] to-[#005480] text-white font-extrabold text-xs sm:text-sm hover:opacity-95 transition-all duration-200 shadow-xl shadow-[#0086C9]/30 hover:-translate-y-0.5 cursor-pointer"
          >
            Jelajahi Profil Desa
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/aspirasi"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-black/50 border border-white/20 text-white font-bold text-xs sm:text-sm hover:bg-black/70 transition-all duration-200 backdrop-blur-md hover:-translate-y-0.5 cursor-pointer shadow-lg"
          >
            <MessageSquareText size={16} className="text-amber-300" />
            Sampaikan Aspirasi
          </Link>
        </div>
      </div>
    </section>
  );
}
