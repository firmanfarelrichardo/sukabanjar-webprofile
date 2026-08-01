import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Toggle status isRead pada pesan aspirasi
export async function PUT(request: Request) {
  try {
    const { id, isRead } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID aspirasi wajib disertakan' },
        { status: 400 }
      );
    }

    const updated = await prisma.aspiration.update({
      where: { id },
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
        message: 'Gagal memperbarui status pesan',
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID aspirasi wajib disertakan' },
        { status: 400 }
      );
    }

    await prisma.aspiration.delete({
      where: { id },
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
