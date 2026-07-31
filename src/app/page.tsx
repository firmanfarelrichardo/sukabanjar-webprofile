import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/sections/HeroSection';
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

    const totalUmkm = await prisma.umkm.count({ where: { isApproved: true } });
    const totalFacilities = await prisma.facility.count();

    return {
      profile: profile || {
        name: 'Sukabanjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        heroImageUrl: null,
        heroSubtitle:
          'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan pariwisata Desa Sukabanjar.',
        vision:
          'Terwujudnya Desa Sukabanjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        phone: '081234567890',
        email: 'desa.sukabanjar@gmail.com',
        address: 'Jl. Raya Desa Sukabanjar, Kec. Sidomulyo, Kab. Lampung Selatan',
      },
      stats: {
        areaSize: 4.52,
        totalPopulation: 3420,
        totalHamlet: 6,
        totalUmkm: totalUmkm || 18,
        totalFacilities: totalFacilities || 12,
      },
      latestArticles: latestArticles.map((art) => ({
        ...art,
        createdAt: art.createdAt.toISOString(),
      })),
      featuredUmkm,
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    return {
      profile: {
        name: 'Sukabanjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        heroImageUrl: null,
        heroSubtitle:
          'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan pariwisata Desa Sukabanjar.',
        vision:
          'Terwujudnya Desa Sukabanjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        phone: '081234567890',
        email: 'desa.sukabanjar@gmail.com',
        address: 'Jl. Raya Desa Sukabanjar, Kec. Sidomulyo, Kab. Lampung Selatan',
      },
      stats: {
        areaSize: 4.52,
        totalPopulation: 3420,
        totalHamlet: 6,
        totalUmkm: 18,
        totalFacilities: 12,
      },
      latestArticles: [],
      featuredUmkm: [],
    };
  }
}

export default async function Home() {
  const data = await getLandingData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Dinamis */}
      <HeroSection
        name={data.profile.name}
        subdistrict={data.profile.subdistrict}
        district={data.profile.district}
        province={data.profile.province}
        heroImageUrl={data.profile.heroImageUrl}
        heroSubtitle={data.profile.heroSubtitle}
      />

      {/* Quick Access Grid */}
      <QuickAccessGrid />

      {/* Statistik Ringkas Count Up */}
      <StatsCountUp stats={data.stats} />

      {/* Berita & Artikel Terbaru */}
      <LatestArticlesSection articles={data.latestArticles} />

      {/* Produk UMKM Unggulan */}
      <FeaturedUmkmSection products={data.featuredUmkm} />
    </div>
  );
}
