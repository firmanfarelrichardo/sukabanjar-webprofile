import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Simpan pesan aspirasi / pengaduan warga baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderName, isAnonymous, category, title, content, attachment } = body;

    // Validasi input wajib
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Judul aspirasi tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Detail pesan aspirasi tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Silakan pilih kategori laporan' },
        { status: 400 }
      );
    }

    // Nama pengirim: jika anonim, diset sebagai "Anonim"
    const finalSenderName = isAnonymous
      ? 'Anonim'
      : senderName && senderName.trim()
        ? senderName.trim()
        : 'Warga Suka Banjar';

    // Simpan ke Prisma database
    const newAspiration = await prisma.aspiration.create({
      data: {
        senderName: finalSenderName,
        isAnonymous: Boolean(isAnonymous),
        category: category.trim(),
        title: title.trim(),
        content: content.trim(),
        attachment: attachment || null,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan aspirasi Anda telah berhasil terkirim langsung ke Balai Desa Suka Banjar.',
      data: {
        id: newAspiration.id,
        createdAt: newAspiration.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error submitting aspiration:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengirim pesan aspirasi. Silakan coba beberapa saat lagi.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET: Ambil data statistik ringkas pesan aspirasi
export async function GET() {
  try {
    const totalCount = await prisma.aspiration.count();
    
    // Hitung per kategori
    const categories = [
      'Fasilitas Publik',
      'Kebersihan/Lingkungan',
      'Keamanan',
      'Saran/Masukan',
      'Lainnya',
    ];

    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.aspiration.count({
          where: { category: cat },
        });
        return { category: cat, count };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalAspirations: totalCount,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Error fetching aspiration stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil statistik aspirasi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
