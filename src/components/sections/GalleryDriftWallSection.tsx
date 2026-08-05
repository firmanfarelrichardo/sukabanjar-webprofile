'use client';

import React, { useMemo } from 'react';
import DriftWall, { DriftWallItem } from '@/components/ui/DriftWall';

export interface GalleryItemData {
  id?: string;
  title: string;
  category?: string;
  description?: string | null;
  imageUrl?: string;
  img?: string;
}

interface GalleryDriftWallSectionProps {
  galleryItems?: GalleryItemData[];
}

const DEFAULT_GALLERY_PHOTOS: GalleryItemData[] = [
  {
    title: 'Panorama Sawah Bertingkat Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Matahari Terbenam Kebun Kelapa',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Gotong Royong & Kerja Bakti Warga',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Aliran Sungai Jernih Bukit KKN',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Kantor Balai Desa Suka Banjar',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Hasil Panen & Olahan Kerajinan UMKM',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Jalan Utama Seribu Pohon Rinai',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Kegiatan Senam Bersama Ibu-Ibu PKK',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function GalleryDriftWallSection({ galleryItems = [] }: GalleryDriftWallSectionProps) {
  const driftItems = useMemo<DriftWallItem[]>(() => {
    const sourceList = galleryItems.length > 0 ? galleryItems : DEFAULT_GALLERY_PHOTOS;

    // Pastikan minimal 25 ubin agar wall selalu padat di seluruh ukuran layar
    let combined = [...sourceList];
    while (combined.length < 25) {
      combined = [...combined, ...sourceList];
    }

    return combined.map((item, idx) => ({
      image: item.imageUrl || item.img || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      title: item.title || `Foto Galeri ${idx + 1}`,
      href: '/galeri',
    }));
  }, [galleryItems]);

  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden py-0 border-y border-slate-800/80 shadow-2xl">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#0086C9]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Pure 3D DriftWall Canvas - Clean View without Header Text / Buttons */}
      <div className="relative w-full h-[580px] sm:h-[680px] md:h-[760px] lg:h-[820px] xl:h-[880px] z-10">
        <DriftWall
          items={driftItems}
          columns={7}
          tileWidth={210}
          tileHeight={310}
          gap={18}
          scale={1.65}
          tilt={8}
          turn={0}
          perspective={1200}
          depth={80}
          speed={38}
          direction="up"
          variance={0.4}
          parallax={0.5}
          lift={64}
          fade={0.65}
          dim={0.75}
          overlayColor="#020617"
        />
      </div>
    </section>
  );
}
