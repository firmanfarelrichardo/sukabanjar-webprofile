'use client';

import { useState } from 'react';
import { X, Send, Store, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PublicUmkmRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublicUmkmRegistrationModal({
  isOpen,
  onClose,
}: PublicUmkmRegistrationModalProps) {
  const [title, setTitle] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [price, setPrice] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!title.trim() || !ownerName.trim() || !whatsapp.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Nama produk, pemilik, dan nomor WhatsApp wajib diisi.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/umkm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          ownerName,
          price: price || 'Hubungi Penjual',
          whatsapp,
          description,
          isApproved: false, // Menunggu validasi admin
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Pendaftaran produk UMKM berhasil dikirim! Pengajuan Anda akan ditinjau oleh Admin Desa sebelum ditampilkan.',
        });
        setTimeout(() => {
          setTitle('');
          setOwnerName('');
          setPrice('');
          setWhatsapp('');
          setDescription('');
          setStatusMessage(null);
          onClose();
        }, 2500);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal mengirim pendaftaran UMKM.',
        });
      }
    } catch (err) {
      console.error('Error submitting UMKM registration:', err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan koneksi. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border-2 border-emerald-500">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Store size={24} />
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-slate-900">
            Pendaftaran Produk UMKM Warga
          </h3>
          <p className="text-xs text-slate-500">
            Isi formulir di bawah ini untuk mengusulkan produk atau usaha Anda agar dapat dipromosikan gratis di katalog Desa Sukabanjar.
          </p>
        </div>

        {/* Alert Status */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="shrink-0 text-rose-600 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Nama Produk / Usaha *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kripik Pisang Karamel Sukabanjar"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Nama Pemilik *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Contoh: Ibu Rina"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Patokan Harga</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: Rp 15.000 / bungkus"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">No. WhatsApp Aktif *</label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Deskripsi Singkat Usaha</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan keunggulan dan ketersediaan produk Anda..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

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
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Kirim Pendaftaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
