'use client';

import { Building2, School, HeartPulse, HeartHandshake, ShoppingBag, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CATEGORY_ICONS = {
  Semua: Layers,
  Pemerintahan: Building2,
  Pendidikan: School,
  Kesehatan: HeartPulse,
  Ibadah: HeartHandshake,
  Ekonomi: ShoppingBag,
} as const;

export type MapCategory = keyof typeof CATEGORY_ICONS;

interface MapFilterBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export default function MapFilterBar({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: MapFilterBarProps) {
  const categories = Object.keys(CATEGORY_ICONS) as MapCategory[];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-4">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const isActive = activeCategory === cat;
        const count = categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer',
              isActive
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon size={16} className={cn(isActive ? 'text-primary-400' : 'text-slate-400')} />
            <span>{cat}</span>
            <span
              className={cn(
                'text-[10px] px-2 py-0.5 rounded-full font-bold',
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
