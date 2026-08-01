import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_PROFILE = {
  name: 'Desa Suka Banjar',
  subdistrict: 'Sidomulyo',
  district: 'Lampung Selatan',
  province: 'Lampung',
  logoUrl: '/images/logo-desa.png',
  phone: '081234567890',
  email: 'desa.sukabanjar@gmail.com',
  address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan, Lampung',
  socialMedia: JSON.stringify([
    { id: 'sm-facebook', platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/desasukabanjar' },
    { id: 'sm-instagram', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/desa.sukabanjar' },
    { id: 'sm-tiktok', platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@desasukabanjar' },
    { id: 'sm-youtube', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@desasukabanjar' },
    { id: 'sm-twitter', platform: 'twitter', label: 'X / Twitter', url: 'https://x.com/desasukabanjar' },
  ]),
};

export async function GET() {
  try {
    const profile = await (prisma as any).villageProfile.findFirst();

    if (!profile) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_PROFILE,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        logoUrl: profile.logoUrl || DEFAULT_PROFILE.logoUrl,
        phone: profile.phone || DEFAULT_PROFILE.phone,
        email: profile.email || DEFAULT_PROFILE.email,
        socialMedia: profile.socialMedia !== undefined && profile.socialMedia !== null ? profile.socialMedia : DEFAULT_PROFILE.socialMedia,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_PROFILE,
    });
  }
}
