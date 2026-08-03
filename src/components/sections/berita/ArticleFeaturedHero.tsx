'use client';

import Link from 'next/link';

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  imageUrl: string | null;
  author: string;
  createdAt: string;
}

interface ArticleFeaturedHeroProps {
  mainArticle: ArticleItem;
  secondaryArticles: ArticleItem[];
}

export default function ArticleFeaturedHero({
  mainArticle,
  secondaryArticles,
}: ArticleFeaturedHeroProps) {
  if (!mainArticle) return null;

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
    <div className="w-full bg-[#f8fafc] text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Hero Article) */}
        <div className="lg:col-span-7 space-y-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl">
          {/* Author Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0086C9] text-white flex items-center justify-center font-extrabold text-sm overflow-hidden shrink-0 shadow-md">
              {mainArticle.author ? mainArticle.author.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                {mainArticle.author || 'Tim Redaksi Desa'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Penulis / Redaksi</span>
            </div>
          </div>

          {/* Big Bold Headline Title */}
          <Link href={`/berita/${mainArticle.slug}`} className="block group">
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-snug group-hover:text-[#0086C9] transition-colors">
              {mainArticle.title}
            </h2>
          </Link>

          {/* Category & Date Sub-info */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-[#0086C9] font-extrabold uppercase tracking-wider bg-[#0086C9]/10 px-2.5 py-0.5 rounded-md border border-[#0086C9]/20">
              {mainArticle.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{formatDate(mainArticle.createdAt)}</span>
          </div>

          {/* Main Large Rounded Image at Bottom */}
          <Link href={`/berita/${mainArticle.slug}`} className="block overflow-hidden rounded-2xl group relative shadow-lg">
            <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
              <img
                src={mainArticle.imageUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'}
                alt={mainArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>

        {/* Right Column (3 Stacked Horizontal Cards) */}
        <div className="lg:col-span-5 space-y-4">
          {secondaryArticles.slice(0, 3).map((art) => (
            <div
              key={art.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md hover:border-[#0086C9]/40 hover:shadow-xl transition-all flex items-center justify-between gap-4 group"
            >
              {/* Left Side of Card: Text */}
              <div className="flex-1 space-y-2">
                <Link href={`/berita/${art.slug}`}>
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0086C9] transition-colors">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                  {art.content.replace(/[\#\*\_\`]/g, '')}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-semibold pt-1">
                  <span className="text-[#0086C9] font-extrabold">{art.category}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{formatDate(art.createdAt)}</span>
                </div>
              </div>

              {/* Right Side of Card: Thumbnail Image Preview */}
              <Link
                href={`/berita/${art.slug}`}
                className="w-24 sm:w-28 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm group-hover:scale-105 transition-transform"
              >
                <img
                  src={art.imageUrl || 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
