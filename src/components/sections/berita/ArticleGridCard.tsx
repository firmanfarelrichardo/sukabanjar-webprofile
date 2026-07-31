import Link from 'next/link';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  author: string;
  createdAt: string;
}

interface ArticleGridCardProps {
  articles: ArticleItem[];
}

export default function ArticleGridCard({ articles }: ArticleGridCardProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <Newspaper size={40} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">Berita Tidak Ditemukan</h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Tidak ada berita atau pengumuman yang cocok dengan pencarian yang Anda masukkan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {articles.map((item) => {
        const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        // Strip HTML tags for clean excerpt
        const cleanContent = item.content.replace(/<[^>]*>?/gm, '');

        return (
          <article
            key={item.id}
            className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              {/* Image / Cover Decorative Placeholder */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 flex items-center justify-center text-white/20">
                    <Newspaper size={44} className="text-primary-400/40" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-950/85 text-white backdrop-blur-md">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-3">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-primary-500" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-primary-500" />
                    {item.author || 'Admin'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 font-heading leading-snug">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {cleanContent}
                </p>
              </div>
            </div>

            {/* Read Button */}
            <div className="p-6 pt-0">
              <Link
                href={`/berita/${item.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
