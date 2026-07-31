'use client';

import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UmkmSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  'Semua',
  'Olahan Tani',
  'Kuliner',
  'Kerajinan',
  'Kopi & Minuman',
  'Lainnya',
];

export default function UmkmSearchFilter({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: UmkmSearchFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari produk UMKM atau nama pemilik usaha..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
