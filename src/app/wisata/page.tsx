import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import TourismHero from '@/components/sections/wisata/TourismHero';
import TourismCardGrid from '@/components/sections/wisata/TourismCardGrid';
import TourismGuideCard from '@/components/sections/wisata/TourismGuideCard';

export const metadata: Metadata = {
  title: 'Destinasi Wisata & Alam',
  description:
    'Jelajahi keindahan pemandangan sawah bertingkat, bukit panorama, sungai jernih, dan spot sunset Desa Sukabanjar, Kecamatan Sidomulyo.',
};

export const revalidate = 60; // Revalidate data every 60 seconds

async function getTourismData() {
  try {
    const tourism = await prisma.tourism.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const defaultTourism = [
      {
        id: 'tour-1',
        title: 'Saung Kumpul Sawah Sukabanjar',
        description:
          'Area pemandangan hijau hamparan sawah bertingkat dilengkapi saung kayu tradisional untuk kumpul keluarga & santai sore.',
        location: 'Dusun 2, Desa Sukabanjar',
        imageUrl: null,
      },
      {
        id: 'tour-2',
        title: 'Bukit Panorama Perkebunan',
        description:
          'Spot sudut pandang perbukitan dengan lanskap hijau Sidomulyo yang memanjakan mata, sangat cocok untuk penikmat keindahan alam.',
        location: 'Dusun 4, Desa Sukabanjar',
        imageUrl: null,
      },
      {
        id: 'tour-3',
        title: 'Aliran Sungai Jernih & Saung KKN',
        description:
          'Area aliran sungai jernih berbatu alami yang sejuk dengan saung rested area buatan program pengabdian KKN.',
        location: 'Dusun 1, Desa Sukabanjar',
        imageUrl: null,
      },
      {
        id: 'tour-4',
        title: 'Spot Foto Sunset Kebun Kelapa',
        description:
          'Jajaran pepohonan kelapa tinggi dengan pemandangan matahari terbenam (sunset) yang sangat fotogenik untuk berfoto.',
        location: 'Dusun 3, Desa Sukabanjar',
        imageUrl: null,
      },
    ];

    return tourism.length > 0 ? tourism : defaultTourism;
  } catch (error) {
    console.error('Error loading tourism data:', error);
    return [];
  }
}

export default async function TourismPage() {
  const places = await getTourismData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <TourismHero totalSpots={places.length} />

      {/* Grid Destinasi Wisata */}
      <section className="section-padding bg-slate-50 relative">
        <div className="container-section space-y-8">
          <TourismCardGrid places={places} />
        </div>
      </section>

      {/* Guide & Etika Pengunjung */}
      <TourismGuideCard />
    </div>
  );
}
