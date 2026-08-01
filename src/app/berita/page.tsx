'use client';

import { useState, useEffect, useMemo } from 'react';
import ArticleHeader from '@/components/sections/berita/ArticleHeader';
import ArticleFeaturedHero, { ArticleItem } from '@/components/sections/berita/ArticleFeaturedHero';
import ArticleMiddleBanners from '@/components/sections/berita/ArticleMiddleBanners';
import ArticleLatestGrid from '@/components/sections/berita/ArticleLatestGrid';

const CATEGORIES = [
  'Semua',
  'Kegiatan Desa',
  'Pengumuman',
  'Pembangunan',
  'Pendidikan',
  'Pertanian',
  'Ekonomi',
  'Kesehatan',
  'Sosial & Budaya',
];

export default function BeritaPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch articles from API
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setArticles(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching articles data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadArticles();
  }, []);

  // Filter articles based on search & category selection
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, activeCategory]);

  const mainArticle = filteredArticles[0] || articles[0];
  const secondaryArticles = filteredArticles.slice(1, 4);
  const middleBannerArticles = filteredArticles.slice(4, 6);
  const latestArticles = filteredArticles.slice(6);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Header Bar with Search & Category Filter */}
      <ArticleHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={CATEGORIES}
      />

      {/* Main Content Sections */}
      {isLoading ? (
        <div className="text-center py-32 text-slate-400 text-sm animate-pulse font-medium">
          Memuat portal berita & pengumuman Desa Suka Banjar...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-32 space-y-3">
          <p className="text-slate-400 text-base font-semibold">
            Tidak ditemukan berita dengan kata kunci atau kategori tersebut.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('Semua');
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <main className="space-y-4">
          {/* Top Featured Hero Section (Presisi Gambar Referensi) */}
          {mainArticle && (
            <ArticleFeaturedHero
              mainArticle={mainArticle}
              secondaryArticles={secondaryArticles.length > 0 ? secondaryArticles : articles.slice(1, 4)}
            />
          )}

          {/* Middle 2-Banner Overlay Section */}
          {middleBannerArticles.length > 0 && (
            <ArticleMiddleBanners articles={middleBannerArticles} />
          )}

          {/* Bottom Latest Articles Grid Section */}
          <ArticleLatestGrid
            articles={
              latestArticles.length > 0
                ? latestArticles
                : filteredArticles.length > 3
                ? filteredArticles.slice(3)
                : filteredArticles
            }
          />
        </main>
      )}
    </div>
  );
}
