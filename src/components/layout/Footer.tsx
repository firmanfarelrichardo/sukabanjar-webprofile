'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SITE_INFO, FOOTER_NAV_ITEMS } from '@/constants';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer content */}
      <div className="container-section py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Kolom 1: Info Desa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
                <span className="text-white font-bold text-sm font-heading">S</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  {SITE_INFO.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Kec. Sidomulyo, Lampung Selatan
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {SITE_INFO.description}
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Kontak Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  {SITE_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-500 shrink-0" />
                <a
                  href={`tel:${SITE_INFO.phone}`}
                  className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                >
                  {SITE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-500 shrink-0" />
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                >
                  {SITE_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-slate-800">
        <div className="container-section py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              &copy; {SITE_INFO.year} {SITE_INFO.name}. Hak Cipta Dilindungi.
            </p>
            <p>
              Program KKN — Universitas Lampung
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
