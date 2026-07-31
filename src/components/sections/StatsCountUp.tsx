'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, Map, Home, ShoppingBag, ShieldCheck } from 'lucide-react';

interface StatsProps {
  stats: {
    areaSize: number;
    totalPopulation: number;
    totalHamlet: number;
    totalUmkm: number;
    totalFacilities: number;
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

  const population = useCountUp(stats.totalPopulation || 3420, 2000, isVisible);
  const hamlets = useCountUp(stats.totalHamlet || 6, 1500, isVisible);
  const umkm = useCountUp(stats.totalUmkm || 18, 1800, isVisible);
  const facilities = useCountUp(stats.totalFacilities || 12, 1600, isVisible);

  const items = [
    {
      label: 'Luas Wilayah',
      value: `${stats.areaSize || 4.52}`,
      unit: 'km²',
      icon: Map,
      description: 'Wilayah Desa Sukabanjar',
    },
    {
      label: 'Total Penduduk',
      value: population.toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: Users,
      description: 'Warga terdaftar di desa',
    },
    {
      label: 'Jumlah Dusun',
      value: `${hamlets}`,
      unit: 'Dusun',
      icon: Home,
      description: 'Wilayah administratif',
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
    <section ref={sectionRef} className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-30 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-30 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-section relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-400">
            Statistik Desa
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
            Sukabanjar Dalam Angka
          </h2>
          <p className="text-slate-400 text-sm">
            Data statistik ringkas wilayah dan potensi kemasyarakatan Desa Sukabanjar
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-3">
                  <Icon size={20} />
                </div>
                <div className="flex items-baseline gap-1 mb-1 font-heading">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-accent-400">
                    {item.unit}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-300 mb-0.5">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-500">
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
