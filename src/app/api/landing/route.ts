import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch data profil desa
    const profile = await prisma.villageProfile.findFirst({
      select: {
        name: true,
        subdistrict: true,
        district: true,
        province: true,
        heroImageUrl: true,
        vision: true,
        phone: true,
        email: true,
        address: true,
      },
    });

    // 2. Fetch pengumuman running text
    const announcements = await prisma.article.findMany({
      where: {
        category: 'Pengumuman',
        isDraft: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    });

    // 3. Fetch artikel terbaru
    const latestArticles = await prisma.article.findMany({
      where: { isDraft: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        author: true,
      },
    });

    // 4. Fetch UMKM unggulan
    const featuredUmkm = await prisma.umkm.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        ownerName: true,
        description: true,
        price: true,
        whatsapp: true,
        imageUrl: true,
      },
    });

    // 5. Hitung statistik dinamis
    const totalUmkm = await prisma.umkm.count();
    const totalFacilities = await prisma.facility.count();

    const stats = {
      areaSize: 4.52,      // km² (Statistik Desa Suka Banjar)
      totalPopulation: 3420, // Jiwa
      totalHamlet: 6,       // Dusun
      totalUmkm: totalUmkm || 18,
      totalFacilities: totalFacilities || 12,
    };

    return NextResponse.json({
      success: true,
      data: {
        profile: profile || {
          name: 'Suka Banjar',
          subdistrict: 'Sidomulyo',
          district: 'Lampung Selatan',
          province: 'Lampung',
          heroImageUrl: null,
          vision: 'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
          phone: '081234567890',
          email: 'desa.Suka Banjar@gmail.com',
          address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan',
        },
        announcements: announcements.length > 0 ? announcements : [
          {
            id: 'demo-1',
            title: 'Selamat Datang di Portal Resmi Desa Suka Banjar, Kecamatan Sidomulyo',
            slug: '#',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'demo-2',
            title: 'Layanan Pengaduan & E-Aspirasi Warga Kini Dibuka Secara Online',
            slug: '#',
            createdAt: new Date().toISOString(),
          },
        ],
        stats,
        latestArticles,
        featuredUmkm,
      },
    });
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data halaman utama',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
