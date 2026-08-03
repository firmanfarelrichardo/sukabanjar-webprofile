'use client';

import { useAdmin } from '@/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GalleryHeroProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalPhotos: number;
  onOpenAddModal: () => void;
}

export default function GalleryHero({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalPhotos,
  onOpenAddModal,
}: GalleryHeroProps) {
  const { isAdmin } = useAdmin();
  const [scrollY, setScrollY] = useState(0);

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

  return (
    <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden pt-32 sm:pt-36 md:pt-40 pb-16 md:pb-20">
      {/* 2-Layer Responsive Parallax Animation */}
      <div className="parallax absolute inset-0 pointer-events-none z-0 w-full h-full">
        {/* Layer 1: Pemandangan Sawah & Langit Cerah Desa */}
        <div
          className="layer parallax-layer opacity-60"
          data-speed="-0.7"
          style={{
            backgroundImage: `url('/images/hero/landscape_background_small.png')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transform: `translate3d(0px, ${(scrollY * -0.65).toFixed(2)}px, 0px)`,
          }}
        />

        {/* Layer 2: Pemukiman Rumah Warga & Terasering Desa */}
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

      {/* Ambient Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-slate-950/90 pointer-events-none z-0" />

      <div className="container-section relative z-10 space-y-8 px-4">
        {/* Top Header & Admin Action */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 sm:space-y-5 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Galeri Pemandangan & Momen Desa
            </h1>

            <p className="text-slate-100/90 text-sm sm:text-base leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Jelajahi lanskap panorama pesawahan, keasrian alam perbukitan, kegiatan sosial kemasyarakatan, serta fasilitas terbaik Desa Suka Banjar.
            </p>
          </div>

          {/* Admin Action Button */}
          {isAdmin && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#0086C9] to-teal-500 hover:from-[#006ca3] hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
              >
                <Plus size={18} />
                <span>Tambah Foto Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer backdrop-blur-md ${
                    isActive
                      ? 'bg-[#0086C9] text-white shadow-lg font-extrabold scale-105'
                      : 'bg-black/40 text-slate-200 border border-white/15 hover:bg-black/60 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Cari foto desa..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#0086C9] transition-all backdrop-blur-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
