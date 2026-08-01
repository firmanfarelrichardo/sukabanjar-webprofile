'use client';

import { useAdmin } from '@/context/AdminContext';
import { Camera, Plus, Search, Sparkles, Image as ImageIcon } from 'lucide-react';

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

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 md:py-20">
      {/* Background Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 via-slate-950 to-amber-900/20 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="container-section relative z-10 space-y-8">
        {/* Top Header & Admin Action */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-bold backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              <span>Dokumentasi Visual & Keindahan Desa</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
              Galeri Pemandangan & Momen Desa
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Jelajahi lanskap panorama pesawahan, keasrian alam perbukitan, kegiatan sosial kemasyarakatan, serta fasilitas terbaik Desa Suka Banjar.
            </p>
          </div>

          {/* Stat Box & Admin Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white font-heading block leading-none">
                  {totalPhotos}
                </span>
                <span className="text-[11px] font-medium text-slate-400">Total Koleksi Foto</span>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-primary-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Plus size={18} />
                <span>+ Tambah Foto Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-primary-500 text-slate-950 shadow-md shadow-primary-500/30 font-extrabold scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari foto desa..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
