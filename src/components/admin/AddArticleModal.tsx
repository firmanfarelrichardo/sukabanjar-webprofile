'use client';

import { useState } from 'react';
import { X, Save, Newspaper, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddArticleModal({ isOpen, onClose }: AddArticleModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pengumuman');
  const [author, setAuthor] = useState('Sekretaris Desa');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, author, content }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Artikel berita berhasil diterbitkan!',
        });
        setTimeout(() => {
          setTitle('');
          setContent('');
          setStatusMessage(null);
          onClose();
          router.refresh();
        }, 1500);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal menerbitkan artikel.',
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
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border-4 border-amber-400">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Newspaper size={24} />
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-slate-900">
            Terbit Berita / Pengumuman
          </h3>
          <p className="text-xs text-slate-500">
            Terbitkan pengumuman kegiatan desa atau kabar berita bagi warga
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
            <label className="block text-xs font-bold text-slate-800">Judul Berita / Pengumuman *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Penyuluhan Kesehatan Gratis Balai Desa Hari Sabtu"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="Pengumuman">Pengumuman</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="KKN">KKN</option>
                <option value="Pembangunan">Pembangunan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Penulis</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: Tim KKN Unila"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Isi Berita Lengkap *</label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan berita lengkap di sini..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium leading-relaxed"
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
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Terbitkan Artikel Berita</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
