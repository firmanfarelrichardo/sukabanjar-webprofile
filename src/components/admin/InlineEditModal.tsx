'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { X, Save, AlertCircle, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export default function InlineEditModal() {
  const router = useRouter();
  const { editModalConfig, closeEditModal, triggerRefresh } = useAdmin();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [missions, setMissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (editModalConfig) {
      const data = editModalConfig.initialData || {};
      setFormData(data);
      if (Array.isArray(data.missions)) {
        setMissions(data.missions);
      } else {
        setMissions(['']);
      }
      setStatusMessage(null);
    }
  }, [editModalConfig]);

  if (!editModalConfig) return null;

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMissionChange = (index: number, value: string) => {
    const updated = [...missions];
    updated[index] = value;
    setMissions(updated);
  };

  const addMissionRow = () => {
    setMissions((prev) => [...prev, '']);
  };

  const removeMissionRow = (index: number) => {
    setMissions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const payload = {
      ...formData,
      missions: missions.filter((m) => m.trim() !== ''),
    };

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Perubahan konten website berhasil disimpan!',
        });
        triggerRefresh();
        router.refresh();
        setTimeout(() => {
          closeEditModal();
        }, 1000);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal menyimpan perubahan.',
        });
      }
    } catch (err) {
      console.error('Error saving profile changes:', err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan sistem. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border-4 border-amber-400">
        {/* Close Button */}
        <button
          onClick={closeEditModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={22} />
        </button>

        {/* Modal Title */}
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            Editor Seluruh Konten Website
          </span>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            {editModalConfig.title}
          </h2>
          <p className="text-xs text-slate-500">
            Ubah teks Visi, Misi, Sejarah, Nama Desa, dan Kontak di bawah ini lalu klik Simpan.
          </p>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Edit Form Fields */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identitas Desa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase">Nama Desa</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase">Kecamatan</label>
              <input
                type="text"
                value={formData.subdistrict || ''}
                onChange={(e) => handleInputChange('subdistrict', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Visi Utama */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase">Visi Utama Desa</label>
            <textarea
              rows={3}
              value={formData.vision || ''}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              placeholder="Masukkan visi utama desa..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 leading-relaxed font-medium"
            />
          </div>

          {/* Poin-poin Misi Desa */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase">
                Poin-poin Misi Desa
              </label>
              <button
                type="button"
                onClick={addMissionRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
              >
                <Plus size={14} />
                <span>+ Tambah Poin Misi</span>
              </button>
            </div>

            <div className="space-y-2">
              {missions.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-6">{idx + 1}.</span>
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => handleMissionChange(idx, e.target.value)}
                    placeholder={`Misi poin ${idx + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                  {missions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMissionRow(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sejarah Desa */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase">Sejarah Desa</label>
            <textarea
              rows={5}
              value={formData.history || ''}
              onChange={(e) => handleInputChange('history', e.target.value)}
              placeholder="Masukkan cerita sejarah desa..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 leading-relaxed font-medium"
            />
          </div>

          {/* Kontak & Alamat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase">No. WhatsApp / Telepon</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase">Email Resmi</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all duration-200 shadow-xl shadow-emerald-600/30 cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Menyimpan Semua...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>💾 Simpan Perubahan Website</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
