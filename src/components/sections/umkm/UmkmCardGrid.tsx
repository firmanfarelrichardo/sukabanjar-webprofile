'use client';

import { useState } from 'react';
import { ShoppingBag, MessageCircle, User, Store, Edit3, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import EditUmkmModal from '@/components/admin/EditUmkmModal';

export interface UmkmProduct {
  id: string;
  title: string;
  ownerName: string;
  category?: string;
  description: string;
  price: string;
  whatsapp: string;
  imageUrl?: string | null;
  imageUrls?: string[];
}

interface UmkmCardGridProps {
  products: UmkmProduct[];
}

/* ────────────── Image Carousel Sub-Component ────────────── */
function ProductImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full group/carousel">
      <img
        src={images[currentIndex]}
        alt={`${title} - Foto ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
            aria-label="Foto berikutnya"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'w-5 h-2 bg-white shadow-md'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Lihat foto ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter Badge */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/50 text-white text-[10px] font-bold backdrop-blur-sm">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────── Category Color Map ────────────── */
function getCategoryStyle(category: string) {
  switch (category) {
    case 'Olahan Tani':
      return 'bg-lime-50 text-lime-700 border-lime-200';
    case 'Kuliner':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Kerajinan':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'Kopi & Minuman':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

/* ────────────── Main Grid Component ────────────── */
export default function UmkmCardGrid({ products }: UmkmCardGridProps) {
  const router = useRouter();
  const { isAdmin, isEditMode } = useAdmin();
  const [selectedProduct, setSelectedProduct] = useState<UmkmProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (product: UmkmProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk UMKM ini dari katalog?')) return;

    try {
      const res = await fetch(`/api/umkm?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <Store size={40} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">Produk Tidak Ditemukan</h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Tidak ada produk UMKM yang cocok dengan pencarian atau kategori yang Anda pilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {products.map((item) => {
          const waNumber = item.whatsapp.replace(/[^0-9]/g, '');
          const waFormatted = waNumber.startsWith('0')
            ? '62' + waNumber.slice(1)
            : waNumber;
          const waMessage = encodeURIComponent(
            `Halo kak, saya tertarik dengan produk UMKM "${item.title}" di Portal Desa Suka Banjar. Bolehkah saya info selengkapnya?`
          );
          const waUrl = `https://wa.me/${waFormatted}?text=${waMessage}`;

          // Determine images to show
          const allImages = item.imageUrls && item.imageUrls.length > 0
            ? item.imageUrls
            : item.imageUrl
              ? [item.imageUrl]
              : [];

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-accent-400/80 transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                {/* Product Cover Image / Carousel / Decorative Fallback */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {allImages.length > 0 ? (
                    <ProductImageCarousel images={allImages} title={item.title} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-primary-950 flex items-center justify-center text-white/20">
                      <ShoppingBag size={48} className="text-primary-400/40" />
                    </div>
                  )}

                  {/* Price Badge Overlay */}
                  <div className="absolute bottom-3 right-3 z-[5]">
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-accent-500 text-slate-950 shadow-md">
                      {item.price}
                    </span>
                  </div>

                  {/* Admin Edit Buttons Overlay */}
                  {isAdmin && isEditMode && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1 hover:bg-amber-300 transition-colors"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-md hover:bg-rose-600 transition-colors"
                        title="Hapus produk"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Content Body */}
                <div className="p-6 space-y-3">
                  {/* Owner info + Category Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold bg-primary-50 px-2.5 py-1 rounded-full">
                      <User size={13} />
                      <span>Pemilik: {item.ownerName}</span>
                    </div>
                    {item.category && (
                      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryStyle(item.category)}`}>
                        <Tag size={10} />
                        <span>{item.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 font-heading">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Purchase Action */}
              <div className="p-6 pt-0">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle size={17} />
                  Hubungi Penjual (WhatsApp)
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit UMKM Modal */}
      <EditUmkmModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
}
