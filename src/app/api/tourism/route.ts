import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tourismList = await prisma.tourism.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const defaultTourism = [
      {
        id: 'tour-1',
        title: 'Saung Kumpul Sawah Sukabanjar',
        description:
          'Area pemandangan hijau hamparan sawah bertingkat dilengkapi saung kayu tradisional untuk tempat bersantai keluarga dan foto panorama.',
        location: 'Dusun 2, Desa Sukabanjar',
        imageUrl: null,
      },
      {
        id: 'tour-2',
        title: 'Aliran Sungai Jernih & Saung KKN',
        description:
          'Area aliran sungai jernih berbalut udara bukit yang sejuk dengan saung rested area buatan program pengabdian KKN.',
        location: 'Dusun 1, Desa Sukabanjar',
        imageUrl: null,
      },
      {
        id: 'tour-3',
        title: 'Spot Foto Sunset Kebun Kelapa',
        description:
          'Jajaran pepohonan kelapa tinggi dengan pemandangan matahari terbenam (sunset) yang sangat fotogenik untuk berfoto.',
        location: 'Dusun 3, Desa Sukabanjar',
        imageUrl: null,
      },
    ];

    return NextResponse.json({
      success: true,
      data: tourismList.length > 0 ? tourismList : defaultTourism,
    });
  } catch (error) {
    console.error('Error fetching tourism:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data destinasi wisata',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, location, imageUrl } = await request.json();

    if (!title || !location) {
      return NextResponse.json(
        { success: false, message: 'Judul wisata dan lokasi wajib diisi' },
        { status: 400 }
      );
    }

    const newTourism = await prisma.tourism.create({
      data: {
        title,
        description: description || 'Destinasi wisata alam Desa Sukabanjar.',
        location,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Destinasi wisata baru berhasil ditambahkan',
      data: newTourism,
    });
  } catch (error) {
    console.error('Error creating tourism:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan destinasi wisata',
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
        { success: false, message: 'ID wisata wajib disertakan' },
        { status: 400 }
      );
    }

    await prisma.tourism.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Destinasi wisata berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting tourism:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus destinasi wisata',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
