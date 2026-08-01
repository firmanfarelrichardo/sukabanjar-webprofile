import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const defaultFacilities = [
      {
        id: 'fac-1',
        name: 'Kantor Balai Desa Suka Banjar',
        category: 'Pemerintahan',
        latitude: -5.5562,
        longitude: 105.4718,
        address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo',
        imageUrl: null,
      },
      {
        id: 'fac-2',
        name: 'SD Negeri 1 Suka Banjar',
        category: 'Pendidikan',
        latitude: -5.5585,
        longitude: 105.4735,
        address: 'Dusun 2, Desa Suka Banjar',
        imageUrl: null,
      },
      {
        id: 'fac-3',
        name: 'Pustu & Posyandu Suka Banjar',
        category: 'Kesehatan',
        latitude: -5.5545,
        longitude: 105.4702,
        address: 'Dusun 1, Desa Suka Banjar',
        imageUrl: null,
      },
      {
        id: 'fac-4',
        name: 'Masjid Jami Suka Banjar',
        category: 'Ibadah',
        latitude: -5.5570,
        longitude: 105.4725,
        address: 'Dusun 2, Desa Suka Banjar',
        imageUrl: null,
      },
      {
        id: 'fac-5',
        name: 'PAUD Melati Suka Banjar',
        category: 'Pendidikan',
        latitude: -5.5592,
        longitude: 105.4750,
        address: 'Dusun 3, Desa Suka Banjar',
        imageUrl: null,
      },
      {
        id: 'fac-6',
        name: 'Sentra UMKM Keripik Pisang Suka Banjar',
        category: 'Ekonomi',
        latitude: -5.5530,
        longitude: 105.4690,
        address: 'Dusun 4, Desa Suka Banjar',
        imageUrl: null,
      },
    ];

    return NextResponse.json({
      success: true,
      data: facilities.length > 0 ? facilities : defaultFacilities,
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data fasilitas desa',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
