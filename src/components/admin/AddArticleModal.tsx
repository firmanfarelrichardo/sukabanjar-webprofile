'use client';

import { useState, useEffect } from 'react';
import { X, Save, Newspaper, Loader2, CheckCircle2, AlertCircle, Upload, Calendar, Tag, User, Image as ImageIcon, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleToEdit?: any | null;
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Kegiatan Desa',
  'Pengumuman',
  'Pembangunan',
  'Pendidikan',
  'Pertanian',
  'Ekonomi',
  'Kesehatan',
  'Sosial & Budaya',
  'KKN',
  'Lainnya',
];

export default function AddArticleModal({
  isOpen,
  onClose,
  articleToEdit,
  onSuccess,
}: AddArticleModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kegiatan Desa');
  const [author, setAuthor] = useState('Tim Redaksi Desa');
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatusMessage(null);
      if (articleToEdit) {
        setTitle(articleToEdit.title || '');
        setCategory(articleToEdit.category || 'Kegiatan Desa');
        setAuthor(articleToEdit.author || 'Tim Redaksi Desa');
        const dateStr = articleToEdit.createdAt
          ? new Date(articleToEdit.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        setPublishedAt(dateStr);
        setContent(articleToEdit.content || '');
        setImageUrl(articleToEdit.imageUrl || articleToEdit.img || '');
      } else {
        setTitle('');
        setCategory('Kegiatan Desa');
        setAuthor('Tim Redaksi Desa');
        setPublishedAt(new Date().toISOString().split('T')[0]);
        setContent('');
        setImageUrl('');
      }
    }
  }, [isOpen, articleToEdit]);

  if (!isOpen) return null;

  // File Upload Handler with strict 1MB limit validation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage(null);

    // Strict 1MB Check on Client Side
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
    if (file.size > MAX_SIZE_BYTES) {
      const fileMb = (file.size / (1024 * 1024)).toFixed(2);
      setStatusMessage({
        type: 'error',
        text: `Ukuran foto "${file.name}" adalah ${fileMb}MB (melebihi batas maksimum 1MB). Silakan kompres atau pilih foto lain yang berukuran < 1MB.`,
      });
      e.target.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/upload?maxKb=1024', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data && json.data[0]) {
        setImageUrl(json.data[0]);
        setStatusMessage({
          type: 'success',
          text: 'Gambar cover berita (< 1MB) berhasil diunggah!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal mengunggah gambar berita.',
        });
      }
    } catch (err) {
      console.error('Error uploading news image:', err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat unggah gambar.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!title.trim() || !content.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Judul dan isi konten berita wajib diisi!',
      });
      return;
    }

    try {
      setIsLoading(true);
      const isEditing = Boolean(articleToEdit && articleToEdit.id);
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: isEditing ? articleToEdit.id : undefined,
          title,
          category,
          author,
          publishedAt,
          content,
          imageUrl,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: isEditing ? 'Artikel berita berhasil diperbarui!' : 'Artikel berita berhasil diterbitkan!',
        });
        setTimeout(() => {
          setTitle('');
          setContent('');
          setImageUrl('');
          setStatusMessage(null);
          if (onSuccess) onSuccess();
          onClose();
          router.refresh();
        }, 1000);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal menyimpan artikel berita.',
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100 text-slate-900">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              {articleToEdit ? <Edit3 size={24} /> : <Newspaper size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-heading text-slate-900">
                {articleToEdit ? 'Form Edit Artikel Berita' : 'Form Pop-Up Berita & Pengumuman Desa'}
              </h3>
              <p className="text-xs text-slate-500">
                {articleToEdit
                  ? 'Ubah judul, kategori, tanggal, penulis, atau isi konten berita'
                  : 'Terbitkan berita resmi dengan gambar cover (Maks. 1 Foto, Ukuran Maks. 1MB)'}
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

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Judul Berita */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>Judul Berita *</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul berita utama yang menarik..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* 2. Kategori, Tanggal Terbit, Penulis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Tag size={13} className="text-amber-600" />
                <span>Kategori Berita</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Terbit */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Calendar size={13} className="text-emerald-600" />
                <span>Tanggal Terbit</span>
              </label>
              <input
                type="date"
                required
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Penulis / Redaksi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <User size={13} className="text-sky-600" />
                <span>Penulis / Redaksi</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: Tim Redaksi Desa"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Upload Gambar Cover Berita (Maks 1 Foto, Ukuran Maks 1MB) */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <ImageIcon size={15} className="text-amber-600" />
                <span>Gambar Cover Berita (Maks 1 Foto, Max 1MB)</span>
              </label>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Batas 1MB
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Preview Thumbnail */}
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview Berita" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-slate-300" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer shadow-sm">
                  <Upload size={14} />
                  <span>{isUploading ? 'Mengunggah...' : 'Upload Foto (< 1MB)'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  placeholder="Atau masukkan URL Gambar Cover..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Isi Konten Berita */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800">Isi Konten Berita Lengkap *</label>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi artikel berita selengkapnya di sini..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Modal Footer Actions */}
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
              disabled={isLoading || isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{articleToEdit ? 'Menyimpan...' : 'Menerbitkan...'}</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{articleToEdit ? 'Simpan Perubahan Berita' : 'Terbitkan Berita'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
