'use client';

import React, { useEffect, useState } from 'react';
import MaskedHeading from '@/components/ui/MaskedHeading';

export default function IntroSplashOverlay() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Selalu tampilkan animasi intro splash screen setiap kali website dibuka / di-refresh
    setIsVisible(true);
    setIsFadingOut(false);

    // Mulai animasi fade-out setelah 3.2 detik
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3200);

    // Hapus overlay secara penuh setelah durasi transisi fade-out (3.9 detik total)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 pointer-events-auto scale-100'
      }`}
    >
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0086C9]/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Center Animated Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-4">
        {/* Masked Heading ReactBits Component */}
        <div className="w-full flex justify-center py-2">
          <MaskedHeading
            text="Presented by KKN UNILA 2026"
            tag="h1"
            mediaType="image"
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
            fillScale={1.35}
            parallax={32}
            drift={14}
            brightness={1.1}
            saturation={1.2}
            reveal="rise"
            trigger="mount"
            duration={1.2}
            stagger={0.08}
            align="center"
            weight={900}
            tracking={-0.03}
            textScale={0.075}
            className="text-white drop-shadow-2xl font-heading"
          />
        </div>

        {/* Subtitle */}
        <div className="pt-2">
          <p className="text-slate-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">
            Universitas Lampung
          </p>
        </div>
      </div>
    </div>
  );
}
