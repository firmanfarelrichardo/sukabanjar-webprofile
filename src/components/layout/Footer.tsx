'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { SITE_INFO, FOOTER_NAV_ITEMS } from '@/constants';
import { useVillageProfile } from '@/context/VillageProfileContext';

export default function Footer() {
  const pathname = usePathname();
  const { profile } = useVillageProfile();

  if (pathname?.startsWith('/admin') || pathname === '/kkn') return null;

  return (
    <footer className="bg-[#0086C9] text-white border-t border-sky-400/30">
      {/* Main footer content */}
      <div className="container-section py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Kolom 1: Info Desa & Logos */}
          <div className="space-y-5">
            {/* Multi-Logo Header Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Village Logo */}
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-white/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[#0086C9] font-black text-lg font-heading">S</span>
                )}
              </div>

              {/* Logo Lampung */}
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-white/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                <img
                  src="/images/logos/logo_lampung.png"
                  alt="Logo Provinsi Lampung - Sang Bumi Ruwa Jurai"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Logo Desaku Maju */}
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-white/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                <img
                  src="/images/logos/logo_desaku_maju.png"
                  alt="Logo Desaku Maju Lampung Selatan"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <h3 className="font-heading font-black text-white text-xl drop-shadow-sm">
                Desa {profile.name || SITE_INFO.name}
              </h3>
              <p className="text-xs text-sky-100 font-semibold pt-0.5">
                Kecamatan {profile.subdistrict || 'Sidomulyo'}, Kabupaten {profile.district || 'Lampung Selatan'}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-sky-50 font-normal">
              {SITE_INFO.description}
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="font-heading font-black text-amber-300 text-xs uppercase tracking-widest mb-4">
              Navigasi Layanan
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sky-50 hover:text-amber-300 font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Lokasi Maps & Kontak Kami */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-amber-300 text-xs uppercase tracking-widest mb-2">
              Lokasi & Kontak Kami
            </h4>

            {/* Google Maps Interactive Embed (Kantor Desa Suka Banjar) */}
            <div className="relative group">
              <iframe
                title="Peta Lokasi Kantor Desa Suka Banjar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8353398002814!2d105.499691!3d-5.5913363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e411f0050d67711%3A0xa3994d36ce33d4b0!2sKANTOR%20DESA%20SUKABANJAR!5e0!3m2!1sid!2sid!4v1787929018394!5m2!1sid!2sid"
                className="z-10 block p-1 duration-300 w-full shadow bg-white rounded-xl aspect-[4/3] hover:shadow-lg transition-all border border-white/30"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Contact Details */}
            <ul className="space-y-2.5 pt-1">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-300 mt-0.5 shrink-0" />
                <span className="text-sm text-sky-50 leading-relaxed font-medium">
                  {profile.address || SITE_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-amber-300 shrink-0" />
                <a
                  href={`tel:${profile.phone || SITE_INFO.phone}`}
                  className="text-sm text-sky-50 hover:text-amber-300 font-medium transition-colors"
                >
                  {profile.phone || SITE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-300 shrink-0" />
                <a
                  href={`mailto:${profile.email || SITE_INFO.email}`}
                  className="text-sm text-sky-50 hover:text-amber-300 font-medium transition-colors"
                >
                  {profile.email || SITE_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright & KKN Credit Bar */}
      <div className="border-t border-sky-400/30 bg-[#006ca3]">
        <div className="container-section py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-sky-100 font-medium text-center md:text-left">
            <p>
              &copy; {SITE_INFO.year} {profile.name || SITE_INFO.name}. Hak Cipta Dilindungi.
            </p>

            {/* KKN Credit Link in Middle */}
            <Link
              href="/kkn"
              className="text-xs hover:text-white underline underline-offset-4 transition-colors cursor-pointer font-bold text-amber-300 hover:text-amber-200"
            >
              Dibuat oleh KKN Desa Suka Banjar 2026
            </Link>

            <p className="text-sky-100/90">
              Program KKN & Digitalisasi Desa Suka Banjar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
