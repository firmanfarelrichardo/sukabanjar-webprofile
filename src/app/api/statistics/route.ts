import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Default statistics data
    const defaultData = {
      overview: {
        totalPopulation: 3450,
        malePopulation: 1780,
        femalePopulation: 1670,
        totalHouseholds: 890,
        totalAreaKm2: 12.5,
        sexRatio: 106.6,
      },
      dusunDistribution: [
        { name: 'Dusun 1', population: 850, households: 220 },
        { name: 'Dusun 2', population: 920, households: 235 },
        { name: 'Dusun 3', population: 810, households: 210 },
        { name: 'Dusun 4', population: 870, households: 225 },
      ],
      occupations: [
        { category: 'Petani / Pekebun', count: 1250, percentage: 36.2 },
        { category: 'Buruh Tani & Harian', count: 820, percentage: 23.8 },
        { category: 'Pedagang & UMKM', count: 480, percentage: 13.9 },
        { category: 'Wiraswasta / Jasa', count: 350, percentage: 10.1 },
        { category: 'Karyawan Swasta', count: 310, percentage: 9.0 },
        { category: 'PNS / TNI / Polri', count: 120, percentage: 3.5 },
        { category: 'Lainnya', count: 120, percentage: 3.5 },
      ],
      educationLevels: [
        { level: 'Tidak / Belum Sekolah', count: 280, percentage: 8.1 },
        { level: 'Tamat SD / Sederajat', count: 1150, percentage: 33.3 },
        { level: 'Tamat SMP / Sederajat', count: 980, percentage: 28.4 },
        { level: 'Tamat SMA / SMK', count: 820, percentage: 23.8 },
        { level: 'Diploma / Sarjana (S1/S2)', count: 220, percentage: 6.4 },
      ],
      ageGroups: [
        { range: '0 - 4 Tahun (Balita)', count: 260, percentage: 7.5 },
        { range: '5 - 14 Tahun (Anak-anak)', count: 580, percentage: 16.8 },
        { range: '15 - 24 Tahun (Remaja)', count: 620, percentage: 18.0 },
        { range: '25 - 54 Tahun (Usia Produktif)', count: 1420, percentage: 41.2 },
        { range: '55 - 64 Tahun (Pra-Lansia)', count: 340, percentage: 9.8 },
        { range: '65+ Tahun (Lansia)', count: 230, percentage: 6.7 },
      ],
    };

    return NextResponse.json({
      success: true,
      data: defaultData,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data statistik desa',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
