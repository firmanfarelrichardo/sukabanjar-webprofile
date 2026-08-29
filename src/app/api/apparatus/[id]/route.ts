import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_OFFICIALS, OfficialItem } from '@/lib/data/apparatus';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID aparatur wajib disertakan' },
        { status: 400 }
      );
    }

    let official = null;

    try {
      if ((prisma as any).apparatus) {
        official = await (prisma as any).apparatus.findUnique({
          where: { id },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma lookup failed, falling back to default list:', dbErr);
    }

    if (!official) {
      // Find in fallback defaults
      official = DEFAULT_OFFICIALS.find((item) => item.id === id) || null;
    }

    if (!official) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data aparatur desa tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: official,
    });
  } catch (error) {
    console.error('Error fetching apparatus detail by ID:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server saat mengambil data aparatur',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
