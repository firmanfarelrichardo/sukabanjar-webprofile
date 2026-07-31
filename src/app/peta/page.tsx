'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import MapHero from '@/components/sections/peta/MapHero';
import MapFilterBar from '@/components/sections/peta/MapFilterBar';
import FacilityListGrid from '@/components/sections/peta/FacilityListGrid';
import { FacilityItem } from '@/components/sections/peta/InteractiveLeafletMap';

// Dynamic import Leaflet Map dengan ssr: false agar tidak error di Next.js App Router
const InteractiveLeafletMap = dynamic(
  () => import('@/components/sections/peta/InteractiveLeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm animate-pulse">
        <span>Memuat Peta Interaktif Desa...</span>
      </div>
    ),
  }
);

export default function PetaPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data fasilitas dari API
  useEffect(() => {
    async function loadFacilities() {
      try {
        const res = await fetch('/api/facilities');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setFacilities(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching facilities data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacilities();
  }, []);

  // Hitung jumlah titik per kategori
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: facilities.length };
    facilities.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [facilities]);

  // Filter facilities sesuai kategori aktif
  const filteredFacilities = useMemo(() => {
    if (activeCategory === 'Semua') return facilities;
    return facilities.filter((f) => f.category === activeCategory);
  }, [facilities, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <MapHero totalLocations={facilities.length} />

      {/* Main Map Content Section */}
      <section className="section-padding bg-slate-50 relative">
        <div className="container-section space-y-8">
          {/* Category Filter Bar */}
          <MapFilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categoryCounts={categoryCounts}
          />

          {/* Leaflet Interactive Map Container */}
          <InteractiveLeafletMap facilities={filteredFacilities} />

          {/* Grid List Facility Places */}
          <FacilityListGrid facilities={filteredFacilities} />
        </div>
      </section>
    </div>
  );
}
