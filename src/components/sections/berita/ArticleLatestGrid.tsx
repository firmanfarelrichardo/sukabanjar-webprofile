'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { ArticleItem } from './ArticleFeaturedHero';

interface ArticleLatestGridProps {
  articles: ArticleItem[];
}

export default function ArticleLatestGrid({ articles }: ArticleLatestGridProps) {
  if (!articles || articles.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Terbaru';
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Berita Terbaru Desa
          </h2>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0086C9] hover:text-[#006ca3] transition-colors">
            <span>Arsip Lengkap</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-[#0086C9]/40 transition-all flex flex-col group"
            >
              {/* Image Preview */}
              <Link href={`/berita/${art.slug}`} className="block aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={art.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0086C9] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-md uppercase">
                  {art.category}
                </span>
              </Link>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#0086C9]" />
                      {formatDate(art.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-slate-400" />
                      {art.author || 'Admin'}
                    </span>
                  </div>

                  <Link href={`/berita/${art.slug}`}>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0086C9] transition-colors">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-normal">
                    {art.content.replace(/[\#\*\_\`]/g, '')}
                  </p>
                </div>

                <Link
                  href={`/berita/${art.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0086C9] hover:text-[#006ca3] transition-colors pt-3 border-t border-slate-100"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
