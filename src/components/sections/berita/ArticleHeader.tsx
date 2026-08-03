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
    <div className="w-full bg-white text-slate-900 pt-36 sm:pt-40 md:pt-44 pb-8 px-4 sm:px-6 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0086C9] text-white flex items-center justify-center font-black shrink-0 shadow-md mt-1">
              <Newspaper size={22} />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                PORTAL BERITA & PENGUMUMAN DESA
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0086C9] transition-all font-medium"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold shrink-0 border border-slate-200/60">
            <SlidersHorizontal size={13} className="text-[#0086C9]" />
            <span>Kategori:</span>
          </div>

          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0086C9] text-white shadow-md font-extrabold scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
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
