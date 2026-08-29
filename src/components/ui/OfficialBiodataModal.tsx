'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  UserCheck,
  Calendar,
  MapPin,
  Shield,
  Quote,
  Users,
  CheckCircle2,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { OfficialItem } from '@/lib/data/apparatus';

interface OfficialBiodataModalProps {
  official: OfficialItem | null;
  onClose: () => void;
}

export function formatCalendarDate(dateStr?: string | null): string {
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

export default function OfficialBiodataModal({
  official,
  onClose,
}: OfficialBiodataModalProps) {
  useEffect(() => {
    if (!official) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [official, onClose]);

  if (!official) return null;

  const initials = official.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const genderDisplay =
    official.gender ||
    (official.name.toLowerCase().includes('siti') ||
    official.name.toLowerCase().includes('nurul') ||
    official.name.toLowerCase().includes('aminah') ||
    official.name.toLowerCase().includes('dewi') ||
    official.name.toLowerCase().includes('neneng') ||
    official.name.toLowerCase().includes('yunaini') ||
    official.name.toLowerCase().includes('sapitri')
      ? 'Perempuan'
      : 'Laki-Laki');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-official-name"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/90 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl text-white my-auto overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#0086C9]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0086C9]/20 text-[#0086C9] border border-[#0086C9]/30 text-xs font-black uppercase tracking-wider">
            <Shield size={13} />
            <span>Biodata Resmi Aparatur Desa</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Pop Up Biodata"
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto space-y-6 pt-5 pr-1 relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/40">
          {/* Header Identity Row: Photo + Name/Role */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Portrait Photo */}
            <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-lg shrink-0 group">
              {official.imageUrl ? (
                <img
                  src={official.imageUrl}
                  alt={official.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                  <span className="text-3xl font-black text-slate-600 font-heading">
                    {initials}
                  </span>
                  <span className="text-[10px] mt-1">Foto Resmi</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 inset-x-2">
                <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold backdrop-blur-md w-full text-center">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>Aparatur Aktif</span>
                </span>
              </div>
            </div>

            {/* Name and Designation */}
            <div className="space-y-2 flex-1 pt-1">
              <h2
                id="modal-official-name"
                className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight"
              >
                {official.name}
              </h2>
              <p className="text-sm sm:text-base font-extrabold text-[#0086C9]">
                {official.role}
              </p>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <Building2 size={13} className="text-slate-500 shrink-0" />
                <span>Pemerintah Desa Suka Banjar, Kec. Sidomulyo</span>
              </p>
            </div>
          </div>

          {/* Structured Biodata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Nama Lengkap & Gelar */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Nama Lengkap & Gelar
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-white">
                {official.name}
              </p>
            </div>

            {/* 2. Jabatan Struktural */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Jabatan Struktural
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[#0086C9]">
                {official.role}
              </p>
            </div>

            {/* 3. Tempat, Tanggal Lahir */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Calendar size={13} className="text-amber-400" />
                <span>Tempat, Tanggal Lahir</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-200">
                {official.birthPlace ? `${official.birthPlace}, ` : ''}
                {official.birthDate
                  ? formatCalendarDate(official.birthDate)
                  : official.birthPlace
                  ? ''
                  : 'Suka Banjar, Lampung Selatan'}
              </p>
            </div>

            {/* 4. Jenis Kelamin */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Users size={13} className="text-sky-400" />
                <span>Jenis Kelamin</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-200">
                {genderDisplay}
              </p>
            </div>

            {/* 5. Alamat Domisili (Full Width) */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <MapPin size={13} className="text-rose-400" />
                <span>Alamat Domisili</span>
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                {official.address ||
                  'Desa Suka Banjar, Kecamatan Sidomulyo, Kabupaten Lampung Selatan'}
              </p>
            </div>

            {/* 6. Deskripsi Singkat */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-1.5 relative">
              <Quote
                size={24}
                className="text-slate-800 absolute top-3 right-3 pointer-events-none"
              />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Quote size={13} className="text-emerald-400" />
                <span>Deskripsi Singkat</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed pt-0.5">
                &ldquo;
                {official.description ||
                  'Siap mengemban amanah masyarakat dengan tulus, memperkuat pelayanan publik terpadu, dan bersama seluruh elemen warga memajukan Desa Suka Banjar.'}
                &rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0">
          <Link
            href="/aspirasi"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all"
          >
            <span>Kirim Aspirasi / Pengaduan</span>
          </Link>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0086C9] hover:bg-[#0072ab] text-white font-extrabold text-xs transition-all shadow-lg hover:shadow-[#0086C9]/25 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
