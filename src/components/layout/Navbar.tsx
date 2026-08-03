'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useVillageProfile } from '@/context/VillageProfileContext';
import { useAdmin } from '@/context/AdminContext';
import GlassSurface from '@/components/ui/GlassSurface';
import BubbleMenu from '@/components/ui/BubbleMenu';
import AnnouncementTicker from '@/components/sections/AnnouncementTicker';

interface Announcement {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

const DEFAULT_TICKER_ITEMS: Announcement[] = [
  {
    id: 'ticker-1',
    title: 'Selamat Datang di Portal Resmi Desa Suka Banjar, Kecamatan Sidomulyo',
    slug: '#',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ticker-2',
    title: 'Layanan Pengaduan & E-Aspirasi Warga Kini Dibuka Secara Online',
    slug: '#',
    createdAt: new Date().toISOString(),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useVillageProfile();
  const { isAdmin } = useAdmin();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announcements] = useState<Announcement[]>(DEFAULT_TICKER_ITEMS);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Row 1: Ticker Top Bar */}
        {announcements.length > 0 && (
          <AnnouncementTicker announcements={announcements} />
        )}

        {/* Row 2: Glass Surface Main Navigation Bar */}
        <div className="container-section pt-3 px-4 sm:px-6">
          <GlassSurface
            width="100%"
            height={74}
            borderRadius={26}
            blur={14}
            brightness={45}
            opacity={0.88}
            className="border border-white/20 shadow-2xl"
          >
            <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 relative">
              {/* Left Group: Round Bubble Menu Toggle Button */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="bubble-toggle-btn group relative flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label={isMenuOpen ? 'Tutup Navigasi Menu' : 'Buka Navigasi Menu'}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5 w-6 h-6">
                    <span
                      className={`block w-5 h-0.5 bg-slate-900 rounded-full transition-transform duration-300 ${
                        isMenuOpen ? 'rotate-45 translate-y-1' : ''
                      }`}
                    />
                    <span
                      className={`block w-3.5 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${
                        isMenuOpen ? 'opacity-0 scale-0' : 'group-hover:w-5'
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-slate-900 rounded-full transition-transform duration-300 ${
                        isMenuOpen ? '-rotate-45 -translate-y-1' : ''
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Center: Dynamic Village Icon Logo & Title (Centering Presisi) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
                <Link
                  href="/"
                  className="flex items-center gap-3 group px-3 py-1.5 rounded-2xl hover:bg-white/10 transition-colors"
                  aria-label="Beranda Desa Suka Banjar"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform shrink-0">
                    {profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt={profile.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : (
                      <span className="text-white font-black text-xl font-heading">S</span>
                    )}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="font-heading font-extrabold text-base sm:text-lg text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors whitespace-nowrap">
                      {profile.name || 'DESA SUKA BANJAR'}
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium leading-tight whitespace-nowrap">
                      {profile.subdistrict || 'Sidomulyo'}, {profile.district || 'Lampung Selatan'}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Right Group: Mode Admin (Jika sedang Login Admin) */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold hover:bg-amber-500/30 transition-colors shadow-sm"
                    title="Kembali ke Dashboard Admin"
                  >
                    <ShieldCheck size={14} />
                    <span className="hidden sm:inline">Mode Admin</span>
                  </Link>
                )}
              </div>
            </div>
          </GlassSurface>
        </div>
      </header>

      {/* Bubble Menu Full-Screen Overlay */}
      <BubbleMenu
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onCloseMenu={() => setIsMenuOpen(false)}
      />
    </>
  );
}
