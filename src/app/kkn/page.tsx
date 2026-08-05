'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, GraduationCap, Code, Camera } from 'lucide-react';
import ProfileCard from '@/components/ui/ProfileCard';
import DriftWall, { DriftWallItem } from '@/components/ui/DriftWall';
import KknTeamGridSection from '@/components/sections/KknTeamGridSection';

const KKN_PHOTOS: DriftWallItem[] = [
  { image: '/images/KKN/10.jpg', title: 'Kegiatan KKN Desa Suka Banjar 2026' },
  { image: '/images/KKN/4.jpg', title: 'Dokumentasi KKN Suka Banjar' },
  { image: '/images/KKN/5.jpg', title: 'Program Kerja KKN UNILA' },
  { image: '/images/KKN/6.jpg', title: 'Pengabdian Masyarakat KKN UNILA' },
  { image: '/images/KKN/7.jpg', title: 'Kegiatan Warga & KKN' },
  { image: '/images/KKN/8.jpg', title: 'Saung & Posko KKN Desa Suka Banjar' },
  { image: '/images/KKN/9.jpg', title: 'Foto Kebersamaan Mahasiswa KKN' },
  { image: '/images/KKN/IMG_3400.JPG', title: 'Kegiatan Lapangan KKN' },
  { image: '/images/KKN/IMG_3402.JPG', title: 'Sosialisasi Digitalisasi Desa' },
  { image: '/images/KKN/IMG_3403.JPG', title: 'Dokumentasi Program KKN' },
  { image: '/images/KKN/IMG_3405.JPG', title: 'Kerja Bakti Bersama Warga' },
  { image: '/images/KKN/IMG_3406.JPG', title: 'Upacara & Pertemuan Balai Desa' },
  { image: '/images/KKN/IMG_3407.JPG', title: 'Tim Mahasiswa KKN Universitas Lampung' },
  { image: '/images/KKN/IMG_3431.JPG', title: 'Kegiatan Edukasi & Pengabdian' },
  { image: '/images/KKN/IMG_3442.JPG', title: 'Pemetaan Peta Fasilitas Desa' },
  { image: '/images/KKN/IMG_3468.JPG', title: 'Kunjungan UMKM Desa Suka Banjar' },
  { image: '/images/KKN/IMG_3474.JPG', title: 'Foto Bersama Pengurus Balai Desa' },
  { image: '/images/KKN/IMG_3479.JPG', title: 'Dokumentasi Lokasi KKN' },
  { image: '/images/KKN/IMG_3484.JPG', title: 'Kebersamaan Mahasiswa KKN 2026' },
];

export default function KknStandalonePage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden flex flex-col select-none pb-20">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#0086C9]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-50 w-full p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Website Utama</span>
        </Link>

        
      </header>

      {/* Main Page Title Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-10 pb-6 space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300">
            KKN UNILA 2026
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Dokumentasi Album, Formasi Struktur Tim, dan Pengembang Sistem Informasi Desa Suka Banjar.
        </p>
      </div>

      {/* SECTION 1: 3D DriftWall Galeri Foto Kegiatan KKN */}
      <section className="relative w-full z-10 my-4 border-y border-slate-800/80 bg-slate-900/60 shadow-2xl">
        

        {/* 3D DriftWall Interactive Canvas - Portrait Aspect Ratio (No Cropping) */}
        <div className="relative w-full h-[600px] sm:h-[720px] md:h-[780px] z-10">
          <DriftWall
            items={KKN_PHOTOS}
            columns={7}
            tileWidth={210}
            tileHeight={310}
            gap={18}
            scale={1.65}
            tilt={8}
            turn={0}
            perspective={1200}
            depth={80}
            speed={38}
            direction="up"
            variance={0.4}
            parallax={0.5}
            lift={64}
            fade={0.65}
            dim={0.75}
            overlayColor="#020617"
          />
        </div>
      </section>

      {/* SECTION 2 (BARU - DILETAKKAN SEBELUM DEVELOPER): FORMASI TIM KKN GRID */}
      <div className="relative z-10">
        <KknTeamGridSection />
      </div>

      {/* SECTION 3: 3D ProfileCard Developer & Info Dedikasi KKN */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-12 flex flex-col items-center gap-10 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-extrabold tracking-widest uppercase">
            <Code size={16} className="text-sky-400" />
            <span>PROFIL PENGEMBANG UTAMA</span>
          </div>
        </div>

        {/* 3D ProfileCard Component featuring Developer Image (Bebas Silau Overexposure) */}
        <div className="w-full flex justify-center py-2">
          <ProfileCard
            avatarUrl="/images/developer.jpg"
            miniAvatarUrl="/images/developer.jpg"
            name="Developer"
            title="Pengembang Website Resmi Desa Suka Banjar"
            handle="kkn.sukabanjar.2026"
            status="UNILA 2026"
            contactText="Kontak Tim"
            behindGlowEnabled={true}
            behindGlowColor="rgba(0, 134, 201, 0.75)"
            enableTilt={true}
            onContactClick={() => {
              window.open('https://www.instagram.com/kkn.sukabanjar.2026/', '_blank');
            }}
          />
        </div>

        {/* Description & Credit Box */}
        <div className="max-w-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={16} />
            <span>DEDIKASI DIGITALISASI DESA</span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Website Sistem Informasi & Web Profile Desa Suka Banjar ini dirancang dan dikembangkan secara penuh oleh <strong>Tim Mahasiswa Kuliah Kerja Nyata (KKN) Universitas Lampung Periode 2026</strong> sebagai bentuk kontribusi dan pengabdian nyata dalam memodernisasi layanan publik, data demografi, pemetaan fasilitas geospasial, serta promosi potensi UMKM desa.
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
            <span>Dibuat oleh Tim KKN UNILA 2026 • Desa Suka Banjar, Sidomulyo</span>
          </div>
        </div>
      </section>
    </div>
  );
}
