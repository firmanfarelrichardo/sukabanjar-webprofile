import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProfileHero from '@/components/sections/profil/ProfileHero';
import HistorySection from '@/components/sections/profil/HistorySection';
import VisionMissionSection from '@/components/sections/profil/VisionMissionSection';
import ApparatusSection from '@/components/sections/profil/ApparatusSection';

export const metadata: Metadata = {
  title: 'Profil Desa',
  description:
    'Sejarah, visi & misi, serta struktur organisasi perangkat desa Desa Suka Banjar, Kecamatan Sidomulyo.',
};

export const revalidate = 0; // Dynamic real-time data for profile page

async function getProfilePageData() {
  try {
    const profile = await prisma.villageProfile.findFirst();
    const apparatus = await prisma.apparatus.findMany({
      orderBy: { orderNum: 'asc' },
    });

    return {
      profile: profile || {
        name: 'Suka Banjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        historyCardTitle: 'Warisan Nilai & Gotong Royong',
        historyCardQuote:
          'Menjaga peninggalan nilai luhur pendiri desa, membangun tatanan kemasyarakatan yang harmonis dan sejalan dengan perkembangan jaman digital.',
        history:
          'Desa Suka Banjar didirikan dengan semangat kebersamaan dan gotong royong warga masyarakat. Nama "Suka Banjar" memiliki makna filosofis yang mendalam, di mana "Suka" melambangkan kedamaian dan kegembiraan, serta "Banjar" melambangkan perkampungan atau tatanan sosial yang teratur dan harmonis.\n\nSecara historis, wilayah ini awalnya berkembang dari pemukiman warga berbasis sektor pertanian dan perkebunan. Berkat kegigihan para tokoh pendiri desa, Suka Banjar tumbuh menjadi salah satu wilayah yang mandiri dan berdaya saing di Kecamatan Sidomulyo, Kabupaten Lampung Selatan.',
        vision:
          'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        missions: [
          'Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa yang transparan, akuntabel, dan berbasis digital.',
          'Mengembangkan potensi UMKM lokal, ekonomi kreatif, dan hasil sektor pertanian untuk meningkatkan kesejahteraan warga.',
          'Meningkatkan pembangunan infrastruktur fasilitas publik yang merata, aman, serta ramah lingkungan.',
          'Memberdayakan pemuda, lembaga kemasyarakatan, dan menjaga kelestarian budaya serta nilai gotong royong.',
        ],
      },
      apparatus: apparatus || [],
    };
  } catch (error) {
    console.error('Error fetching profile page data:', error);
    return {
      profile: {
        name: 'Suka Banjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        historyCardTitle: 'Warisan Nilai & Gotong Royong',
        historyCardQuote:
          'Menjaga peninggalan nilai luhur pendiri desa, membangun tatanan kemasyarakatan yang harmonis dan sejalan dengan perkembangan jaman digital.',
        history:
          'Desa Suka Banjar didirikan dengan semangat kebersamaan dan gotong royong warga masyarakat. Berlokasi strategis di Kecamatan Sidomulyo, Lampung Selatan.',
        vision:
          'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        missions: [
          'Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa.',
          'Mengembangkan potensi UMKM lokal dan sektor pertanian.',
        ],
      },
      apparatus: [],
    };
  }
}

export default async function ProfilePage() {
  const data = await getProfilePageData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <ProfileHero
        villageName={data.profile.name}
        subdistrict={data.profile.subdistrict}
        district={data.profile.district}
      />

      {/* Sejarah Desa & Kilas Balik Historis */}
      <HistorySection
        historyText={data.profile.history}
        historyCardTitle={data.profile.historyCardTitle || undefined}
        historyCardQuote={data.profile.historyCardQuote || undefined}
        villageName={data.profile.name}
      />

      {/* Visi & Misi Desa */}
      <VisionMissionSection
        vision={data.profile.vision}
        missions={data.profile.missions}
      />

      {/* Struktur Organisasi Perangkat Desa */}
      <ApparatusSection apparatus={data.apparatus} />
    </div>
  );
}
