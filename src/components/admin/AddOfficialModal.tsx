'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Check, UserCheck, Edit3 } from 'lucide-react';

interface AddOfficialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newItem: any) => void;
  itemToEdit?: any | null;
}

const COMMON_ROLES = [
  'Kepala Desa',
  'Sekretaris Desa',
  'Kaur Keuangan',
  'Kaur Perencanaan & Umum',
  'Kasi Pemerintahan',
  'Kasi Kesejahteraan & Pelayanan',
  'Kepala Dusun 1',
  'Kepala Dusun 2',
  'Kepala Dusun 3',
  'Kepala Dusun 4',
  'Kepala Dusun 5',
  'Staf Desa',
];

export default function AddOfficialModal({
  isOpen,
  onClose,
  onSuccess,
  itemToEdit,
}: AddOfficialModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderNum, setOrderNum] = useState<number>(1);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setName(itemToEdit.name || '');
        setRole(itemToEdit.role || '');
        setImageUrl(itemToEdit.imageUrl || itemToEdit.img || '');
        setOrderNum(itemToEdit.orderNum || 1);
      } else {
        setName('');
        setRole('');
        setImageUrl('');
        setOrderNum(1);
      }
    }
  }, [isOpen, itemToEdit]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      setUploadError(
        `Ukuran foto "${file.name}" melebihi batas 1MB. Silakan kompres gambar terlebih dahulu.`
      );
      return;
    }

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
        setUploadError(json.message || 'Gagal mengunggah foto');
      }
    } catch (err) {
      console.error('Error uploading official photo:', err);
      setUploadError('Terjadi kesalahan saat unggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalRole = role.trim();

    if (!name.trim() || !finalRole) {
      alert('Nama Aparatur dan Jabatan wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      const isEditing = Boolean(itemToEdit && itemToEdit.id);
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch('/api/apparatus', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: isEditing ? itemToEdit.id : undefined,
          name: name.trim(),
          role: finalRole,
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
          orderNum: Number(orderNum) || 1,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (onSuccess) onSuccess(json.data);
        onClose();
      } else {
        alert(json.message || 'Gagal menyimpan data perangkat desa');
      }
    } catch (err) {
      console.error('Error saving official:', err);
      alert('Terjadi kesalahan koneksi server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0086C9]/10 text-[#0086C9] flex items-center justify-center">
              {itemToEdit ? <Edit3 size={20} /> : <UserCheck size={20} />}
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                {itemToEdit ? 'Edit Data Perangkat Desa' : 'Tambah Perangkat Desa Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {itemToEdit
                  ? 'Ubah nama, jabatan, foto, atau urutan tampilan perangkat desa'
                  : 'Daftarkan aparatur atau perangkat desa untuk tampil di halaman Beranda'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap & Gelar */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700">
              Nama Lengkap & Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Dedi Kurniawan, S.IP"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#0086C9] focus:outline-none"
            />
          </div>

          {/* Jabatan / Posisi (Ketik Manual Langsung) */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700">
              Jabatan / Posisi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kepala Desa / Sekretaris Desa / Kaur Keuangan"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#0086C9] focus:outline-none"
            />
          </div>

          {/* Urutan Tampilan */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700">
              Urutan Hirarki Tampilan (Angka)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={orderNum}
              onChange={(e) => setOrderNum(parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#0086C9] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Semakin kecil angka (misal 1 untuk Kades), semakin depan posisi tampilan pada grid.
            </p>
          </div>

          {/* Upload Foto */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-700">Foto Profil Perangkat Desa</label>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-[#0086C9] border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer shrink-0">
                <Upload size={14} />
                <span>{isUploading ? 'Mengunggah...' : 'Unggah Foto Baru'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">Atau tempelkan URL foto di bawah:</span>
            </div>

            {uploadError && <p className="text-[11px] text-rose-500">{uploadError}</p>}

            <input
              type="text"
              placeholder="https://images.unsplash.com/... atau /uploads/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#0086C9] focus:outline-none font-mono"
            />

            {/* Preview Foto */}
            {imageUrl && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check size={12} /> Foto Siap Digunakan
                  </span>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs">{imageUrl}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0086C9] hover:bg-[#006ca3] text-white font-extrabold text-xs shadow-lg shadow-[#0086C9]/20 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Menyimpan...' : itemToEdit ? 'Simpan Perubahan' : 'Simpan Data Perangkat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
