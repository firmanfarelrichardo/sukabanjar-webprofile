import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desa Sukabanjar — Website Profil & Portal Digital",
  description: "Portal resmi Desa Sukabanjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
