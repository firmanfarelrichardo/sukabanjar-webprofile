import type { Metadata } from 'next';
import AspirationHero from '@/components/sections/aspirasi/AspirationHero';
import AspirationForm from '@/components/sections/aspirasi/AspirationForm';
import AspirationFAQ from '@/components/sections/aspirasi/AspirationFAQ';

export const metadata: Metadata = {
  title: 'E-Aspirasi & Pengaduan Warga',
  description:
    'Sampaikan masukan, pengaduan fasilitas publik, atau saran secara langsung ke Balai Desa Suka Banjar, Kecamatan Sidomulyo. Opsi anonim tersedia.',
};

export default function AspirationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <AspirationHero />

      {/* Form Pengajuan Aspirasi Direct */}
      <AspirationForm />

      {/* Tanya Jawab FAQ */}
      <AspirationFAQ />
    </div>
  );
}
