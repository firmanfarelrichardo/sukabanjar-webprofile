import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface OfficialItem {
  id: string;
  name: string;
  role: string;
  imageUrl?: string | null;
  orderNum: number;
  createdAt?: string;
}

const DEFAULT_OFFICIALS: OfficialItem[] = [
  {
    id: 'off-1',
    name: 'Dedi Kurniawan, S.IP',
    role: 'Kepala Desa',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
    orderNum: 1,
  },
  {
    id: 'off-2',
    name: 'Rahmat Hidayat, S.Sos',
    role: 'Sekretaris Desa',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    orderNum: 2,
  },
  {
    id: 'off-3',
    name: 'Budi Santoso, S.E',
    role: 'Kaur Keuangan',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    orderNum: 3,
  },
  {
    id: 'off-4',
    name: 'Siti Aminah, A.Md',
    role: 'Kaur Perencanaan & Umum',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    orderNum: 4,
  },
  {
    id: 'off-5',
    name: 'Ahmad Fauzi, S.H',
    role: 'Kasi Pemerintahan',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    orderNum: 5,
  },
  {
    id: 'off-6',
    name: 'Nurul Huda, S.Pd',
    role: 'Kasi Kesejahteraan & Pelayanan',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    orderNum: 6,
  },
  {
    id: 'off-7',
    name: 'Hendra Saputra',
    role: 'Kepala Dusun 1',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    orderNum: 7,
  },
  {
    id: 'off-8',
    name: 'Bambang Supriyadi',
    role: 'Kepala Dusun 2',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop',
    orderNum: 8,
  },
];

export async function GET() {
  try {
    const officials = await (prisma as any).apparatus.findMany({
      orderBy: { orderNum: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: officials.length > 0 ? officials : DEFAULT_OFFICIALS,
    });
  } catch (error) {
    console.error('Error fetching apparatus list:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_OFFICIALS,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, imageUrl, orderNum } = body;

    if (!name || !role) {
      return NextResponse.json(
        { success: false, message: 'Nama dan Jabatan wajib diisi' },
        { status: 400 }
      );
    }

    try {
      const newItem = await (prisma as any).apparatus.create({
        data: {
          name,
          role,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
          orderNum: orderNum ? parseInt(String(orderNum), 10) : 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Perangkat desa berhasil ditambahkan',
        data: newItem,
      });
    } catch (dbErr) {
      const fallbackItem: OfficialItem = {
        id: `off-${Date.now()}`,
        name,
        role,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
        orderNum: orderNum ? parseInt(String(orderNum), 10) : 1,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({
        success: true,
        message: 'Perangkat desa berhasil ditambahkan (mode lokal)',
        data: fallbackItem,
      });
    }
  } catch (error) {
    console.error('Error creating apparatus:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan perangkat desa',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, imageUrl, orderNum } = body;

    if (!id || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'ID, Nama, dan Jabatan wajib diisi' },
        { status: 400 }
      );
    }

    try {
      const updatedItem = await (prisma as any).apparatus.update({
        where: { id },
        data: {
          name,
          role,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
          orderNum: orderNum ? parseInt(String(orderNum), 10) : 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Data perangkat desa berhasil diperbarui',
        data: updatedItem,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: 'Data perangkat desa berhasil diperbarui (mode lokal)',
        data: {
          id,
          name,
          role,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
          orderNum: orderNum ? parseInt(String(orderNum), 10) : 1,
        },
      });
    }
  } catch (error) {
    console.error('Error updating apparatus:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui data perangkat desa',
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
        { success: false, message: 'ID perangkat desa wajib disertakan' },
        { status: 400 }
      );
    }

    try {
      await (prisma as any).apparatus.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.log('Local/fallback delete apparatus id:', id);
    }

    return NextResponse.json({
      success: true,
      message: 'Perangkat desa berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting apparatus:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus perangkat desa',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
