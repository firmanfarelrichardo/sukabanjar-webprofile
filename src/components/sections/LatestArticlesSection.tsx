import LinkNext from 'next/link';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  createdAt: string;
  author: string;
}

interface LatestArticlesProps {
  articles: ArticleItem[];
}

export default function LatestArticlesSection({ articles }: LatestArticlesProps) {
  if (!articles || articles.length === 0) {
    return (
      <section className="section-padding bg-white">
        <div className="container-section text-center">
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <Newspaper size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Belum Ada Artikel</h3>
            <p className="text-xs text-slate-500">Berita dan pengumuman terbaru akan segera dipublikasikan.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200">
              Kabar Desa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Berita & Pengumuman Terbaru
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Ikuti kabar perkembangan kegiatan, pengumuman publik, dan program kerja Desa Suka Banjar.
            </p>
          </div>

          <LinkNext
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors shrink-0 group"
          >
            Lihat Semua Berita
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </LinkNext>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail Image / Placeholder */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-primary-950 flex items-center justify-center text-slate-500">
                        <Newspaper size={40} className="text-white/20" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={13} />
                        {item.author || 'Admin'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 font-heading">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {item.content.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                </div>

                {/* Footer read button */}
                <div className="p-5 sm:p-6 pt-0">
                  <LinkNext
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors"
                  >
                    Baca Selengkapnya
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </LinkNext>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
