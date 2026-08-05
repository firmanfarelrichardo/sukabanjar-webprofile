import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/sections/HeroSection';
import GalleryDriftWallSection from '@/components/sections/GalleryDriftWallSection';
import QuickAccessGrid from '@/components/sections/QuickAccessGrid';
import StatsCountUp from '@/components/sections/StatsCountUp';
import LatestArticlesSection from '@/components/sections/LatestArticlesSection';
import FeaturedUmkmSection from '@/components/sections/FeaturedUmkmSection';

export const revalidate = 0; // Dynamic real-time landing page

async function getLandingData() {
  try {
    const profile = await prisma.villageProfile.findFirst();

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

    const featuredUmkm = await prisma.umkm.findMany({
      where: { isApproved: true },
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

    let galleryItems: any[] = [];
    try {
      galleryItems = await (prisma as any).gallery.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          description: true,
          imageUrl: true,
        },
      });
    } catch (gErr) {
      console.warn('Prisma gallery fetch warning:', gErr);
    }

    const totalUmkm = await prisma.umkm.count({ where: { isApproved: true } });
    const totalFacilities = await prisma.facility.count();

    return {
      profile: profile || {
        name: 'Suka Banjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        heroImageUrl: null,
        heroSubtitle:
          'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan galeri pemandangan Desa Suka Banjar.',
        vision:
          'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        phone: '081234567890',
        email: 'desa.Suka Banjar@gmail.com',
        address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan',
      },
      stats: {
        areaSize: 4.52,
        totalPopulation: 5153,
        totalHamlet: 5,
        totalKK: 1388,
        totalUmkm: totalUmkm || 1,
        totalFacilities: totalFacilities || 12,
      },
      latestArticles: latestArticles.map((art) => ({
        ...art,
        createdAt: art.createdAt.toISOString(),
      })),
      featuredUmkm,
      galleryItems: galleryItems || [],
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    return {
      profile: {
        name: 'Suka Banjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        heroImageUrl: null,
        heroSubtitle:
          'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan galeri pemandangan Desa Suka Banjar.',
        vision:
          'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        phone: '081234567890',
        email: 'desa.Suka Banjar@gmail.com',
        address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan',
      },
      stats: {
        areaSize: 4.52,
        totalPopulation: 5153,
        totalHamlet: 5,
        totalKK: 1388,
        totalUmkm: 1,
        totalFacilities: 12,
      },
      latestArticles: [],
      featuredUmkm: [],
      galleryItems: [],
    };
  }
}

export default async function Home() {
  const data = await getLandingData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner Dinamis ("Selamat Datang di Desa Suka Banjar") */}
      <HeroSection
        name={data.profile.name}
        subdistrict={data.profile.subdistrict}
        district={data.profile.district}
        province={data.profile.province}
        heroImageUrl={data.profile.heroImageUrl}
        heroSubtitle={data.profile.heroSubtitle}
      />

      {/* 2. DriftWall 3D ReactBits Component (Terletak setelah Hero, sebelum Akses Cepat Portal) */}
      <GalleryDriftWallSection galleryItems={data.galleryItems} />

      {/* 3. Quick Access Grid ("Akses Cepat Portal Desa Suka Banjar") */}
      <QuickAccessGrid />

      {/* 4. Statistik Ringkas Count Up */}
      <StatsCountUp stats={data.stats} />

      {/* 5. Berita & Artikel Terbaru */}
      <LatestArticlesSection articles={data.latestArticles} />

      {/* 6. Produk UMKM Unggulan */}
      <FeaturedUmkmSection products={data.featuredUmkm} />
    </div>
  );
}
