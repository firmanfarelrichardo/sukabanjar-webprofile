'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, Map, Home, ShoppingBag, ShieldCheck } from 'lucide-react';

interface StatsProps {
  stats: {
    areaSize?: number;
    totalPopulation?: number;
    totalHamlet?: number;
    totalKK?: number;
    totalUmkm?: number;
    totalFacilities?: number;
  };
}

function useCountUp(target: number, duration: number = 2000, startNow: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startNow) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration, startNow]);

  return count;
}

export default function StatsCountUp({ stats }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Authentic Official Data of Desa Suka Banjar
  const population = useCountUp(stats?.totalPopulation || 5153, 2000, isVisible);
  const hamlets = useCountUp(stats?.totalHamlet || 5, 1500, isVisible);
  const totalKKCount = useCountUp(stats?.totalKK || 1388, 1800, isVisible);
  const umkm = useCountUp(stats?.totalUmkm || 1, 1800, isVisible);
  const facilities = useCountUp(stats?.totalFacilities || 12, 1600, isVisible);

  const items = [
    {
      label: 'Total Dusun',
      value: `${hamlets || 5}`,
      unit: 'Dusun',
      icon: Home,
      description: 'Wilayah administratif desa',
    },
    {
      label: 'Total Penduduk',
      value: population.toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: Users,
      description: 'Warga terdaftar di desa',
    },
    {
      label: 'Jumlah KK',
      value: totalKKCount.toLocaleString('id-ID'),
      unit: 'KK',
      icon: Map,
      description: 'Kepala Keluarga',
    },
    {
      label: 'UMKM Aktif',
      value: `${umkm}`,
      unit: 'Usaha',
      icon: ShoppingBag,
      description: 'Potensi ekonomi warga',
    },
    {
      label: 'Fasilitas Publik',
      value: `${facilities}`,
      unit: 'Titik',
      icon: ShieldCheck,
      description: 'Fasilitas umum & ibadah',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white text-slate-900 relative overflow-hidden border-y border-slate-100">
      {/* Subtle Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-30 right-0 w-80 h-80 bg-[#0086C9]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-30 left-0 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container-section relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0086C9] bg-[#0086C9]/10 px-3.5 py-1 rounded-full border border-[#0086C9]/20 inline-block">
            Statistik Desa
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Suka Banjar Dalam Angka
          </h2>
          <p className="text-slate-600 text-sm">
            Data statistik ringkas wilayah dan potensi kemasyarakatan Desa Suka Banjar
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-[#0086C9]/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0086C9]/10 text-[#0086C9] flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <div className="flex items-baseline gap-1 mb-1 font-heading">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 group-hover:text-[#0086C9] transition-colors">
                    {item.value}
                  </span>
                  <span className="text-xs font-bold text-[#0086C9]">
                    {item.unit}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-800 mb-0.5">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {item.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
