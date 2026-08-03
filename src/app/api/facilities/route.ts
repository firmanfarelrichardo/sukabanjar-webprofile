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
        latitude: -5.5864,
        longitude: 105.5074,
        address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Lampung Selatan',
        imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-2',
        name: 'UPTD SD Negeri 1 Sukabanjar',
        category: 'Pendidikan',
        latitude: -5.5878,
        longitude: 105.5060,
        address: 'Jl. Lintas Sumatra, Desa Suka Banjar, Kec. Sidomulyo',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-3',
        name: 'UPTD SMP Negeri 2 Sidomulyo',
        category: 'Pendidikan',
        latitude: -5.5855,
        longitude: 105.5090,
        address: 'Jl. Hi. Adam Kasim, Sukabanjar, Kec. Sidomulyo',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-4',
        name: 'MTSS Thoriqul Jannah',
        category: 'Pendidikan',
        latitude: -5.5840,
        longitude: 105.5100,
        address: 'Jl. Trans Sandaran, Dusun Rancasadang, Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1613896527026-f195d5c818ed?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-5',
        name: 'PAUD Melati Suka Banjar',
        category: 'Pendidikan',
        latitude: -5.5870,
        longitude: 105.5050,
        address: 'Dusun Katibung, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-6',
        name: 'Pustu (Puskesmas Pembantu) Suka Banjar',
        category: 'Kesehatan',
        latitude: -5.5860,
        longitude: 105.5068,
        address: 'Dusun Damar Lega, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-7',
        name: 'Posyandu Desa Suka Banjar',
        category: 'Kesehatan',
        latitude: -5.5852,
        longitude: 105.5082,
        address: 'Dusun Sandaran I, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-8',
        name: 'Masjid Jami Suka Banjar',
        category: 'Ibadah',
        latitude: -5.5862,
        longitude: 105.5072,
        address: 'Dusun Katibung, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c397?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-9',
        name: 'Mushola Al-Ikhlas Dusun Sandaran',
        category: 'Ibadah',
        latitude: -5.5845,
        longitude: 105.5095,
        address: 'Dusun Sandaran II, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-10',
        name: 'Mushola Nurul Hidayah Damar Lega',
        category: 'Ibadah',
        latitude: -5.5880,
        longitude: 105.5045,
        address: 'Dusun Damar Lega, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1542379653-b928db1ea3d6?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-11',
        name: 'Pasar Desa Suka Banjar',
        category: 'Ekonomi',
        latitude: -5.5868,
        longitude: 105.5065,
        address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'fac-12',
        name: 'Sentra UMKM Keripik Pisang Suka Banjar',
        category: 'Ekonomi',
        latitude: -5.5850,
        longitude: 105.5088,
        address: 'Dusun Sugih Waras, Desa Suka Banjar',
        imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, latitude, longitude, address, imageUrl } = body;

    if (!name || !category || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, message: 'Nama, kategori, latitude, dan longitude wajib diisi!' },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        name,
        category,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lokasi fasilitas desa berhasil ditambahkan',
      data: facility,
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan lokasi fasilitas baru',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const targetId = id || body.id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'ID fasilitas wajib disertakan!' },
        { status: 400 }
      );
    }

    const updatedFacility = await prisma.facility.update({
      where: { id: targetId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.latitude !== undefined && { latitude: parseFloat(body.latitude) }),
        ...(body.longitude !== undefined && { longitude: parseFloat(body.longitude) }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Data fasilitas desa berhasil diperbarui',
      data: updatedFacility,
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengedit data fasilitas desa',
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
        { success: false, message: 'ID fasilitas wajib disertakan!' },
        { status: 400 }
      );
    }

    await prisma.facility.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Fasilitas berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus fasilitas',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
