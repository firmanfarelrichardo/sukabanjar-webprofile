'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import MaskedHeading from '@/components/ui/MaskedHeading';
import { useVillageProfile } from '@/context/VillageProfileContext';

export default function IntroSplashOverlay() {
  const { profile } = useVillageProfile();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Typewriter states untuk "KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN"
  const [typedText, setTypedText] = useState<string>('');
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const logoRef = useRef<HTMLDivElement>(null);

  const FULL_SUBTITLE = 'KECAMATAN SIDOMULYO, KABUPATEN LAMPUNG SELATAN';
  const defaultLogoUrl =
    profile?.logoUrl ||
    'https://sipdeskel.id/LAMPUNG/LAMPUNGSELATAN/Sidomulyo/SukaBanjar/foto_desa/18_01_07_2004_logo_desa.jpg?';

  useEffect(() => {
    setIsVisible(true);
    setIsFadingOut(false);
    setTypedText('');
    setShowCursor(true);

    const activeTimers: NodeJS.Timeout[] = [];

    // 1. Animasi Muncul Logo Pemda/Desa (Rise, Scale & Fade In dari Bawah)
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {
          opacity: 0,
          y: 35,
          scale: 0.85,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }

    // 2. Animasi Ketik (Typewriter) untuk Subtitle yang Berjalan Sekuensial
    let charIndex = 0;
    const startTypingTimer = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < FULL_SUBTITLE.length) {
          setTypedText(FULL_SUBTITLE.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          // Matikan kursor setelah teks tuntas diketik
          const cursorTimer = setTimeout(() => setShowCursor(false), 400);
          activeTimers.push(cursorTimer);

          // Tahan tampilan utuh sejenak (jeda ~900ms) agar terbaca jelas oleh pengunjung
          const fadeStartTimer = setTimeout(() => {
            setIsFadingOut(true);

            // Setelah transisi fade out selesai (700ms), buka dan tampilkan halaman utama
            const finishTimer = setTimeout(() => {
              setIsVisible(false);
            }, 750);
            activeTimers.push(finishTimer);
          }, 900);

          activeTimers.push(fadeStartTimer);
        }
      }, 35);

      activeTimers.push(typingInterval as unknown as NodeJS.Timeout);
    }, 700);

    activeTimers.push(startTypingTimer);

    return () => {
      activeTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] w-screen h-screen min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 select-none transition-all duration-700 ease-in-out overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 pointer-events-auto scale-100'
      }`}
    >
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0086C9]/18 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/12 rounded-full blur-[140px]" />
      </div>

      {/* Main Center Animated Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5 px-2">
        {/* Logo Resmi Desa Suka Banjar dengan Animasi Rise GSAP */}
        <div
          ref={logoRef}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0 mx-auto transition-transform duration-700 hover:scale-105"
        >
          <img
            src={defaultLogoUrl}
            alt="Logo Pemerintah Desa Suka Banjar"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(0,134,201,0.5)]"
          />
        </div>

        {/* Masked Heading ReactBits Component */}
        <div className="w-full flex justify-center items-center py-1">
          <MaskedHeading
            text="PEMERINTAH DESA SUKA BANJAR"
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
            tracking={-0.02}
            textScale={0.065}
            className="text-white drop-shadow-2xl font-heading tracking-wide uppercase leading-tight"
          />
        </div>

        {/* Subtitle dengan Animasi Ketik (Typewriter Effect) */}
        <div className="pt-1 min-h-[2rem] flex items-center justify-center">
          <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.18em] sm:tracking-[0.22em] uppercase font-mono text-center">
            <span>{typedText}</span>
            {showCursor && (
              <span className="inline-block w-1.5 h-3.5 sm:h-4 ml-1 bg-[#0086C9] animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
