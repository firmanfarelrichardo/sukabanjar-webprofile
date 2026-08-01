import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch data profil desa
    const profile = await prisma.villageProfile.findFirst();

    // 2. Fetch data perangkat desa
    const apparatus = await prisma.apparatus.findMany({
      orderBy: { orderNum: 'asc' },
    });

    // 3. Data demografi desa (Statistik Desa Suka Banjar)
    const demographics = {
      totalPopulation: 3420,
      totalHouseholds: 890,
      occupations: [
        { label: 'Petani / Pekebun', count: 1420, percentage: 41.5, color: 'bg-emerald-500' },
        { label: 'Buruh Tani', count: 850, percentage: 24.8, color: 'bg-green-500' },
        { label: 'Wiraswasta / UMKM', count: 520, percentage: 15.2, color: 'bg-amber-500' },
        { label: 'Pedagang', count: 310, percentage: 9.1, color: 'bg-orange-500' },
        { label: 'PNS / TNI / Polri / Guru', count: 180, percentage: 5.3, color: 'bg-blue-500' },
        { label: 'Lainnya', count: 140, percentage: 4.1, color: 'bg-slate-400' },
      ],
      education: [
        { label: 'SD / Sederajat', count: 1100, percentage: 32.2, color: 'bg-sky-500' },
        { label: 'SMP / Sederajat', count: 980, percentage: 28.7, color: 'bg-indigo-500' },
        { label: 'SMA / SMK', count: 1050, percentage: 30.7, color: 'bg-teal-500' },
        { label: 'Diploma / Sarjana (S1/S2)', count: 290, percentage: 8.4, color: 'bg-purple-500' },
      ],
      ageGroups: [
        { label: 'Anak-anak (0 - 14 thn)', count: 780, percentage: 22.8, color: 'bg-pink-500' },
        { label: 'Remaja & Pemuda (15 - 24 thn)', count: 620, percentage: 18.1, color: 'bg-cyan-500' },
        { label: 'Usia Produktif (25 - 59 thn)', count: 1640, percentage: 48.0, color: 'bg-emerald-500' },
        { label: 'Lansia (60+ thn)', count: 380, percentage: 11.1, color: 'bg-amber-500' },
      ],
    };

    return NextResponse.json({
      success: true,
      data: {
        profile: profile || {
          name: 'Suka Banjar',
          subdistrict: 'Sidomulyo',
          district: 'Lampung Selatan',
          province: 'Lampung',
          historyCardTitle: 'Warisan Nilai & Gotong Royong',
          historyCardQuote:
            'Menjaga peninggalan nilai luhur pendiri desa, membangun tatanan kemasyarakatan yang harmonis dan sejalan dengan perkembangan jaman digital.',
          history:
            'Desa Suka Banjar didirikan dengan semangat kebersamaan dan gotong royong warga. Terletak di wilayah strategis Kecamatan Sidomulyo, desa ini kaya akan potensi pertanian, perkebunan, dan UMKM olahan pangan lokal.',
          vision:
            'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
          missions: [
            'Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa yang transparan.',
            'Mengembangkan potensi UMKM lokal dan sektor pertanian untuk kesejahteraan warga.',
            'Meningkatkan infrastruktur fasilitas publik dan saluran aspirasi warga berbasis digital.',
          ],
          phone: '081234567890',
          email: 'desa.Suka Banjar@gmail.com',
          address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan',
        },
        apparatus: apparatus.length > 0 ? apparatus : [
          {
            id: '1',
            name: 'Nama Kepala Desa',
            role: 'Kepala Desa Suka Banjar',
            orderNum: 1,
            imageUrl: null,
          },
          {
            id: '2',
            name: 'Nama Sekretaris Desa',
            role: 'Sekretaris Desa',
            orderNum: 2,
            imageUrl: null,
          },
          {
            id: '3',
            name: 'Kaur Keuangan',
            role: 'Kepala Urusan Keuangan',
            orderNum: 3,
            imageUrl: null,
          },
          {
            id: '4',
            name: 'Kaur Perencanaan',
            role: 'Kepala Urusan Perencanaan',
            orderNum: 4,
            imageUrl: null,
          },
        ],
        demographics,
      },
    });
  } catch (error) {
    console.error('Error fetching village profile data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data profil desa',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
