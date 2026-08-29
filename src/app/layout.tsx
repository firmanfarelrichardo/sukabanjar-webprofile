import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_INFO } from '@/constants';
import { AdminProvider } from '@/context/AdminContext';
import { VillageProfileProvider } from '@/context/VillageProfileContext';
import DynamicFavicon from '@/components/layout/DynamicFavicon';
import FloatingSocialWidget from '@/components/sections/FloatingSocialWidget';
import AdminControlBar from '@/components/admin/AdminControlBar';
import AdminGlobalEditButton from '@/components/admin/AdminGlobalEditButton';
import AdminSaveBar from '@/components/admin/AdminSaveBar';
import InlineEditModal from '@/components/admin/InlineEditModal';
import AdminInboxModal from '@/components/admin/AdminInboxModal';
import ExitEditConfirmationModal from '@/components/admin/ExitEditConfirmationModal';
import IntroSplashOverlay from '@/components/layout/IntroSplashOverlay';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desasukabanjar.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [
    'Desa Suka Banjar',
    'Profil Desa Suka Banjar',
    'Sidomulyo',
    'Lampung Selatan',
    'Pemerintah Desa Suka Banjar',
    'UMKM Desa Suka Banjar',
    'Galeri Desa',
    'Aspirasi Warga',
    'Peta Fasilitas',
    'Statistik Kependudukan',
  ],
  authors: [{ name: 'Pemerintah Desa Suka Banjar' }],
  creator: 'Pemerintah Desa Suka Banjar',
  publisher: 'Pemerintah Desa Suka Banjar',
  openGraph: {
    title: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    description: SITE_INFO.description,
    url: baseUrl,
    type: 'website',
    locale: 'id_ID',
    siteName: SITE_INFO.name,
    images: [
      {
        url: '/images/logos/logo_desa_sipdeskel.jpg',
        width: 1200,
        height: 630,
        alt: 'Logo & Banner Resmi Desa Suka Banjar',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'uBAnzOwbaYk-z_mSQO3fyToH3Ih-Nwiz03ciT8xIt4k',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <VillageProfileProvider>
          <AdminProvider>
            {/* Initial Full-Screen Animated Splash Transition Overlay */}
            <IntroSplashOverlay />

            {/* Dynamic Favicon tab icon */}
            <DynamicFavicon />

            {/* Floating Social Media Widget (Right side) */}
            <FloatingSocialWidget />

            {/* Top Admin Floating Control Bar */}
            <AdminControlBar />

            {/* Public Header GlassSurface Navbar */}
            <Navbar />

            {/* Main View */}
            <main className="flex-1">{children}</main>

            {/* Public Footer */}
            <Footer />

            {/* Corner Floating Action Button for Admin */}
            <AdminGlobalEditButton />

            {/* Bottom Floating Save Bar for In-Place Live Text Editing */}
            <AdminSaveBar />

            {/* Modals for Live Admin Management */}
            <InlineEditModal />
            <AdminInboxModal />
            <ExitEditConfirmationModal />
          </AdminProvider>
        </VillageProfileProvider>
      </body>
    </html>
  );
}
