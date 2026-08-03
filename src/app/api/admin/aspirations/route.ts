import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil seluruh daftar pesan aspirasi warga untuk Inbox Admin
export async function GET() {
  try {
    const aspirations = await prisma.aspiration.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: aspirations,
    });
  } catch (error) {
    console.error('Error fetching aspirations for admin:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data aspirasi warga',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT: Update status isRead pada pesan aspirasi
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    const body = await request.json().catch(() => ({}));
    const targetId = queryId || body.id;
    const isRead = body.isRead !== undefined ? body.isRead : true;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'ID aspirasi wajib disertakan' },
        { status: 400 }
      );
    }

    const updated = await prisma.aspiration.update({
      where: { id: targetId },
      data: { isRead: Boolean(isRead) },
    });

    return NextResponse.json({
      success: true,
      message: 'Status pesan aspirasi berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating aspiration status:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui status pesan aspirasi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE: Hapus pesan aspirasi dari inbox admin
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    const body = await request.json().catch(() => ({}));
    const targetId = queryId || body.id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'ID aspirasi wajib disertakan' },
        { status: 400 }
      );
    }

    await prisma.aspiration.delete({
      where: { id: targetId },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan aspirasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting aspiration:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus pesan aspirasi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
