'use client';

import Link from 'next/link';
import { Calendar, User, ArrowRight, Newspaper, Edit3, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

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
  onEdit?: (article: ArticleItem) => void;
  onDelete?: (id: string) => void;
}

export default function ArticleGridCard({ articles, onEdit, onDelete }: ArticleGridCardProps) {
  const { isAdmin } = useAdmin();

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

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel berita "${title}"?`)) return;
    if (onDelete) onDelete(id);
  };

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
            className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-[#0086C9]/40 transition-all duration-300 hover:-translate-y-1"
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
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-[#0086C9]/30 flex items-center justify-center text-white/20">
                    <Newspaper size={44} className="text-[#0086C9]/40" />
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
                    <Calendar size={13} className="text-[#0086C9]" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-[#0086C9]" />
                    {item.author || 'Admin'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0086C9] transition-colors line-clamp-2 font-heading leading-snug">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {cleanContent}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/berita/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0086C9] hover:underline transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-colors"
                        title="Edit Artikel"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
                        title="Hapus Artikel"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
