import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, User, ArrowLeft, Newspaper, ChevronRight } from 'lucide-react';
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
        title: 'Penyuluhan Kesehatan Gratis Balai Desa Hari Sabtu',
        slug: 'penyuluhan-kesehatan-gratis-balai-desa-hari-sabtu',
        content: `Pemerintah Desa Sukabanjar bekerja sama dengan Puskesmas Kecamatan Sidomulyo dan Tim KKN Universitas Lampung akan menyelenggarakan kegiatan Penyuluhan dan Pemeriksaan Kesehatan Gratis bagi seluruh warga masyarakat Desa Sukabanjar.\n\nKegiatan ini meliputi:\n1. Pemeriksaan tekanan darah dan gula darah secara gratis.\n2. Konsultasi kesehatan lansia dan balita.\n3. Pembagian vitamin dan edukasi pola hidup bersih dan sehat (PHBS).\n\nAcara akan dilaksanakan pada hari Sabtu, jam 08.00 WIB bertempat di Balai Desa Sukabanjar. Diharapkan seluruh warga masyarakat dapat memanfaatkan fasilitas pemeriksaan kesehatan ini secara maksimal.`,
        category: 'Pengumuman',
        imageUrl: null,
        isDraft: false,
        author: 'Tim KKN Unila',
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: 'art-2',
        title: 'Gotong Royong Perbaikan Saluran Irigasi Dusun 2',
        slug: 'gotong-royong-perbaikan-saluran-irigasi-dusun-2',
        content: `Warga masyarakat Dusun 2 Desa Sukabanjar bersama perangkat desa menggelar aksi gotong royong kerja bakti membersihkan dan memperbaiki saluran irigasi pertanian.\n\nKegiatan ini bertujuan untuk memastikan kelancaran pasokan air menuju lahan persawahan warga menjelang musim tanam mendatang. Kepala Desa Sukabanjar menyampaikan apresiasi yang setinggi-tingginya atas kekompakan dan semangat kebersamaan warga Dusun 2 yang terus menjaga tradisi gotong royong luhur desa.`,
        category: 'Kegiatan',
        imageUrl: null,
        isDraft: false,
        author: 'Sekretaris Desa',
        createdAt: new Date(Date.now() - 86400000 * 4),
      },
      {
        id: 'art-3',
        title: 'Pelatihan Digitalisasi UMKM Produk Olahan Pisang oleh Mahasiswa KKN',
        slug: 'pelatihan-digitalisasi-umkm-produk-olahan-pisang-oleh-mahasiswa-kkn',
        content: `Tim Mahasiswa KKN Unila menyelenggarakan workshop digitalisasi pemasaran usaha mikro bagi pelaku UMKM olahan pisang di Desa Sukabanjar.\n\nDalam pelatihan ini, para pelaku usaha warga diberikan bimbingan mengenai pembuatan foto produk yang menarik, pendaftaran titik usaha di Google Maps, serta tata cara memanfaatkan media sosial dan aplikasi pengiriman WhatsApp untuk meningkatkan jangkauan penjualan produk lokal khas Sukabanjar.`,
        category: 'KKN',
        imageUrl: null,
        isDraft: false,
        author: 'Tim KKN Unila',
        createdAt: new Date(Date.now() - 86400000 * 6),
      },
      {
        id: 'art-4',
        title: 'Peresmian Lampu Penerangan Jalan Umum Tenaga Surya',
        slug: 'peresmian-lampu-penerangan-jalan-umum-tenaga-surya',
        content: `Pemerintah Desa Sukabanjar resmi mengoperasikan 10 unit lampu Penerangan Jalan Umum (PJU) berbasis tenaga surya yang dipasang di beberapa titik perlintasan jalan dusun utama.\n\nPemasangan PJU ramah lingkungan ini diharapkan dapat meningkatkan kenyamanan dan keamanan mobilitas warga masyarakat pada malam hari.`,
        category: 'Pembangunan',
        imageUrl: null,
        isDraft: false,
        author: 'Kaur Pembangunan',
        createdAt: new Date(Date.now() - 86400000 * 8),
      },
    ];

    return defaultArticles.find((a) => a.slug === slug) || null;
  } catch (error) {
    console.error('Error loading article detail:', error);
    return null;
  }
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
    title: article.title,
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

  const formattedDate = new Date(article.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = article.content.split('\n\n');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-primary-950 text-white py-16 md:py-24 pt-36 sm:pt-40 md:pt-36 overflow-hidden">
        <div className="container-section relative z-10 max-w-3xl mx-auto space-y-4 text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-primary-400 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={14} className="text-slate-600" />
            <Link href="/berita" className="hover:text-primary-400 transition-colors">
              Berita
            </Link>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-primary-400 font-semibold line-clamp-1">{article.category}</span>
          </nav>

          {/* Category Badge */}
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-500 text-slate-950">
            {article.category}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading leading-tight text-white text-balance">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-primary-400" />
              Penulis: {article.author || 'Admin Desa'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Article Body */}
      <section className="section-padding py-12">
        <div className="container-section max-w-3xl mx-auto space-y-8">
          {/* Back Button */}
          <div>
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Kembali ke Portal Berita
            </Link>
          </div>

          {/* Article Container Card */}
          <article className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
            {/* Cover Image if available */}
            {article.imageUrl && (
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto max-h-[450px] object-cover"
                />
              </div>
            )}

            {/* Paragraph Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed space-y-4">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Social Share Component */}
            <SocialShareButtons title={article.title} />
          </article>
        </div>
      </section>
    </div>
  );
}
