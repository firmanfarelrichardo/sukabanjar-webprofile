'use client';

import { useState, useEffect } from 'react';

interface ArticleHeroProps {
  totalArticles?: number;
}

export default function ArticleHero({ totalArticles }: ArticleHeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center bg-slate-950 text-white py-16 md:py-24 pt-36 sm:pt-40 md:pt-44 overflow-hidden">
      {/* 2-Layer Responsive Parallax Animation */}
      <div className="parallax absolute inset-0 pointer-events-none z-0 w-full h-full">
        {/* Layer 1: Pemandangan Sawah & Langit Cerah Desa */}
        <div
          className="layer parallax-layer opacity-100"
          data-speed="-0.7"
          style={{
            backgroundImage: `url('/images/hero/landscape_background_small.png')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transform: `translate3d(0px, ${(scrollY * -0.65).toFixed(2)}px, 0px)`,
          }}
        />

        {/* Layer 2: Pemukiman Rumah Warga & Terasering Desa */}
        <div
          className="layer parallax-layer opacity-95"
          data-speed="-0.2"
          style={{
            backgroundImage: `url('/images/hero/landscape_mountain_small.png')`,
            backgroundPosition: 'center bottom',
            backgroundSize: 'cover',
            height: '65%',
            top: 'auto',
            bottom: 0,
            WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            transform: `translate3d(0px, ${(scrollY * -0.2).toFixed(2)}px, 0px)`,
          }}
        />
      </div>

      {/* Ambient Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-slate-950/90 pointer-events-none z-0" />

      <div className="container-section relative z-10 text-center max-w-3xl mx-auto space-y-4 px-4">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight text-balance text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          Kabar Terkini{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-sky-100 to-amber-300">
            Desa Suka Banjar
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-100/90 text-sm sm:text-base md:text-lg leading-relaxed text-balance pt-2 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          Ikuti perkembangan berita kegiatan pemerintahan desa, pembangunan fasilitas publik, pengumuman warga, serta program kerja KKN.
        </p>
      </div>
    </section>
  );
}
