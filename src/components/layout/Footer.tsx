'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SITE_INFO, FOOTER_NAV_ITEMS } from '@/constants';
import { useVillageProfile } from '@/context/VillageProfileContext';

export default function Footer() {
  const pathname = usePathname();
  const { profile } = useVillageProfile();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Main footer content */}
      <div className="container-section py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Kolom 1: Info Desa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-white font-bold text-base font-heading">S</span>
                )}
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-white text-base">
                  {profile.name || SITE_INFO.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Kec. {profile.subdistrict || 'Sidomulyo'}, {profile.district || 'Lampung Selatan'}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {SITE_INFO.description}
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4">
              Navigasi Layanan
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4">
              Kontak Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  {profile.address || SITE_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <a
                  href={`tel:${profile.phone || SITE_INFO.phone}`}
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {profile.phone || SITE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <a
                  href={`mailto:${profile.email || SITE_INFO.email}`}
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {profile.email || SITE_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="container-section py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              &copy; {SITE_INFO.year} {profile.name || SITE_INFO.name}. Hak Cipta Dilindungi.
            </p>
            <p>
              Program KKN & digitalisasi Desa Suka Banjar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
