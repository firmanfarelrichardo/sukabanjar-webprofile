import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import SocialShareButtons from '@/components/sections/berita/SocialShareButtons';
import { parseJsonArray, formatSocialUrl } from '@/lib/utils';

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

async function getVillageProfileSocialMedia() {
  try {
    const profile = await (prisma as any).villageProfile.findFirst();
    if (profile && profile.socialMedia) {
      const parsed = parseJsonArray(profile.socialMedia);
      if (parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error fetching village profile socialMedia:', err);
  }
  return [
    { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/desasukabanjar' },
    { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/desa.sukabanjar' },
    { platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@desasukabanjar' },
    { platform: 'twitter', label: 'X / Twitter', url: 'https://x.com/desasukabanjar' },
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
  const socialMediaList = await getVillageProfileSocialMedia();

  const getSocialUrl = (platform: string, fallbackUrl: string) => {
    const match = socialMediaList.find(
      (sm: any) => sm.platform?.toLowerCase() === platform.toLowerCase()
    );
    const rawUrl = match && match.url ? match.url : fallbackUrl;
    return formatSocialUrl(rawUrl);
  };

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

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Main Article Detail Content (~68% width) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Article Big Title & Meta Line */}
            <div className="space-y-3 border-b border-slate-100 pb-6">
              <span className="inline-block px-3 py-1 rounded-md text-[11px] font-extrabold bg-amber-100 text-amber-900 uppercase tracking-wider">
                {article.category}
              </span>

              <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-snug">
                {article.title}
              </h1>

              {/* By Line & Date */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
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

          {/* Right Column: Sidebar (~32% width - Popular news) */}
          <div className="lg:col-span-4 space-y-8 sticky top-28">
            {/* Widget: Popular news (Berita Terkait / Populer - Dynamic) */}
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
