import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'Penyuluhan Kesehatan Gratis Balai Desa Hari Sabtu',
    slug: 'penyuluhan-kesehatan-gratis-balai-desa-hari-sabtu',
    content: `Pemerintah Desa Sukabanjar bekerja sama dengan Puskesmas Kecamatan Sidomulyo dan Tim KKN Universitas Lampung akan menyelenggarakan kegiatan Penyuluhan dan Pemeriksaan Kesehatan Gratis bagi seluruh warga masyarakat Desa Sukabanjar.\n\nKegiatan ini meliputi:\n1. Pemeriksaan tekanan darah dan gula darah secara gratis.\n2. Konsultasi kesehatan lansia dan balita.\n3. Pembagian vitamin dan edukasi pola hidup bersih dan sehat (PHBS).\n\nAcara akan dilaksanakan pada hari Sabtu, jam 08.00 WIB bertempat di Balai Desa Sukabanjar. Diharapkan seluruh warga masyarakat dapat memanfaatkan fasilitas pemeriksaan kesehatan ini secara maksimal.`,
    category: 'Pengumuman',
    imageUrl: null,
    isDraft: false,
    author: 'Tim KKN Unila',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
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
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
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
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
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
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (article && !article.isDraft) {
      return NextResponse.json({
        success: true,
        data: article,
      });
    }

    // Fallback matching
    const fallback = DEFAULT_ARTICLES.find((a) => a.slug === slug);
    if (fallback) {
      return NextResponse.json({
        success: true,
        data: fallback,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Artikel tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching article detail:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil detail artikel',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
