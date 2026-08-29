'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_OFFICIALS, OfficialItem } from '@/lib/data/apparatus';
import OfficialBiodataModal from '@/components/ui/OfficialBiodataModal';

interface VillageApparatusSectionProps {
  officials?: OfficialItem[];
}

export default function VillageApparatusSection({
  officials = [],
}: VillageApparatusSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<OfficialItem[]>(
    officials && officials.length > 0 ? officials : DEFAULT_OFFICIALS
  );
  const [selectedOfficial, setSelectedOfficial] = useState<OfficialItem | null>(null);

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
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="perangkat-desa" className="py-16 sm:py-20 bg-slate-900 relative overflow-hidden text-white">
      {/* Ambient Orbs Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0086C9]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="container-section relative z-10 space-y-6 sm:space-y-8">
        {/* Section Header dengan Garis Aksen & Tombol Navigasi Scroll */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-block relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white tracking-tight">
                Aparatur Desa
              </h2>
              <div className="w-20 sm:w-24 h-1 bg-[#0086C9] rounded-full mt-2 shadow-sm shadow-[#0086C9]/60 mx-auto sm:mx-0" />
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              Jajaran pimpinan dan aparatur pemerintah yang melayani masyarakat Desa Suka Banjar
            </p>
          </div>

          {/* Navigation Controls untuk Swipe / Scroll Horizontal */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Geser ke kiri"
              className="p-2.5 sm:p-3 rounded-2xl bg-slate-800/90 hover:bg-[#0086C9] text-slate-300 hover:text-white border border-slate-700 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Geser ke kanan"
              className="p-2.5 sm:p-3 rounded-2xl bg-slate-800/90 hover:bg-[#0086C9] text-slate-300 hover:text-white border border-slate-700 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 2-Row Horizontal Scrollable Grid (Tepat 2 Baris ke Samping) */}
        <div
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col auto-cols-[165px] sm:auto-cols-[190px] md:auto-cols-[210px] lg:auto-cols-[225px] gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/40"
        >
          {displayOfficials.map((person) => {
            const initials = person.name
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('');

            return (
              <div
                key={person.id}
                onClick={() => setSelectedOfficial(person)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedOfficial(person);
                  }
                }}
                className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950/90 border border-slate-800/90 hover:border-[#0086C9] shadow-lg hover:shadow-2xl hover:shadow-[#0086C9]/25 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-end select-none snap-start"
              >
                {/* Background Image / Placeholder */}
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center text-slate-500">
                    <span className="text-3xl font-black text-slate-600 font-heading">
                      {initials}
                    </span>
                    <span className="text-[10px] mt-1 text-slate-400">Aparatur</span>
                  </div>
                )}

                {/* Dark Gradient Bottom Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Text Card Strip at Bottom */}
                <div className="relative z-10 p-2.5 sm:p-3 text-center flex flex-col items-center justify-end w-full">
                  <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-white uppercase tracking-wider font-heading line-clamp-1 group-hover:text-[#0086C9] transition-colors drop-shadow-md">
                    {person.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate w-full mt-0.5 drop-shadow-sm">
                    {person.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Pop-Up Modal Biodata */}
      <OfficialBiodataModal
        official={selectedOfficial}
        onClose={() => setSelectedOfficial(null)}
      />
    </section>
  );
}

