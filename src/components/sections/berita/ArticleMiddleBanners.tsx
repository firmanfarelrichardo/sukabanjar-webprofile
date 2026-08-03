'use client';

import Link from 'next/link';
import { ArticleItem } from './ArticleFeaturedHero';

interface ArticleMiddleBannersProps {
  articles: ArticleItem[];
}

export default function ArticleMiddleBanners({ articles }: ArticleMiddleBannersProps) {
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
    <div className="w-full bg-[#f8fafc] text-white py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.slice(0, 2).map((art) => (
          <Link
            key={art.id}
            href={`/berita/${art.slug}`}
            className="group relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/9] flex items-end p-6"
          >
            {/* Background Image */}
            <img
              src={art.imageUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'}
              alt={art.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

            {/* Content Text Overlay at Bottom */}
            <div className="relative z-10 space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0086C9]">
                <span className="bg-[#0086C9] text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px] shadow-sm font-extrabold">
                  {art.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-200 font-medium">{formatDate(art.createdAt)}</span>
              </div>

              <h3 className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 drop-shadow-md">
                {art.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
