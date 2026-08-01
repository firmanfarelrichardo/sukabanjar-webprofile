import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ChevronRight, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import SocialShareButtons from '@/components/sections/berita/SocialShareButtons';

export const revalidate = 60; // Revalidate data every 60 seconds

async function getArticleDetail(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (article && !article.isDraft) {
      return article;
    }

    // Default fallback articles if DB doesn't have the slug
    const defaultArticles = [
      {
        id: 'art-1',
        title: 'Pembukaan Turnamen Olahraga Warga & Pentas Seni Pemuda Suka Banjar',
        slug: 'pembukaan-turnamen-olahraga-warga-pentas-seni-pemuda-suka-banjar',
        content: `Pemerintah Desa Suka Banjar bersama Karang Taruna resmi membuka gelaran Turnamen Olahraga Antar-Dusun dan Pentas Seni Kebudayaan Desa Suka Banjar 2026.\n\nAcara yang berlangsung di Lapangan Utama Desa ini bertujuan untuk mempererat tali silaturahmi, memupuk kebersamaan antarwarga, serta menggali potensi bakat generasi muda di bidang olahraga sepak bola, bola voli, dan bulu tangkis.\n\nKepala Desa Suka Banjar dalam sambutannya mengajak seluruh masyarakat untuk senantiasa menjunjung tinggi nilai sportivitas, kebersamaan, dan menjaga ketertiban selama berlangsungnya turnamen selama 2 pekan ke depan.`,
        category: 'Kegiatan Desa',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
        isDraft: false,
        author: 'Tim Redaksi Desa',
        createdAt: new Date(Date.now() - 86400000 * 1),
      },
      {
        id: 'art-2',
        title: 'Pemasangan PJU Tenaga Surya & Perbaikan Jalan Utama Dusun 2',
        slug: 'pemasangan-pju-tenaga-surya-perbaikan-jalan-utama-dusun-2',
        content: `Pemerintah Desa Suka Banjar resmi merampungkan pemasangan 10 unit Lampu Penerangan Jalan Umum (PJU) berbasis Tenaga Surya serta meresmikan pengaspalan jalan Dusun 2.\n\nInisiatif ini merupakan wujud komitmen pemerintah desa dalam meningkatkan fasilitas infrastruktur publik yang ramah lingkungan dan memberikan rasa aman serta kenyamanan mobilitas warga saat malam hari.`,
        category: 'Pembangunan',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1200&q=80',
        isDraft: false,
        author: 'Kaur Pembangunan',
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: 'art-3',
        title: 'Pelatihan Digitalisasi Pemasaran UMKM & Google Maps Bersama KKN',
        slug: 'pelatihan-digitalisasi-pemasaran-umkm-google-maps-bersama-kkn',
        content: `Tim Mahasiswa KKN Universitas Lampung bersama perangkat desa menggelar workshop bimbingan teknis pemasaran digital bagi para pelaku usaha mikro di Desa Suka Banjar.\n\nDalam kegiatan ini, warga diajarkan pendaftaran titik lokasi UMKM pada Google Maps, pembuatan foto produk profesional dengan smartphone, serta strategi penjualan melalui platform media sosial WhatsApp & Instagram.`,
        category: 'Pendidikan',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        isDraft: false,
        author: 'Tim KKN Unila',
        createdAt: new Date(Date.now() - 86400000 * 4),
      },
      {
        id: 'art-4',
        title: 'Pemeriksaan Kesehatan Gratis & Posyandu Lansia di Balai Desa',
        slug: 'pemeriksaan-kesehatan-gratis-posyandu-lansia-di-balai-desa',
        content: `Puskesmas Sidomulyo bekerja sama dengan Tim Penggerak PKK Desa Suka Banjar menyelenggarakan pelayanan cek kesehatan gratis bagi balita dan warga lansia.\n\nLayanan meliputi pemeriksaan tekanan darah, gula darah, pemberian vitamin tambahan, serta konseling gizi guna memastikan kesehatan warga terjaga secara optimal.`,
        category: 'Kesehatan',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        isDraft: false,
        author: 'Tim PKK Desa',
        createdAt: new Date(Date.now() - 86400000 * 6),
      },
    ];

    return defaultArticles.find((a) => a.slug === slug) || null;
  } catch (error) {
    console.error('Error loading article detail:', error);
    return null;
  }
}

