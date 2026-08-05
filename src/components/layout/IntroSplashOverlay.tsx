'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import MaskedHeading from '@/components/ui/MaskedHeading';

export default function IntroSplashOverlay() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Typewriter states untuk "UNIVERSITAS LAMPUNG"
  const [typedText, setTypedText] = useState<string>('');
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const logoRef = useRef<HTMLDivElement>(null);

  const FULL_SUBTITLE = 'UNIVERSITAS LAMPUNG';

  useEffect(() => {
    setIsVisible(true);
    setIsFadingOut(false);
    setTypedText('');
    setShowCursor(true);

    // 1. Animasi Muncul Logo UNILA (Rise, Scale & Fade In dari Bawah)
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.82,
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

    // 2. Animasi Ketik (Typewriter) untuk Subtitle "UNIVERSITAS LAMPUNG"
    let charIndex = 0;
    const startTypingDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < FULL_SUBTITLE.length) {
          setTypedText(FULL_SUBTITLE.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          // Kedipkan dan hilangkan kursor setelah pengetikan selesai
          setTimeout(() => setShowCursor(false), 900);
        }
      }, 75);

      return () => clearInterval(typingInterval);
    }, 550);

    // Timer Fade-out Overlay secara lembut
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3300);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearTimeout(startTypingDelay);
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0086C9]/18 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/12 rounded-full blur-[140px]" />
      </div>

      {/* Main Center Animated Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center gap-3">
        {/* Logo UNILA dengan Animasi Rise GSAP */}
        <div
          ref={logoRef}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center transition-all duration-700 hover:scale-105"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/id/f/ff/Logo_UnivLampung.png"
            alt="Logo Universitas Lampung"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_25px_rgba(0,134,201,0.5)]"
          />
        </div>

        {/* Masked Heading ReactBits Component */}
        <div className="w-full flex justify-center py-1">
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

        {/* Subtitle dengan Animasi Ketik (Typewriter Effect) */}
        <div className="pt-1 h-8 flex items-center justify-center">
          <p className="text-slate-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase font-mono">
            <span>{typedText}</span>
            {showCursor && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#0086C9] animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
