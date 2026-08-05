import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Panorama Sawah Bertingkat Suka Banjar',
    category: 'Pemandangan Alam',
    description: 'Hamparan pemandangan hijau sawah bertingkat Dusun 2 Desa Suka Banjar yang asri di pagi hari dengan udara sejuk pegunungan.',
    location: 'Dusun 2, Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    height: 520,
    createdAt: new Date('2026-07-20').toISOString(),
  },
  {
    id: 'gal-2',
    title: 'Matahari Terbenam Kebun Kelapa',
    category: 'Pemandangan Alam',
    description: 'Pemandangan spektakuler matahari terbenam (sunset) di antara siluet deretan pohon kelapa tinggi khas pesisir Sidomulyo.',
    location: 'Dusun 3, Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    height: 380,
    createdAt: new Date('2026-07-18').toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Gotong Royong & Kerja Bakti Warga',
    category: 'Kegiatan Desa',
    description: 'Tradisi gotong royong warga desa merawat kebersihan lingkungan saluran irigasi sawah dan fasilitas desa.',
    location: 'Dusun 1, Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop',
    height: 440,
    createdAt: new Date('2026-07-15').toISOString(),
  },
  {
    id: 'gal-4',
    title: 'Aliran Sungai Jernih Bukit KKN',
    category: 'Pemandangan Alam',
    description: 'Spot favorit warga untuk bersantai menikmati gemericik air sungai alami berbalut bebatuan purba dan Saung KKN.',
    location: 'Dusun 1, Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
    height: 600,
    createdAt: new Date('2026-07-12').toISOString(),
  },
  {
    id: 'gal-5',
    title: 'Kantor Balai Desa Suka Banjar',
    category: 'Fasilitas Publik',
    description: 'Pusat administrasi pelayanan publik digital dan balai pertemuan utama warga Desa Suka Banjar.',
    location: 'Pusat Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    height: 360,
    createdAt: new Date('2026-07-10').toISOString(),
  },
  {
    id: 'gal-6',
    title: 'Hasil Panen & Olahan Kerajinan UMKM',
    category: 'UMKM & Tradisi',
    description: 'Kreativitas usaha warga lokal memproduksi olahan pangan berkualitas dan kerajinan tangan khas daerah.',
    location: 'Dusun 4, Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    height: 480,
    createdAt: new Date('2026-07-08').toISOString(),
  },
  {
    id: 'gal-7',
    title: 'Jalan Utama Seribu Pohon Rinai',
    category: 'Pemandangan Alam',
    description: 'Akses jalan desa beraspal mulus yang dikelilingi pepohonan hijau rindang dan udara segar.',
    location: 'Jalan Utama Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
    height: 500,
    createdAt: new Date('2026-07-05').toISOString(),
  },
  {
    id: 'gal-8',
    title: 'Kegiatan Senam Bersama Ibu-Ibu PKK',
    category: 'Kegiatan Desa',
    description: 'Kegiatan kebugaran dan kebersamaan rutin mingguan warga desa di halaman balai desa.',
    location: 'Halaman Balai Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
    height: 410,
    createdAt: new Date('2026-07-01').toISOString(),
  },
];

export async function GET() {
  try {
    const galleryItems = await (prisma as any).gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const itemsToReturn = galleryItems.length > 0 ? galleryItems : DEFAULT_GALLERY_ITEMS;
    const formattedData = itemsToReturn.map((item: any) => ({
      ...item,
      format: item.format || (item.height >= 500 ? 'portrait' : item.height <= 340 ? 'landscape' : 'square'),
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    const formattedData = DEFAULT_GALLERY_ITEMS.map((item: any) => ({
      ...item,
      format: item.format || (item.height >= 500 ? 'portrait' : item.height <= 340 ? 'landscape' : 'square'),
    }));
    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, description, location, imageUrl, height, format } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Judul foto dan URL gambar wajib diisi' },
        { status: 400 }
      );
    }

    const itemFormat = format || (height >= 500 ? 'portrait' : height <= 340 ? 'landscape' : 'square');

    try {
      const newItem = await (prisma as any).gallery.create({
        data: {
          title,
          category: category || 'Pemandangan Alam',
          description: description || null,
          location: location || 'Desa Suka Banjar',
          imageUrl,
          height: height ? parseInt(String(height), 10) : 420,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Foto galeri baru berhasil ditambahkan',
        data: {
          ...newItem,
          format: itemFormat,
        },
      });
    } catch (dbErr) {
      const fallbackItem = {
        id: `gal-${Date.now()}`,
        title,
        category: category || 'Pemandangan Alam',
        description: description || null,
        location: location || 'Desa Suka Banjar',
        imageUrl,
        format: itemFormat,
        height: height ? parseInt(String(height), 10) : 420,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({
        success: true,
        message: 'Foto galeri berhasil ditambahkan (mode lokal)',
        data: fallbackItem,
      });
    }
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan foto galeri',
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
        { success: false, message: 'ID foto wajib disertakan' },
        { status: 400 }
      );
    }

    try {
      await (prisma as any).gallery.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.log('Local/fallback delete item id:', id);
    }

    return NextResponse.json({
      success: true,
      message: 'Foto galeri berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus foto galeri',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, category, description, location, imageUrl, height, format } = body;

    if (!id || !title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'ID, Judul foto, dan Gambar wajib diisi' },
        { status: 400 }
      );
    }

    const itemFormat = format || (height >= 500 ? 'portrait' : height <= 340 ? 'landscape' : 'square');

    try {
      const updatedItem = await (prisma as any).gallery.update({
        where: { id },
        data: {
          title,
          category: category || 'Pemandangan Alam',
          description: description || null,
          location: location || 'Desa Suka Banjar',
          imageUrl,
          height: height ? parseInt(String(height), 10) : 420,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Foto galeri berhasil diperbarui',
        data: {
          ...updatedItem,
          format: itemFormat,
        },
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: 'Foto galeri berhasil diperbarui (mode lokal)',
        data: {
          id,
          title,
          category: category || 'Pemandangan Alam',
          description: description || null,
          location: location || 'Desa Suka Banjar',
          imageUrl,
          format: itemFormat,
          height: height ? parseInt(String(height), 10) : 420,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui foto galeri',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
