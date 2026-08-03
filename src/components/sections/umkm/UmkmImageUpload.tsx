'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2, AlertCircle } from 'lucide-react';

interface UmkmImageUploadProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  maxFiles?: number;
  accentColor?: 'emerald' | 'amber';
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB Maximum Per Image

export default function UmkmImageUpload({
  imageUrls,
  onImagesChange,
  maxFiles = 5,
  accentColor = 'emerald',
}: UmkmImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const borderColor = accentColor === 'amber' ? 'border-amber-300' : 'border-emerald-300';
  const hoverBg = accentColor === 'amber' ? 'hover:bg-amber-50' : 'hover:bg-emerald-50';
  const iconColor = accentColor === 'amber' ? 'text-amber-500' : 'text-emerald-500';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    // Check total count (Maksimal 5 gambar untuk UMKM)
    const remainingSlots = maxFiles - imageUrls.length;
    if (files.length > remainingSlots) {
      setError(`Maksimum total ${maxFiles} gambar produk untuk UMKM. Anda hanya bisa menambah ${remainingSlots} gambar lagi.`);
      return;
    }

    // Validate sizes client-side first (Maksimal 1 MB per gambar)
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" melebihi batas ukuran maksimum 1 MB (Ukuran: ${(file.size / 1024 / 1024).toFixed(2)} MB). Silakan kompres gambar terlebih dahulu.`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append('images', file);
      }

      const res = await fetch('/api/upload?maxKb=1024', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.success && Array.isArray(json.data)) {
        onImagesChange([...imageUrls, ...json.data]);
      } else {
        setError(json.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800">
        Foto Produk UMKM <span className="text-slate-400 font-normal">(Maks. {maxFiles} gambar, maks. 1 MB/gambar)</span>
      </label>

      {/* Image Previews */}
      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 group"
            >
              <img
                src={url}
                alt={`Foto produk ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Hapus gambar"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-0.5 left-0.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button Area */}
      {imageUrls.length < maxFiles && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-dashed ${borderColor} ${hoverBg} transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin text-slate-500" />
              <span className="text-xs font-semibold text-slate-500">Mengunggah gambar...</span>
            </>
          ) : (
            <>
              <ImagePlus size={18} className={iconColor} />
              <span className={`text-xs font-semibold ${iconColor}`}>
                {imageUrls.length === 0 ? 'Pilih Foto Produk' : 'Tambah Foto Lagi'}
              </span>
            </>
          )}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
