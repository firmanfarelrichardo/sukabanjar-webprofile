import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_OFFICIALS, OfficialItem } from '@/lib/data/apparatus';

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
    const { name, role, imageUrl, orderNum, birthPlace, birthDate, gender, address, description } = body;

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
          birthPlace: birthPlace || null,
          birthDate: birthDate || null,
          gender: gender || null,
          address: address || null,
          description: description || null,
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
        birthPlace: birthPlace || null,
        birthDate: birthDate || null,
        gender: gender || null,
        address: address || null,
        description: description || null,
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
    const { id, name, role, imageUrl, orderNum, birthPlace, birthDate, gender, address, description } = body;

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
          birthPlace: birthPlace || null,
          birthDate: birthDate || null,
          gender: gender || null,
          address: address || null,
          description: description || null,
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
          birthPlace: birthPlace || null,
          birthDate: birthDate || null,
          gender: gender || null,
          address: address || null,
          description: description || null,
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
