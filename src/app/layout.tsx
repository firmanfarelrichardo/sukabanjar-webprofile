import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_INFO } from "@/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [
    "Desa Sukabanjar",
    "Profil Desa",
    "Sidomulyo",
    "Lampung Selatan",
    "UMKM Desa",
    "Wisata Desa",
    "Aspirasi Warga",
    "Peta Fasilitas",
  ],
  authors: [{ name: "Tim KKN Desa Sukabanjar" }],
  openGraph: {
    title: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    description: SITE_INFO.description,
    type: "website",
    locale: "id_ID",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
