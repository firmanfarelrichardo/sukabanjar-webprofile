'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SITE_INFO } from '@/constants';
import MobileMenu from './MobileMenu';
import AnnouncementTicker from '@/components/sections/AnnouncementTicker';

interface Announcement {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Fetch announcements untuk top bar ticker
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/landing');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.announcements) {
            setAnnouncements(json.data.announcements);
          }
        }
      } catch (err) {
        // Fallback default announcement jika error
        setAnnouncements([
          {
            id: 'demo-1',
            title: 'Selamat Datang di Portal Resmi Desa Sukabanjar, Kecamatan Sidomulyo',
            slug: '#',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'demo-2',
            title: 'Layanan Pengaduan & E-Aspirasi Warga Kini Dibuka Secara Online',
            slug: '#',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    }
    fetchAnnouncements();
  }, []);

  // Scroll listener untuk efek navbar solid
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup mobile menu saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md">
        {/* Row 1: Announcement Ticker Top Bar */}
        {announcements.length > 0 && (
          <AnnouncementTicker announcements={announcements} />
        )}

        {/* Row 2: Main Navigation Bar */}
        <nav
          className={cn(
            'transition-all duration-300',
            isScrolled
              ? 'navbar-solid'
              : 'bg-slate-900/85 backdrop-blur-md border-b border-white/10'
          )}
        >
          <div className="container-section">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Nama Desa */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
                aria-label="Beranda Desa Sukabanjar"
              >
                {/* Icon placeholder logo */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                  <span className="text-white font-bold text-sm font-heading">S</span>
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'font-heading font-bold text-sm leading-tight transition-colors',
                      isScrolled ? 'text-slate-900' : 'text-white'
                    )}
                  >
                    {SITE_INFO.name}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] leading-tight transition-colors',
                      isScrolled ? 'text-slate-500' : 'text-white/70'
                    )}
                  >
                    Kec. Sidomulyo, Lampung Selatan
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <ul className="hidden md:flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive
                            ? isScrolled
                              ? 'text-primary-600 bg-primary-50 font-semibold'
                              : 'text-white bg-primary-600/30 border border-primary-500/30 font-semibold'
                            : isScrolled
                              ? 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={toggleMobile}
                className={cn(
                  'md:hidden p-2 rounded-lg transition-colors',
                  isScrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10'
                )}
                aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={closeMobile}
        pathname={pathname}
      />
    </>
  );
}
