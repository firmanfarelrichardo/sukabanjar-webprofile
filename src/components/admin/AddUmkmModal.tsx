'use client';

import { useState } from 'react';
import { X, Save, Store, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UmkmImageUpload from '@/components/sections/umkm/UmkmImageUpload';

const UMKM_CATEGORIES = ['Olahan Tani', 'Kuliner', 'Kerajinan', 'Kopi & Minuman', 'Lainnya'];

interface AddUmkmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddUmkmModal({ isOpen, onClose, onSuccess }: AddUmkmModalProps) {
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/umkm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          ownerName,
          category,
          price: price || 'Hubungi Penjual',
          whatsapp,
          description,
          imageUrls,
          isApproved: true, // Manual add by admin is approved directly
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Produk UMKM berhasil ditambahkan ke katalog!',
        });
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setTitle('');
          setOwnerName('');
          setCategory('Lainnya');
          setPrice('');
          setWhatsapp('');
          setDescription('');
          setImageUrls([]);
          setStatusMessage(null);
          onClose();
          router.refresh();
        }, 1500);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal menambahkan UMKM.',
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan koneksi.',
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
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Store size={14} />
            <span>Katalog UMKM Desa</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 font-heading">
            Tambah Produk UMKM Baru
          </h3>
          <p className="text-xs text-slate-500">
            Daftarkan produk usaha mikro warga Desa Suka Banjar ke katalog resmi.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Upload Foto Produk */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 block">
              Foto Produk (Maks 3 Gambar, Max 1MB/foto)
            </label>
            <UmkmImageUpload
              imageUrls={imageUrls}
              onImagesChange={(urls: string[]) => setImageUrls(urls)}
              maxFiles={3}
              accentColor="amber"
            />
          </div>

          {/* Nama Produk */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 block">
              Nama Produk / Usaha <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Keripik Pisang Coklat Lumer"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Nama Pemilik & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 block">
                Nama Pemilik (Warga) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Contoh: Ibu Rohana (Dusun 2)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 block">
                Kategori Produk
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium bg-white"
              >
                {UMKM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Harga & Nomor WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 block">
                Perkiraan Harga
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: Rp 15.000 / bungkus"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 block">
                Nomor WhatsApp Penjual <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Deskripsi Singkat */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 block">
              Deskripsi Produk & Keunggulan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan bahan baku, keunggulan rasa, varian rasa, atau porsi..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md transition-all flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Simpan Produk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
