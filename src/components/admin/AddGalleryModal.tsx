'use client';

import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface AddGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newItem?: any) => void;
}

const CATEGORIES = [
  'Pemandangan Alam',
  'Kegiatan Desa',
  'Fasilitas Publik',
  'UMKM & Tradisi',
  'Perayaan & Seni',
];

export default function AddGalleryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddGalleryModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pemandangan Alam');
  const [location, setLocation] = useState('Desa Suka Banjar');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [aspectType, setAspectType] = useState<'portrait' | 'square' | 'landscape'>('portrait');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError('');
      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data && json.data[0]) {
        setImageUrl(json.data[0]);
      } else {
        setUploadError(json.message || 'Gagal mengunggah file gambar');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadError('Terjadi kesalahan saat upload gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Judul foto dan Gambar wajib diisi!');
      return;
    }

    let calculatedHeight = 420;
    if (aspectType === 'portrait') calculatedHeight = 520;
    else if (aspectType === 'square') calculatedHeight = 400;
    else if (aspectType === 'landscape') calculatedHeight = 320;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          location,
          description,
          imageUrl,
          height: calculatedHeight,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Reset form
        setTitle('');
        setCategory('Pemandangan Alam');
        setLocation('Desa Suka Banjar');
        setDescription('');
        setImageUrl('');
        setAspectType('portrait');

        if (onSuccess) onSuccess(json.data);
        onClose();
      } else {
        alert(json.message || 'Gagal menyimpan foto galeri baru');
      }
    } catch (err) {
      console.error('Error adding gallery photo:', err);
      alert('Terjadi kesalahan koneksi server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Tambah Foto Galeri Desa
              </h2>
              <p className="text-xs text-slate-500">
                Unggah pemandangan atau kegiatan desa untuk tampil di halaman Galeri Masonry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Foto */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">
              Judul / Caption Foto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Pemandangan Sawah Bertingkat Dusun 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Kategori & Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">Kategori Foto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">Lokasi / Dusun</label>
              <input
                type="text"
                placeholder="Contoh: Dusun 2, Desa Suka Banjar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Upload Foto / URL Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-700">
              Foto Galeri <span className="text-rose-500">*</span>
            </label>

            {/* Option 1: File Upload */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors cursor-pointer shrink-0">
                <Upload size={14} />
                <span>{isUploading ? 'Mengunggah...' : 'Pilih File Foto'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">Atau masukkan URL gambar di bawah:</span>
            </div>

            {uploadError && <p className="text-[11px] text-rose-500">{uploadError}</p>}

            {/* Option 2: URL String */}
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
            />

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                  <Check size={10} /> Gambar Siap
                </span>
              </div>
            )}
          </div>

          {/* Aspect / Height Format for Masonry */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-700">Format Proporsi Kartu Masonry</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspectType('portrait')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  aspectType === 'portrait'
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                📱 Tinggi (Portrait)
              </button>
              <button
                type="button"
                onClick={() => setAspectType('square')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  aspectType === 'square'
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ⏹️ Persegi (Square)
              </button>
              <button
                type="button"
                onClick={() => setAspectType('landscape')}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  aspectType === 'landscape'
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🖼️ Melebar (Landscape)
              </button>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">Deskripsi Keterangan Foto</label>
            <textarea
              rows={3}
              placeholder="Cerita singkat atau catatan seputar foto pemandangan / kegiatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Ke Galeri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