async function getPopularArticles(currentSlug: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isDraft: false,
        slug: { not: currentSlug },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    if (articles && articles.length > 0) return articles;
  } catch (err) {
    console.error('Error fetching popular articles:', err);
  }

  // Fallback items
  return [
    {
      id: 'pop-1',
      title: 'Pemasangan PJU Tenaga Surya & Perbaikan Jalan Dusun 2',
      slug: 'pemasangan-pju-tenaga-surya-perbaikan-jalan-utama-dusun-2',
      content: 'Pemerintah Desa Suka Banjar merampungkan pengaspalan dan penerangan jalan umum...',
      category: 'Pembangunan',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      id: 'pop-2',
      title: 'Pelatihan Digital Pemasaran UMKM & Lokasi Google Maps',
      slug: 'pelatihan-digitalisasi-pemasaran-umkm-google-maps-bersama-kkn',
      content: 'Tim KKN Unila mengajarkan pembuatan foto produk dan digitalisasi usaha warga...',
      category: 'Pendidikan',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(Date.now() - 86400000 * 4),
    },
    {
      id: 'pop-3',
      title: 'Pemeriksaan Kesehatan Gratis Balai Desa Hari Sabtu',
      slug: 'pemeriksaan-kesehatan-gratis-posyandu-lansia-di-balai-desa',
      content: 'Pemeriksaan gula darah dan pembagian vitamin gratis untuk lansia dan balita...',
      category: 'Kesehatan',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(Date.now() - 86400000 * 6),
    },
    {
      id: 'pop-4',
      title: 'Panen Raya Padi Organik & Ketahanan Pangan Warga',
      slug: 'panen-raya-padi-organik-penguatan-ketahanan-pangan-warga',
      content: 'Kelompok tani merayakan keberhasilan panen raya padi organik musim ini...',
      category: 'Pertanian',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(Date.now() - 86400000 * 8),
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleDetail(params.slug);
  if (!article) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  return {
    title: `${article.title} — Desa Suka Banjar`,
    description: article.content.slice(0, 160),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleDetail(params.slug);

  if (!article) {
    notFound();
  }

  const popularArticles = await getPopularArticles(params.slug);

  const formattedDate = new Date(article.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = article.content.split('\n\n');

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-300 selection:text-slate-900">
      {/* Top Padding Container so title sits cleanly below floating GlassSurface header */}
      <div className="pt-36 sm:pt-40 md:pt-44 pb-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Back Link Button */}
        <div className="mb-6">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Portal Berita</span>
          </Link>
        </div>

        {/* 2-Column Main Layout Grid (Presisi Sesuai Gambar Referensi Website Berita) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Main Article Detail Content (~68% width) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto pb-1">
              <Link href="/berita" className="hover:text-slate-900 transition-colors">
                News
              </Link>
              <ChevronRight size={13} className="text-slate-400 shrink-0" />
              <span className="hover:text-slate-900 transition-colors">{article.category}</span>
              <ChevronRight size={13} className="text-slate-400 shrink-0" />
              <span className="text-slate-900 font-semibold truncate max-w-[200px]">Article</span>
            </nav>

            {/* Article Big Title & Top Meta Actions */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-snug">
                  {article.title}
                </h1>

                {/* Bookmark & Share Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-500 transition-colors cursor-pointer" title="Simpan Artikel">
                    <Bookmark size={18} />
                  </button>
                  <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer" title="Bagikan">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* By Line & Date */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <div>
                  <span className="text-slate-400 font-normal">By: </span>
                  <span className="font-bold text-slate-800">{article.author || 'Tim Redaksi Desa'}</span>
                </div>
                <span>•</span>
                <div>
                  <span className="text-slate-400 font-normal">Diterbitkan: </span>
                  <span className="font-semibold text-slate-700">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Featured Cover Photo */}
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-slate-100 aspect-[16/9] w-full">
                <img
                  src={
                    article.imageUrl ||
                    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium italic">
                Foto: Dokumentasi Kegiatan Resmi Desa Suka Banjar
              </p>
            </div>

            {/* Paragraph Body Content */}
            <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed space-y-6 pt-2">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Social Share Buttons Component */}
            <div className="pt-8 border-t border-slate-200">
              <SocialShareButtons title={article.title} />
            </div>
          </div>

          {/* Right Column: Sidebar (~32% width - Presisi Gambar Referensi Website Berita) */}
          <div className="lg:col-span-4 space-y-8 sticky top-28">
            {/* Widget 1: Follow us (4 Colorful Action Buttons) */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
              <h3 className="font-heading font-black text-lg text-slate-900 tracking-wide">
                Follow us
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Facebook Button */}
                <a
                  href="https://facebook.com/desasukabanjar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#3b5998] hover:bg-[#324b80] text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* Twitter / X Button */}
                <a
                  href="https://x.com/desasukabanjar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#1da1f2] hover:bg-[#1a91da] text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                  </svg>
                  <span>Twitter</span>
                </a>

                {/* TikTok Button */}
                <a
                  href="https://tiktok.com/@desasukabanjar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.67.75-5.37 2.76-7.07 1.34-1.15 3.07-1.8 4.83-1.81.18.01.36.01.54.04V12.7c-.15-.02-.3-.02-.45-.02-1.07.01-2.12.44-2.87 1.21-.8.8-1.19 1.96-1.07 3.09.11 1.19.82 2.26 1.88 2.8 1.05.54 2.34.52 3.37-.06.94-.52 1.55-1.5 1.63-2.57.06-1.44.02-2.88.03-4.32V.02z" />
                  </svg>
                  <span>Tiktok</span>
                </a>

                {/* Instagram Button */}
                <a
                  href="https://instagram.com/desa.sukabanjar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Widget 2: Popular news (Berita Terkait / Populer - Presisi Referensi) */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-6 shadow-sm">
              <h3 className="font-heading font-black text-lg text-slate-900 tracking-wide">
                Popular news
              </h3>

              <div className="space-y-5 divide-y divide-slate-200/80">
                {popularArticles.map((pop, idx) => {
                  const popDate = new Date(pop.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <div key={pop.id || idx} className={`${idx > 0 ? 'pt-4' : ''} flex items-start justify-between gap-3 group`}>
                      <div className="flex-1 space-y-1">
                        <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
                          {popDate}
                        </span>

                        <Link href={`/berita/${pop.slug}`}>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                            {pop.title}
                          </h4>
                        </Link>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-normal">
                          {pop.content.replace(/[\#\*\_\`]/g, '')}
                          <Link href={`/berita/${pop.slug}`} className="text-amber-600 font-bold ml-1 hover:underline">
                            Read more...
                          </Link>
                        </p>
                      </div>

                      <Link
                        href={`/berita/${pop.slug}`}
                        className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200 shadow-sm group-hover:scale-105 transition-transform"
                      >
                        <img
                          src={
                            pop.imageUrl ||
                            'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={pop.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
