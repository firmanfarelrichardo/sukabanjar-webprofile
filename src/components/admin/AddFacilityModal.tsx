'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, Upload, MapPin, Building2, Check, AlertCircle, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

// Dynamic import for LeafletMapPicker with ssr: false
const LeafletMapPicker = dynamic(() => import('./LeafletMapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-xs font-medium">
      Memuat Peta Pemilih Titik Lokasi...
    </div>
  ),
});

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  facilityToEdit?: any | null;
}

const FACILITY_CATEGORIES = [
  'Pemerintahan',
  'Pendidikan',
  'Kesehatan',
  'Ibadah',
  'Ekonomi',
  'Lainnya',
];

export default function AddFacilityModal({
  isOpen,
  onClose,
  onSuccess,
  facilityToEdit,
}: AddFacilityModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pemerintahan');
  const [latitude, setLatitude] = useState<number>(-5.5864);
  const [longitude, setLongitude] = useState<number>(105.5074);
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [gmapsUrlInput, setGmapsUrlInput] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (facilityToEdit) {
        setName(facilityToEdit.name || '');
        setCategory(facilityToEdit.category || 'Pemerintahan');
        setLatitude(facilityToEdit.latitude || -5.5864);
        setLongitude(facilityToEdit.longitude || 105.5074);
        setAddress(facilityToEdit.address || '');
        setImageUrl(facilityToEdit.imageUrl || '');
        setGmapsUrlInput(`https://www.google.com/maps?q=${facilityToEdit.latitude},${facilityToEdit.longitude}`);
      } else {
        setName('');
        setCategory('Pemerintahan');
        setLatitude(-5.5864);
        setLongitude(105.5074);
        setAddress('');
        setImageUrl('');
        setGmapsUrlInput('');
      }
      setUploadError('');
      setFormError('');
    }
  }, [isOpen, facilityToEdit]);

  if (!isOpen) return null;

  // Single Image Upload with STRICT 1MB MAX SIZE VALIDATION
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 1 MB size check
    if (file.size > 1 * 1024 * 1024) {
      const sizeMb = (file.size / 1024 / 1024).toFixed(2);
      setUploadError(`Ukuran file "${file.name}" melebihi batas maksimum 1MB (Ukuran file: ${sizeMb} MB). Silakan kompres gambar terlebih dahulu.`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');

      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/upload?maxKb=1024', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data && json.data[0]) {
        setImageUrl(json.data[0]);
      } else {
        setUploadError(json.message || 'Gagal mengunggah gambar');
      }
    } catch (err) {
      console.error('Error uploading facility image:', err);
      setUploadError('Terjadi kesalahan saat unggah gambar');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to parse pasted Google Maps URL into Lat & Lng
  const handleGmapsUrlChange = (urlStr: string) => {
    setGmapsUrlInput(urlStr);
    if (!urlStr.trim()) return;

    try {
      // Check for @lat,lng format e.g. /@ -5.5864,105.5074 / or q=-5.5864,105.5074
      const atMatch = urlStr.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const qMatch = urlStr.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      const directMatch = urlStr.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);

      if (atMatch) {
        setLatitude(parseFloat(atMatch[1]));
        setLongitude(parseFloat(atMatch[2]));
      } else if (qMatch) {
        setLatitude(parseFloat(qMatch[1]));
        setLongitude(parseFloat(qMatch[2]));
      } else if (directMatch) {
        setLatitude(parseFloat(directMatch[1]));
        setLongitude(parseFloat(directMatch[2]));
      }
    } catch (err) {
      console.error('Error parsing gmaps URL:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama lokasi fasilitas wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const payload = {
        name: name.trim(),
        category,
        latitude,
        longitude,
        address: address.trim() || null,
        imageUrl: imageUrl.trim() || null,
      };

      const url = facilityToEdit
        ? `/api/facilities?id=${facilityToEdit.id}`
        : '/api/facilities';
      const method = facilityToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setFormError(json.message || 'Gagal menyimpan fasilitas');
      }
    } catch (err) {
      console.error('Error saving facility:', err);
      setFormError('Terjadi kesalahan saat menyimpan fasilitas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0086C9]/10 text-[#0086C9] flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                {facilityToEdit ? 'Edit Lokasi Fasilitas' : 'Tambah Lokasi Fasilitas Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Kelola titik peta, foto lokasi, dan koordinat tempat desa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Nama Lokasi Fasilitas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Nama Lokasi / Fasilitas <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Posyandu Dusun Sandaran I"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0086C9] font-medium"
            />
          </div>

          {/* 2. Kategori Fasilitas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Kategori Fasilitas <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {FACILITY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                    category === cat
                      ? 'bg-[#0086C9] text-white border-[#0086C9] shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Upload Gambar Sampul (Tunggal, Max 1MB) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Foto Sampul Lokasi (Tunggal)</span>
              <span className="text-[10px] text-slate-500 font-normal">Maksimal 1 MB (JPEG, PNG, WebP)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* File Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0086C9] bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[110px]">
                <Upload size={24} className="text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">Pilih / Unggah Gambar</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Maks. 1MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Preview Box */}
              {imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-[110px]">
                  <img
                    src={imageUrl}
                    alt="Preview Fasilitas"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-100 h-[110px] flex flex-col items-center justify-center text-slate-400 text-xs">
                  <ImageIcon size={28} />
                  <span className="text-[10px] font-medium mt-1">Belum ada foto</span>
                </div>
              )}
            </div>

            {isUploading && (
              <p className="text-xs text-[#0086C9] font-medium animate-pulse">Mengunggah gambar (maks 1MB)...</p>
            )}

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* 4. Link Google Maps & Parser */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Link Lokasi / Google Maps (Opsional Parsing)</span>
              <span className="text-[10px] text-slate-500 font-normal">Otomatis ekstraksi koordinat</span>
            </label>
            <div className="relative">
              <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={gmapsUrlInput}
                onChange={(e) => handleGmapsUrlChange(e.target.value)}
                placeholder="Tempel link Google Maps atau koordinat (contoh: https://maps.google.com/...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0086C9] font-medium"
              />
            </div>
          </div>

          {/* 5. Leaflet/OpenStreetMap Interactive Map Picker */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Titik Lokasi Peta (Leaflet / OpenStreetMap)</span>
              <span className="text-[10px] text-[#0086C9] font-bold">Klik peta untuk pilih koordinat</span>
            </label>

            <LeafletMapPicker
              latitude={latitude}
              longitude={longitude}
              onSelectLocation={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
                setGmapsUrlInput(`https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`);
              }}
            />

            {/* Latitude & Longitude Input Fields */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 6. Alamat Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Alamat Lengkap / Dusun
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Dusun Katibung, Desa Suka Banjar"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0086C9] font-medium"
            />
          </div>

          {/* Footer Submit Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0086C9] hover:bg-[#006ca3] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{facilityToEdit ? 'Simpan Perubahan' : 'Tambah Lokasi'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
