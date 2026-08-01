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

export const metadata: Metadata = {
  title: {
    default: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [
    'Desa Suka Banjar',
    'Profil Desa',
    'Sidomulyo',
    'Lampung Selatan',
    'UMKM Desa',
    'Galeri Desa',
    'Aspirasi Warga',
    'Peta Fasilitas',
  ],
  authors: [{ name: 'Tim Pengelola Desa Suka Banjar' }],
  openGraph: {
    title: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    description: SITE_INFO.description,
    type: 'website',
    locale: 'id_ID',
    siteName: SITE_INFO.name,
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
