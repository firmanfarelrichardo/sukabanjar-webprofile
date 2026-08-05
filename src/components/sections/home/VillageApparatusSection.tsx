'use client';

import React, { useRef, useState, useEffect } from 'react';
import { UserCheck, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Official {
  id: string;
  name: string;
  role: string;
  imageUrl?: string | null;
  orderNum?: number;
}

interface VillageApparatusSectionProps {
  officials?: Official[];
}

const DEFAULT_OFFICIALS: Official[] = [
  {
    id: 'off-1',
    name: 'Dedi Kurniawan, S.IP',
    role: 'Kepala Desa',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'off-2',
    name: 'Rahmat Hidayat, S.Sos',
    role: 'Sekretaris Desa',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'off-3',
    name: 'Budi Santoso, S.E',
    role: 'Kaur Keuangan',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'off-4',
    name: 'Siti Aminah, A.Md',
    role: 'Kaur Perencanaan & Umum',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'off-5',
    name: 'Ahmad Fauzi, S.H',
    role: 'Kasi Pemerintahan',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'off-6',
    name: 'Nurul Huda, S.Pd',
    role: 'Kasi Kesejahteraan',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
  },
];

export default function VillageApparatusSection({
  officials = [],
}: VillageApparatusSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Official[]>(officials && officials.length > 0 ? officials : DEFAULT_OFFICIALS);

  useEffect(() => {
    async function loadApparatus() {
      try {
        const res = await fetch('/api/apparatus');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.length > 0) {
            setItems(json.data);
          }
        }
      } catch (err) {
        console.error('Error loading apparatus:', err);
      }
    }
    loadApparatus();
  }, [officials]);

  const displayOfficials = items && items.length > 0 ? items : DEFAULT_OFFICIALS;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden text-white">
      {/* Ambient Orbs Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0086C9]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="container-section relative z-10 space-y-8">
        {/* Section Header with Left/Right Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0086C9]/20 text-[#0086C9] border border-[#0086C9]/30 text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <UserCheck size={14} />
              <span>Pemerintahan & Pelayan Masyarakat</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight leading-tight">
              Aparatur & Perangkat <span className="text-[#0086C9]">Desa Suka Banjar</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Mengenal jajaran pimpinan dan aparatur pemerintah desa yang siap memberikan pelayanan publik digital terbaik, responsif, dan ramah untuk seluruh warga Desa Suka Banjar.
            </p>
          </div>

          {/* Left & Right Scroll Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Geser Kiri"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-[#0086C9] text-slate-300 hover:text-white border border-slate-700 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Geser Kanan"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-[#0086C9] text-slate-300 hover:text-white border border-slate-700 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto pt-2 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/40"
        >
          {displayOfficials.map((person) => {
            const isKades = person.role.toLowerCase().includes('kepala desa');

            return (
              <div
                key={person.id}
                className="w-[260px] sm:w-[280px] shrink-0 snap-start group relative bg-slate-800/80 rounded-3xl p-4 border border-slate-700/60 hover:border-[#0086C9]/50 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0086C9]/10 flex flex-col"
              >
                {/* Photo Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-700/50">
                  <img
                    src={
                      person.imageUrl ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop'
                    }
                    alt={person.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Role Badge inside image - Clean Glass Border Without Icons */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-950/65 text-slate-100 border border-slate-700/80 backdrop-blur-md shadow-lg w-full text-center">
                      <span className="truncate">{person.role}</span>
                    </span>
                  </div>
                </div>

                {/* Name Details */}
                <div className="px-2 py-1 text-center mt-auto">
                  <h3 className="text-base font-extrabold text-white font-heading group-hover:text-[#0086C9] transition-colors line-clamp-1">
                    {person.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
