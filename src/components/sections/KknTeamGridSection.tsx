'use client';

import React from 'react';
import { Users } from 'lucide-react';

export interface KknTeamMember {
  id: string;
  name: string;
  role: string;
  major: string;
  image: string;
  gradient: string;
}

export const KKN_TEAM_MEMBERS: KknTeamMember[] = [
  {
    id: 'kordes',
    name: 'ALBERTON P. MANURUNG',
    role: 'KOORDINATOR DESA',
    major: 'TEKNIK MESIN',
    image: '/images/KKN/4.jpg',
    gradient: 'from-amber-500/20 via-sky-500/10 to-transparent',
  },
  {
    id: 'sekretaris',
    name: 'DHEA PUSPITA RAMADHANTY',
    role: 'SEKRETARIS',
    major: 'MATEMATIKA',
    image: '/images/KKN/7.jpg',
    gradient: 'from-sky-500/20 via-indigo-500/10 to-transparent',
  },
  {
    id: 'bendahara',
    name: 'FEBY AMELIA PUTRI',
    role: 'BENDAHARA',
    major: 'FISIKA',
    image: '/images/KKN/8.jpg',
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
  },
  {
    id: 'humas',
    name: 'RAIHAN GHAZI ALGHIFARI',
    role: 'HUBUNGAN MASYARAKAT',
    major: 'ILMU HUKUM',
    image: '/images/KKN/5.jpg',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  },
  {
    id: 'pdd1',
    name: 'FIRMAN FAREL RICHARDO',
    role: 'PUBLIKASI, DOKUMENTASI & DESAIN',
    major: 'TEKNIK INFORMATIKA',
    image: '/images/KKN/6.jpg',
    gradient: 'from-sky-500/25 via-blue-500/15 to-transparent',
  },
  {
    id: 'perkap',
    name: 'PUTRI SRI RAHAYU',
    role: 'PERLENGKAPAN',
    major: 'KIMIA',
    image: '/images/KKN/9.jpg',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
  {
    id: 'pdd2',
    name: 'FILDA ELITA PUTRI',
    role: 'PUBLIKASI, DOKUMENTASI & DESAIN',
    major: 'BIOLOGI TERAPAN',
    image: '/images/KKN/10.jpg',
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
  },
];

export default function KknTeamGridSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 space-y-12 select-none">
      {/* Header Title Section */}
      <div className="text-center space-y-3">
        

        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
          Struktur Tim{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400">
            KKN Desa Suka Banjar
          </span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          Mahasiswa Kuliah Kerja Nyata Universitas Lampung Periode 2026 yang mengabdi untuk kemajuan Desa Suka Banjar.
        </p>
      </div>

      {/* Centered Flex Layout for Balanced Grid Composition */}
      <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
        {KKN_TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="group relative w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] min-w-[260px] max-w-[285px] bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
          >
            {/* Header Role Banner */}
            <div className="relative pt-6 pb-4 px-4 text-center z-10 flex items-center justify-center min-h-[76px] bg-gradient-to-b from-slate-950 via-slate-900 to-transparent">
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold font-heading tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-md group-hover:from-sky-300 group-hover:to-amber-300 transition-all duration-300 leading-snug">
                {member.role}
              </h3>
            </div>

            {/* Member Portrait Image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-950">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.src = '/images/developer.jpg';
                }}
              />

              {/* Gradient Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              <div className={`absolute inset-0 bg-gradient-to-b ${member.gradient} opacity-40`} />
            </div>

            {/* Member Details Box */}
            <div className="relative z-10 p-5 bg-slate-950 border-t border-slate-800/80 text-center space-y-2.5 flex-1 flex flex-col justify-center">
              <h4 className="text-base sm:text-lg font-black font-heading text-white tracking-tight group-hover:text-amber-300 transition-colors duration-300 leading-snug">
                {member.name}
              </h4>

              <div className="inline-flex items-center justify-center text-xs text-sky-300 font-bold tracking-wider uppercase bg-sky-950/60 px-3 py-1 rounded-xl border border-sky-800/50">
                <span>{member.major}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
