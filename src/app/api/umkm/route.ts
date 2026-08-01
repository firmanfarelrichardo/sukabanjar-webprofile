import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnapproved = searchParams.get('all') === 'true';

    const umkmList = await prisma.umkm.findMany({
      where: includeUnapproved ? {} : { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    const defaultUmkm = [
      {
        id: 'umkm-1',
        title: 'Kopi Bubuk Robusta Sidomulyo',
        ownerName: 'Bapak Herman',
        category: 'Kopi & Minuman',
        description:
          'Kopi bubuk robusta petik merah asli lereng perbukitan Sidomulyo dengan aroma pekat alami dan cita rasa khas.',
        price: 'Rp 28.000 / 250gram',
        whatsapp: '6281234567890',
        imageUrl: null,
        imageUrls: [],
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'umkm-2',
        title: 'Madu Hutan Murni Suka Banjar',
        ownerName: 'Bapak Darmawan',
        category: 'Olahan Tani',
        description:
          'Madu murni alami tanpa pemanis buatan yang dipanen langsung dari vegetasi hutan kawasan Suka Banjar.',
        price: 'Rp 85.000 / botol',
        whatsapp: '6281234567891',
        imageUrl: null,
        imageUrls: [],
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'umkm-3',
        title: 'Sambal Olahan Hasil Tani Cabai',
        ownerName: 'Ibu Wati',
        category: 'Kuliner',
        description:
          'Sambal botol siap saji dengan kepedasan gurih khas resep turun-temurun warga desa Suka Banjar.',
        price: 'Rp 18.000 / jar',
        whatsapp: '6281234567892',
        imageUrl: null,
        imageUrls: [],
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: umkmList.length > 0 ? umkmList : defaultUmkm,
    });
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data katalog UMKM',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, ownerName, category, description, price, whatsapp, imageUrl, imageUrls, isApproved } = body;

    if (!title || !ownerName || !whatsapp) {
      return NextResponse.json(
        { success: false, message: 'Nama produk, pemilik, dan nomor WhatsApp wajib diisi' },
        { status: 400 }
      );
    }

    const newUmkm = await prisma.umkm.create({
      data: {
        title,
        ownerName,
        category: category || 'Lainnya',
        description: description || 'Usaha lokal warga Desa Suka Banjar.',
        price: price || 'Hubungi Penjual',
        whatsapp: whatsapp.replace(/[^0-9]/g, ''),
        imageUrl: imageUrl || (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : null),
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        isApproved: isApproved !== undefined ? Boolean(isApproved) : false, // Default false for public
      },
    });

    return NextResponse.json({
      success: true,
      message: isApproved
        ? 'Produk UMKM berhasil ditambahkan'
        : 'Pengajuan UMKM berhasil dikirim! Menunggu verifikasi dari Admin Desa.',
      data: newUmkm,
    });
  } catch (error) {
    console.error('Error creating UMKM:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan data UMKM',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, ownerName, category, description, price, whatsapp, imageUrl, imageUrls, isApproved } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID UMKM wajib disertakan' },
        { status: 400 }
      );
    }

    // Build update data dynamically — only update fields that are provided
    const updateData: Record<string, any> = {};
    if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);
    if (title !== undefined) updateData.title = title;
    if (ownerName !== undefined) updateData.ownerName = ownerName;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp.replace(/[^0-9]/g, '');
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageUrls !== undefined) updateData.imageUrls = Array.isArray(imageUrls) ? imageUrls : [];

    const updated = await prisma.umkm.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: isApproved ? 'UMKM berhasil disetujui dan ditampilkan' : 'Data UMKM berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating UMKM:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui data UMKM',
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
        { success: false, message: 'ID UMKM wajib disertakan' },
        { status: 400 }
      );
    }

    await prisma.umkm.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Data UMKM berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting UMKM:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus data UMKM',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
