'use client';

import { useState, useEffect, useMemo } from 'react';
import MapHero from '@/components/sections/peta/MapHero';
import MapFilterBar from '@/components/sections/peta/MapFilterBar';
import FacilityListGrid from '@/components/sections/peta/FacilityListGrid';
import InteractiveGoogleMap, { FacilityItem } from '@/components/sections/peta/InteractiveGoogleMap';
import AddFacilityModal from '@/components/admin/AddFacilityModal';
import Pagination from '@/components/ui/Pagination';
import { useAdmin } from '@/context/AdminContext';
import { Plus } from 'lucide-react';

export default function PetaPage() {
  const { isAdmin } = useAdmin();
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch data fasilitas dari API
  const loadFacilities = async () => {
    try {
      setIsLoading(true);
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
  };

  useEffect(() => {
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

  // Reset page ke 1 saat kategori berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Threshold: > 6 lokasi fasilitas -> 6 per halaman
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const paginatedFacilities = useMemo(() => {
    return filteredFacilities.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredFacilities, currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <MapHero totalLocations={facilities.length} />

      {/* Main Map Content Section */}
      <section className="section-padding bg-slate-50 relative">
        <div className="container-section space-y-8">
          {/* Top Bar - Button Tambah Hanya Tampil untuk Admin */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                Peta Sebaran & Fasilitas Desa Suka Banjar
              </h3>
              <p className="text-xs text-slate-500">
                {isAdmin
                  ? 'Pilih kategori tempat atau klik tombol tambah untuk mendaftarkan titik lokasi fasilitas publik baru.'
                  : 'Pilih kategori tempat untuk melihat sebaran titik lokasi fasilitas publik, instansi, dan UMKM desa secara interaktif.'}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddFacilityOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0086C9] hover:bg-[#006ca3] text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>Tambah Lokasi Fasilitas Baru</span>
              </button>
            )}
          </div>

          {/* Category Filter Bar */}
          <MapFilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categoryCounts={categoryCounts}
          />

          {/* Google Maps Interactive Map Container */}
          {isLoading ? (
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm animate-pulse">
              <span>Memuat Peta Google Maps Desa Suka Banjar...</span>
            </div>
          ) : (
            <InteractiveGoogleMap facilities={filteredFacilities} />
          )}

          {/* Grid List Facility Places & Pagination (Berlaku ketika fasilitas > 6) */}
          <div className="space-y-8">
            <FacilityListGrid facilities={paginatedFacilities} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              totalItems={filteredFacilities.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemName="lokasi fasilitas"
            />
          </div>
        </div>
      </section>

      {/* Add Facility Modal (Hanya untuk Admin) */}
      {isAdmin && (
        <AddFacilityModal
          isOpen={isAddFacilityOpen}
          onClose={() => setIsAddFacilityOpen(false)}
          onSuccess={loadFacilities}
        />
      )}
    </div>
  );
}
