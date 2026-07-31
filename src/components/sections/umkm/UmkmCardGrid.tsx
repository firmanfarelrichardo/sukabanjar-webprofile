'use client';

import { useState } from 'react';
import { ShoppingBag, MessageCircle, User, Store, Edit3, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import EditUmkmModal from '@/components/admin/EditUmkmModal';

export interface UmkmProduct {
  id: string;
  title: string;
  ownerName: string;
  description: string;
  price: string;
  whatsapp: string;
  imageUrl?: string | null;
}

interface UmkmCardGridProps {
  products: UmkmProduct[];
}

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
            `Halo kak, saya tertarik dengan produk UMKM "${item.title}" di Portal Desa Sukabanjar. Bolehkah saya info selengkapnya?`
          );
          const waUrl = `https://wa.me/${waFormatted}?text=${waMessage}`;

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-accent-400/80 transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                {/* Product Cover Image / Decorative Fallback */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-primary-950 flex items-center justify-center text-white/20">
                      <ShoppingBag size={48} className="text-primary-400/40" />
                    </div>
                  )}

                  {/* Price Badge Overlay */}
                  <div className="absolute bottom-3 right-3">
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
                  {/* Owner info */}
                  <div className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold bg-primary-50 px-2.5 py-1 rounded-full w-fit">
                    <User size={13} />
                    <span>Pemilik: {item.ownerName}</span>
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20"
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
