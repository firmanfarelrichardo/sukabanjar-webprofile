'use client';

import { useState, useEffect, useMemo } from 'react';
import GalleryHero from '@/components/sections/gallery/GalleryHero';
import Masonry, { MasonryItem } from '@/components/ui/Masonry';
import GalleryLightboxModal from '@/components/sections/gallery/GalleryLightboxModal';
import AddGalleryModal from '@/components/admin/AddGalleryModal';
import { Camera, RefreshCw } from 'lucide-react';

const FALLBACK_ITEMS: MasonryItem[] = [
  {
    id: 'gal-1',
    title: 'Panorama Sawah Bertingkat Suka Banjar',
    category: 'Pemandangan Alam',
    description: 'Hamparan pemandangan hijau sawah bertingkat Dusun 2 Desa Suka Banjar yang asri di pagi hari dengan udara sejuk pegunungan.',
    location: 'Dusun 2, Desa Suka Banjar',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    format: 'portrait', // 9:16
    height: 520,
    createdAt: new Date('2026-07-20').toISOString(),
  },
  {
    id: 'gal-2',
    title: 'Matahari Terbenam Kebun Kelapa',
    category: 'Pemandangan Alam',
    description: 'Pemandangan spektakuler matahari terbenam (sunset) di antara siluet deretan pohon kelapa tinggi khas pesisir Sidomulyo.',
    location: 'Dusun 3, Desa Suka Banjar',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    format: 'landscape', // 16:9
    height: 380,
    createdAt: new Date('2026-07-18').toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Gotong Royong & Kerja Bakti Warga',
    category: 'Kegiatan Desa',
    description: 'Tradisi gotong royong warga desa merawat kebersihan lingkungan saluran irigasi sawah dan fasilitas desa.',
    location: 'Dusun 1, Desa Suka Banjar',
    img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop',
    format: 'square', // 1:1
    height: 440,
    createdAt: new Date('2026-07-15').toISOString(),
  },
  {
    id: 'gal-4',
    title: 'Aliran Sungai Jernih Bukit KKN',
    category: 'Pemandangan Alam',
    description: 'Spot favorit warga untuk bersantai menikmati gemericik air sungai alami berbalut bebatuan purba dan Saung KKN.',
    location: 'Dusun 1, Desa Suka Banjar',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
    format: 'portrait', // 9:16
    height: 600,
    createdAt: new Date('2026-07-12').toISOString(),
  },
  {
    id: 'gal-5',
    title: 'Kantor Balai Desa Suka Banjar',
    category: 'Fasilitas Publik',
    description: 'Pusat administrasi pelayanan publik digital dan balai pertemuan utama warga Desa Suka Banjar.',
    location: 'Pusat Desa Suka Banjar',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    format: 'landscape', // 16:9
    height: 360,
    createdAt: new Date('2026-07-10').toISOString(),
  },
  {
    id: 'gal-6',
    title: 'Produksi Kerajinan Anyaman Bambu UMKM',
    category: 'UMKM & Tradisi',
    description: 'Kerajinan tangan produk olahan bambu tradisional hasil karya ibu-ibu PKK dan perajin lokal Desa Suka Banjar.',
    location: 'Dusun 2, Desa Suka Banjar',
    img: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop',
    format: 'square', // 1:1
    height: 480,
    createdAt: new Date('2026-07-08').toISOString(),
  },
];

const CATEGORIES = [
  'Semua Foto',
  'Kegiatan Desa',
  'Pemandangan Alam',
  'Fasilitas Publik',
  'UMKM & Tradisi',
  'Lainnya',
];

export default function GaleriPage() {
  const [galleryItems, setGalleryItems] = useState<MasonryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua Foto');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MasonryItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<MasonryItem | null>(null);

  // Fetch gallery items from API
  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const normalized = json.data.map((item: any) => ({
            ...item,
            img: item.imageUrl || item.img || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
            format: item.format || item.aspectFormat || item.aspectType || (item.height >= 500 ? 'portrait' : item.height <= 340 ? 'landscape' : 'square'),
          }));
          setGalleryItems(normalized);
        } else {
          setGalleryItems(FALLBACK_ITEMS);
        }
      } else {
        setGalleryItems(FALLBACK_ITEMS);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setGalleryItems(FALLBACK_ITEMS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: MasonryItem) => {
    setItemToEdit(item);
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchGallery();
  };

  // Filtering items
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua Foto' || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [galleryItems, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Header Banner & Filters */}
      <GalleryHero
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPhotos={galleryItems.length}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Main Masonry Grid Section - Non-paginated infinite grid */}
      <section className="section-padding bg-slate-50 relative min-h-[60vh] py-12">
        <div className="container-section">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <RefreshCw size={28} className="animate-spin text-[#0086C9]" />
              <p className="text-xs font-semibold">Memuat koleksi foto galeri desa...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
              <Camera size={44} className="text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Tidak Ada Foto Ditemukan
                </h3>
                <p className="text-xs text-slate-500">
                  Tidak ditemukan foto yang sesuai dengan filter atau kata kunci pencarian Anda.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveCategory('Semua Foto');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Reset Filter Pencarian
              </button>
            </div>
          ) : (
            <Masonry
              items={filteredItems}
              animateFrom="bottom"
              stagger={0.04}
              duration={0.6}
              scaleOnHover={true}
              hoverScale={0.96}
              blurToFocus={true}
              colorShiftOnHover={true}
              onItemClick={(item) => setSelectedItem(item)}
            />
          )}
        </div>
      </section>

      {/* Lightbox Preview Modal */}
      <GalleryLightboxModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDeleteItem}
        onEdit={handleOpenEdit}
      />

      {/* Admin Add / Edit Gallery Photo Modal */}
      <AddGalleryModal
        isOpen={isAddModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setItemToEdit(null);
        }}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
