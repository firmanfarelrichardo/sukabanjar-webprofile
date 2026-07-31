import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Memperbarui data profil desa
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      subdistrict,
      district,
      province,
      heroSubtitle,
      history,
      historyCardTitle,
      historyCardQuote,
      vision,
      missions,
      phone,
      email,
      address,
    } = body;

    const existingProfile = await prisma.villageProfile.findFirst();

    let updatedProfile;
    if (existingProfile) {
      updatedProfile = await prisma.villageProfile.update({
        where: { id: existingProfile.id },
        data: {
          name: name !== undefined ? name : existingProfile.name,
          subdistrict: subdistrict !== undefined ? subdistrict : existingProfile.subdistrict,
          district: district !== undefined ? district : existingProfile.district,
          province: province !== undefined ? province : existingProfile.province,
          heroSubtitle: heroSubtitle !== undefined ? heroSubtitle : existingProfile.heroSubtitle,
          history: history !== undefined ? history : existingProfile.history,
          historyCardTitle: historyCardTitle !== undefined ? historyCardTitle : existingProfile.historyCardTitle,
          historyCardQuote: historyCardQuote !== undefined ? historyCardQuote : existingProfile.historyCardQuote,
          vision: vision !== undefined ? vision : existingProfile.vision,
          missions: Array.isArray(missions) ? missions : existingProfile.missions,
          phone: phone !== undefined ? phone : existingProfile.phone,
          email: email !== undefined ? email : existingProfile.email,
          address: address !== undefined ? address : existingProfile.address,
        },
      });
    } else {
      updatedProfile = await prisma.villageProfile.create({
        data: {
          name: name || 'Sukabanjar',
          subdistrict: subdistrict || 'Sidomulyo',
          district: district || 'Lampung Selatan',
          province: province || 'Lampung',
          heroSubtitle:
            heroSubtitle ||
            'Portal resmi pelayanan digital, pengaduan warga, serta informasi potensi UMKM dan pariwisata Desa Sukabanjar.',
          history: history || 'Desa Sukabanjar didirikan...',
          historyCardTitle: historyCardTitle || 'Warisan Nilai & Gotong Royong',
          historyCardQuote:
            historyCardQuote ||
            'Menjaga peninggalan nilai luhur pendiri desa, membangun tatanan kemasyarakatan yang harmonis dan sejalan dengan perkembangan jaman digital.',
          vision: vision || 'Terwujudnya Desa Sukabanjar yang Mandiri...',
          missions: Array.isArray(missions) ? missions : ['Meningkatkan kualitas pelayanan...'],
          phone,
          email,
          address,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profil Desa Sukabanjar berhasil diperbarui',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating village profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menyimpan perubahan profil desa',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
