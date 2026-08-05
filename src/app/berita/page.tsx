'use client';

import { useState, useEffect, useMemo } from 'react';
import ArticleHeader from '@/components/sections/berita/ArticleHeader';
import ArticleFeaturedHero, { ArticleItem } from '@/components/sections/berita/ArticleFeaturedHero';
import ArticleMiddleBanners from '@/components/sections/berita/ArticleMiddleBanners';
import ArticleLatestGrid from '@/components/sections/berita/ArticleLatestGrid';
import Pagination from '@/components/ui/Pagination';

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
  'KKN',
  'Lainnya',
];

export default function BeritaPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset page ke 1 saat filter pencarian atau kategori berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Threshold: > 6 berita -> 6 berita per halaman
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    return filteredArticles.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredArticles, currentPage]);

  const mainArticle = paginatedArticles[0] || articles[0];
  const secondaryArticles = paginatedArticles.slice(1, 4);
  const middleBannerArticles = paginatedArticles.slice(4, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#0086C9] selection:text-white">
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
        <div className="text-center py-32 text-slate-500 text-sm animate-pulse font-medium">
          Memuat portal berita & pengumuman Desa Suka Banjar...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-32 space-y-3">
          <p className="text-slate-600 text-base font-semibold">
            Tidak ditemukan berita dengan kata kunci atau kategori tersebut.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('Semua');
            }}
            className="px-4 py-2 rounded-xl bg-[#0086C9] text-white font-extrabold text-xs shadow-md cursor-pointer hover:bg-[#006ca3]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <main className="space-y-6 pb-16">
          {/* Top Featured Hero Section */}
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
          <ArticleLatestGrid articles={paginatedArticles} />

          {/* Pagination (Berlaku ketika berita > 6) */}
          <div className="container-section px-4 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              totalItems={filteredArticles.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemName="berita & pengumuman"
            />
          </div>
        </main>
      )}
    </div>
  );
}
