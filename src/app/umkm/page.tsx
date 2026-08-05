'use client';

import { useState, useEffect, useMemo } from 'react';
import UmkmHero from '@/components/sections/umkm/UmkmHero';
import UmkmSearchFilter from '@/components/sections/umkm/UmkmSearchFilter';
import UmkmCardGrid, { UmkmProduct } from '@/components/sections/umkm/UmkmCardGrid';
import UmkmCTA from '@/components/sections/umkm/UmkmCTA';
import AdminUmkmValidationModal from '@/components/sections/umkm/AdminUmkmValidationModal';
import PublicUmkmRegistrationModal from '@/components/sections/umkm/PublicUmkmRegistrationModal';
import Pagination from '@/components/ui/Pagination';
import { useAdmin } from '@/context/AdminContext';
import { ShieldCheck, Inbox } from 'lucide-react';

export default function UmkmPage() {
  const { isAdmin } = useAdmin();
  const [products, setProducts] = useState<UmkmProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isValidatingModalOpen, setIsValidatingModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data UMKM dari API
  useEffect(() => {
    async function loadUmkm() {
      try {
        const res = await fetch('/api/umkm');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProducts(json.data);
          }
        }

        if (isAdmin) {
          const allRes = await fetch('/api/umkm?all=true');
          if (allRes.ok) {
            const allJson = await allRes.json();
            if (allJson.success && Array.isArray(allJson.data)) {
              const unapproved = allJson.data.filter((item: any) => item.isApproved === false);
              setPendingCount(unapproved.length);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching UMKM data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUmkm();
  }, [isAdmin]);

  // Filter produk berdasarkan pencarian & kategori
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  // Reset page ke 1 saat filter pencarian/kategori berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Threshold: > 6 UMKM -> 6 UMKM per halaman
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <UmkmHero totalProducts={products.length} />

      {/* Main Content Section */}
      <section className="section-padding bg-slate-50 relative">
        <div className="container-section space-y-8">
          {/* Admin Validation Quick Bar Trigger */}
          {isAdmin && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-900">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm font-heading">
                <ShieldCheck size={18} className="text-amber-600" />
                <span>Panel Admin: Manajemen UMKM Desa</span>
              </div>
              <button
                onClick={() => setIsValidatingModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <Inbox size={15} />
                <span>Validasi Pengajuan Warga</span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-extrabold animate-pulse">
                    {pendingCount} Baru
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <UmkmSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Product Grid */}
          {isLoading ? (
            <div className="text-center py-16 text-slate-400 text-sm animate-pulse">
              Memuat katalog produk UMKM...
            </div>
          ) : (
            <div className="space-y-8">
              <UmkmCardGrid products={paginatedProducts} />

              {/* Pagination (Berlaku ketika produk UMKM > 6) */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                totalItems={filteredProducts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="produk UMKM"
              />
            </div>
          )}
        </div>
      </section>

      {/* CTA Pendaftaran Usaha Warga */}
      <UmkmCTA onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      {/* Public Citizen UMKM Submission Modal */}
      <PublicUmkmRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Admin Validation Pop-Up Modal */}
      <AdminUmkmValidationModal
        isOpen={isValidatingModalOpen}
        onClose={() => setIsValidatingModalOpen(false)}
      />
    </div>
  );
}
