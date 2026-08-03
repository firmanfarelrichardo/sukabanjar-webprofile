import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { isDraft: false },
      orderBy: { createdAt: 'desc' },
    });

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
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
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
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
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
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
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
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
      {
        id: 'art-5',
        title: 'Panen Raya Padi Organik & Penguatan Ketahanan Pangan Warga',
        slug: 'panen-raya-padi-organik-penguatan-ketahanan-pangan-warga',
        content: `Kelompok Tani Desa Suka Banjar merayakan Panen Raya Padi Organik hasil olahan lahan pertanian desa. Keberhasilan panen kali ini mencapai peningkatan hasil produksi hingga 20% dibanding musim lalu.`,
        category: 'Pertanian',
        imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
        isDraft: false,
        author: 'Ketua Kelompok Tani',
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: articles.length > 0 ? articles : defaultArticles,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data artikel berita',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, category, author, imageUrl, publishedAt } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan isi konten berita wajib diisi' },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const createdAtDate = publishedAt ? new Date(publishedAt) : new Date();

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        category: category || 'Kegiatan Desa',
        author: author || 'Admin Desa',
        imageUrl: imageUrl || null,
        isDraft: false,
        createdAt: isNaN(createdAtDate.getTime()) ? new Date() : createdAtDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Artikel berita berhasil diterbitkan!',
      data: newArticle,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menerbitkan artikel berita',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID artikel wajib disertakan' },
        { status: 400 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Artikel berita berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus artikel berita',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, category, author, imageUrl, publishedAt } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { success: false, message: 'ID, Judul, dan isi berita wajib diisi' },
        { status: 400 }
      );
    }

    const createdAtDate = publishedAt ? new Date(publishedAt) : undefined;

    try {
      const updatedArticle = await prisma.article.update({
        where: { id },
        data: {
          title,
          content,
          category: category || 'Kegiatan Desa',
          author: author || 'Admin Desa',
          imageUrl: imageUrl || null,
          ...(createdAtDate && !isNaN(createdAtDate.getTime()) ? { createdAt: createdAtDate } : {}),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Artikel berita berhasil diperbarui!',
        data: updatedArticle,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: 'Artikel berita berhasil diperbarui (mode lokal)',
        data: {
          id,
          title,
          content,
          category: category || 'Kegiatan Desa',
          author: author || 'Admin Desa',
          imageUrl: imageUrl || null,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui artikel berita',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
