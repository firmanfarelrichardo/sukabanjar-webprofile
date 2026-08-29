import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  UserCheck,
  Calendar,
  MapPin,
  Shield,
  Award,
  ArrowLeft,
  Quote,
  Building2,
  Phone,
  Mail,
  Home,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_OFFICIALS, OfficialItem } from '@/lib/data/apparatus';

interface PageProps {
  params: {
    id: string;
  };
}

async function getOfficial(id: string): Promise<OfficialItem | null> {
  try {
    if ((prisma as any).apparatus) {
      const dbItem = await (prisma as any).apparatus.findUnique({
        where: { id },
      });
      if (dbItem) return dbItem;
    }
  } catch (err) {
    console.warn('Error fetching apparatus from database, using fallback:', err);
  }

  // Fallback to default list
  const fallback = DEFAULT_OFFICIALS.find((item) => item.id === id);
  return fallback || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const official = await getOfficial(params.id);
  if (!official) {
    return {
      title: 'Aparatur Desa Tidak Ditemukan - Profil Desa Suka Banjar',
    };
  }

  return {
    title: `${official.name} - ${official.role} | Pemerintah Desa Suka Banjar`,
    description: `Biodata dan profil ${official.name}, menjabat sebagai ${official.role} di Pemerintahan Desa Suka Banjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan.`,
  };
}

function formatCalendarDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export default async function AparaturDetailPage({ params }: PageProps) {
  const official = await getOfficial(params.id);

  if (!official) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-950 text-white">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
          <UserCheck size={40} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white mb-2">
          Aparatur Desa Tidak Ditemukan
        </h1>
        <p className="text-slate-400 text-sm max-w-md mb-8">
          Data aparatur yang Anda tuju tidak tersedia atau telah diperbarui oleh administrator desa.
        </p>
        <Link
          href="/#perangkat-desa"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0086C9] hover:bg-[#0072ab] text-white font-bold text-sm transition-all shadow-lg hover:shadow-[#0086C9]/20"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Struktur Organisasi</span>
        </Link>
      </div>
    );
  }

  const initials = official.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-[#0086C9]/30">
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#0086C9]/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/profil" className="hover:text-white transition-colors">
              Profil Desa
            </Link>
            <span>/</span>
            <span className="text-[#0086C9] font-bold">{official.name}</span>
          </nav>

          <Link
            href="/#perangkat-desa"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Struktur Organisasi</span>
          </Link>
        </div>

        {/* Main Profile Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photo Card & Role Badge */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 shadow-2xl p-4">
              {/* Photo Aspect Ratio 3/4 */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800">
                {official.imageUrl ? (
                  <img
                    src={official.imageUrl}
                    alt={official.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                    <span className="text-4xl font-black text-slate-600 font-heading mb-2">
                      {initials}
                    </span>
                    <span className="text-xs">Foto Resmi Aparatur</span>
                  </div>
                )}

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Badge Status */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold backdrop-blur-md">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Aparatur Aktif</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    No. Urut #{official.orderNum}
                  </span>
                </div>
              </div>

              {/* Sub-info Under Photo */}
              <div className="pt-4 text-center space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Pemerintah Desa Suka Banjar
                </p>
                <p className="text-[11px] text-slate-500">
                  Kecamatan Sidomulyo, Kabupaten Lampung Selatan
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Biodata Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Identity */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md shadow-xl space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0086C9]/20 text-[#0086C9] border border-[#0086C9]/30 text-xs font-black uppercase tracking-wider">
                  <Shield size={13} />
                  <span>Aparatur Aktif Pemerintah Desa</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white tracking-tight pt-1">
                  {official.name}
                </h1>
                <p className="text-base sm:text-lg font-bold text-[#0086C9]">
                  {official.role}
                </p>
              </div>

              <div className="h-px bg-slate-800/80 w-full" />

              {/* Structured Biodata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 1. Nama Lengkap */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nama Lengkap & Gelar
                  </span>
                  <p className="text-sm font-extrabold text-white">
                    {official.name}
                  </p>
                </div>

                {/* 2. Jabatan */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Jabatan Struktural
                  </span>
                  <p className="text-sm font-extrabold text-[#0086C9]">
                    {official.role}
                  </p>
                </div>

                {/* 3. Tempat, Tanggal Lahir (Format Kalender Indonesia) */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Calendar size={13} className="text-amber-400" />
                    <span>Tempat, Tanggal Lahir</span>
                  </span>
                  <p className="text-sm font-bold text-slate-200">
                    {official.birthPlace ? `${official.birthPlace}, ` : ''}
                    {official.birthDate ? formatCalendarDate(official.birthDate) : (official.birthPlace ? '' : 'Suka Banjar, Lampung Selatan')}
                  </p>
                </div>

                {/* 4. Jenis Kelamin */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Users size={13} className="text-sky-400" />
                    <span>Jenis Kelamin</span>
                  </span>
                  <p className="text-sm font-bold text-slate-200">
                    {official.gender || (official.name.toLowerCase().includes('siti') || official.name.toLowerCase().includes('nurul') || official.name.toLowerCase().includes('aminah') || official.name.toLowerCase().includes('dewi') ? 'Perempuan' : 'Laki-Laki')}
                  </p>
                </div>

                {/* 5. Alamat Domisili (Full Width) */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <MapPin size={13} className="text-rose-400" />
                    <span>Alamat Domisili</span>
                  </span>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">
                    {official.address || 'Desa Suka Banjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan'}
                  </p>
                </div>
              </div>

              {/* 6. Deskripsi Singkat & Visi Pengabdian */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Quote size={13} className="text-emerald-400" />
                  <span>Deskripsi Singkat & Komitmen Pelayanan</span>
                </span>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 relative">
                  <Quote size={28} className="text-slate-800 absolute top-4 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic font-normal">
                    &ldquo;
                    {official.description ||
                      `Siap mengemban amanah masyarakat dengan tulus, memperkuat pelayanan publik terpadu, dan bersama seluruh elemen warga memajukan Desa Suka Banjar.`}
                    &rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Service Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0086C9]/20 via-slate-900 to-slate-900 border border-[#0086C9]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white">
                  Ingin Berkonsultasi atau Mengurus Layanan?
                </h3>
                <p className="text-xs text-slate-400">
                  Kunjungi Balai Desa Suka Banjar pada hari dan jam kerja Senin - Jumat (08.00 - 15.30 WIB).
                </p>
              </div>

              <Link
                href="/aspirasi"
                className="px-5 py-2.5 rounded-xl bg-[#0086C9] hover:bg-[#006ca3] text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 shrink-0"
              >
                Kirim Pengaduan / Aspirasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
