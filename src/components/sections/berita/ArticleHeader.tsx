'use client';

import { Search, SlidersHorizontal, Newspaper } from 'lucide-react';

interface ArticleHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
}

export default function ArticleHeader({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categories,
}: ArticleHeaderProps) {
  return (
    <div className="w-full bg-slate-900 text-white pt-36 sm:pt-40 md:pt-44 pb-8 px-4 sm:px-6 border-b border-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
              <Newspaper size={22} />
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                PORTAL BERITA & PENGUMUMAN DESA
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Kabar utama pembangunan, kegiatan warga, serta informasi resmi Desa Suka Banjar
              </p>
            </div>
          </div>

          {/* Search Box Input */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari berita atau kegiatan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold shrink-0">
            <SlidersHorizontal size={13} />
            <span>Kategori:</span>
          </div>

          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
