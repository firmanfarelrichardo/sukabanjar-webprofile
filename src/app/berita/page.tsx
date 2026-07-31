'use client';

import { useState, useEffect, useMemo } from 'react';
import ArticleHero from '@/components/sections/berita/ArticleHero';
import ArticleSearchFilter from '@/components/sections/berita/ArticleSearchFilter';
import ArticleGridCard, { ArticleItem } from '@/components/sections/berita/ArticleGridCard';

export default function BeritaPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data artikel dari API
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

  // Filter artikel berdasarkan pencarian & kategori
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      // Filter kata kunci
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter kategori
      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <ArticleHero totalArticles={articles.length} />

      {/* Main Content Section */}
      <section className="section-padding bg-slate-50 relative">
        <div className="container-section space-y-8">
          {/* Search & Category Filter Bar */}
          <ArticleSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Article Grid */}
          {isLoading ? (
            <div className="text-center py-16 text-slate-400 text-sm animate-pulse">
              Memuat portal berita & pengumuman desa...
            </div>
          ) : (
            <ArticleGridCard articles={filteredArticles} />
          )}
        </div>
      </section>
    </div>
  );
}
