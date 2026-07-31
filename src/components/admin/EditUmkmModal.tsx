'use client';

import { useState, useEffect } from 'react';
import { X, Save, Store, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UmkmProduct } from '@/components/sections/umkm/UmkmCardGrid';
import UmkmImageUpload from '@/components/sections/umkm/UmkmImageUpload';

const UMKM_CATEGORIES = ['Olahan Tani', 'Kuliner', 'Kerajinan', 'Kopi & Minuman', 'Lainnya'];

interface EditUmkmModalProps {
  product: UmkmProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditUmkmModal({ product, isOpen, onClose }: EditUmkmModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Lainnya');
  const [price, setPrice] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setOwnerName(product.ownerName || '');
      setCategory(product.category || 'Lainnya');
      setPrice(product.price || '');
      setWhatsapp(product.whatsapp || '');
      setDescription(product.description || '');
      setImageUrls(product.imageUrls || []);
      setStatusMessage(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/umkm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          title,
          ownerName,
          category,
          price,
          whatsapp,
          description,
          imageUrls,
          imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
          isApproved: true,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Data produk UMKM berhasil diperbarui!',
        });
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
          router.refresh();
        }, 1200);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal memperbarui UMKM.',
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan sistem.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border-4 border-amber-400">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Store size={24} />
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-slate-900">
            Edit Produk UMKM Terdaftar
          </h3>
          <p className="text-xs text-slate-500">
            Perbarui nama produk, pemilik, harga, atau kontak penjual
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600" />
            ) : (
              <AlertCircle size={18} className="text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Nama Produk / Usaha *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Kategori Usaha */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Kategori Usaha *</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer font-medium"
            >
              {UMKM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Nama Pemilik Usaha *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Patokan Harga</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">No. WhatsApp Penjual *</label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Deskripsi Usaha</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Image Upload */}
          <UmkmImageUpload
            imageUrls={imageUrls}
            onImagesChange={setImageUrls}
            maxFiles={5}
            accentColor="amber"
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
