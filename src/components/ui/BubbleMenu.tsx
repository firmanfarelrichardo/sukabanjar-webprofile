'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { useVillageProfile } from '@/context/VillageProfileContext';
import './BubbleMenu.css';

interface BubbleMenuProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

// Main Large Typography Links (Huruf Besar: Beranda, Profil, Galeri, Berita)
const MAIN_LARGE_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Berita', href: '/berita' },
];

// Sub-Links with Arrow Indicators ↗ (Huruf Kecil: Statistik, Peta, UMKM, Aspirasi)
const SUB_LINKS = [
  { label: 'STATISTIK', href: '/statistik', arrow: '↗' },
  { label: 'PETA', href: '/peta', arrow: '↗' },
  { label: 'UMKM', href: '/umkm', arrow: '↗' },
  { label: 'ASPIRASI', href: '/aspirasi', arrow: '↗' },
];

export default function BubbleMenu({
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: BubbleMenuProps) {
  const pathname = usePathname();
  const { profile } = useVillageProfile();
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!overlayRef.current) return;

    const validLinks = linksRef.current.filter(Boolean);

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.killTweensOf(validLinks);
      gsap.set(overlayRef.current, { opacity: 0, display: 'flex' });
      gsap.set(validLinks, { y: 35, opacity: 0, scale: 0.9 });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.to(validLinks, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        delay: 0.1,
      });
    } else {
      document.body.style.overflow = '';
      if (overlayRef.current.style.display !== 'none') {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            if (overlayRef.current) {
              gsap.set(overlayRef.current, { display: 'none' });
            }
          },
        });
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Full Screen Overlay Menu with Sunset Landmark Background */}
      <div
        ref={overlayRef}
        className="bubble-menu-overlay relative overflow-hidden"
        style={{ display: 'none' }}
        aria-hidden={!isMenuOpen}
      >
        {/* Background Sunset Landmark Photo Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/bg/bubble_menu_bg.jpg"
            alt="Menara Siger Sunset Landmark Background"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 transition-transform duration-1000"
          />
          {/* Ambient Dark Gradient Overlay for Supreme Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/85 backdrop-blur-[3px]" />
        </div>

        {/* Overlay Top Bar (Exit Button X and Centered Title) */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-4 absolute top-4 left-0 right-0 z-50">
          {/* Top-Left: Round White Exit / Close Button (X) */}
          <button
            type="button"
            onClick={onCloseMenu}
            className="w-12 h-12 rounded-full bg-white text-slate-950 hover:bg-[#0086C9] hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer shrink-0 border border-white/40"
            aria-label="Tutup Navigasi Menu"
          >
            <X size={24} className="stroke-[2.5]" />
          </button>

          {/* Top-Center: Village Name */}
          <Link
            href="/"
            onClick={onCloseMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden shrink-0 shadow-lg backdrop-blur-md">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-white font-black text-lg font-heading">S</span>
              )}
            </div>
            <span className="font-heading font-extrabold text-white text-sm sm:text-base tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-md">
              {profile.name || 'DESA SUKA BANJAR'}
            </span>
          </Link>

          {/* Top-Right: Spacer to balance layout centering */}
          <div className="w-12 h-12 shrink-0 pointer-events-none" />
        </div>

        {/* Main Content Area */}
        <div className="bubble-menu-content flex-col pt-20 relative z-10">
          {/* Main Large Typography Navigation Items */}
          <nav className="bubble-menu-main-links">
            {MAIN_LARGE_LINKS.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMenu}
                  ref={(el) => {
                    linksRef.current[idx] = el;
                  }}
                  className={`bubble-menu-item-link drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] ${
                    isActive ? 'text-amber-300 font-black opacity-100 scale-105' : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sub-links with Arrow Indicators ↗ */}
          <div className="bubble-menu-sublinks border-white/20">
            {SUB_LINKS.map((sub, idx) => {
              const isActive = pathname === sub.href;
              return (
                <Link
                  key={idx}
                  href={sub.href}
                  onClick={onCloseMenu}
                  className={`bubble-menu-sublink-item ${
                    isActive ? 'text-amber-300 font-extrabold' : 'text-slate-100 font-bold'
                  }`}
                >
                  <span className="drop-shadow-md">{sub.label}</span>
                  <span className="text-amber-300 font-bold">{sub.arrow}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
