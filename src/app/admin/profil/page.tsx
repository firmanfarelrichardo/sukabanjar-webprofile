'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminProfilEditorPage() {
  const [name, setName] = useState('Suka Banjar');
  const [subdistrict, setSubdistrict] = useState('Sidomulyo');
  const [district, setDistrict] = useState('Lampung Selatan');
  const [province, setProvince] = useState('Lampung');
  const [history, setHistory] = useState('');
  const [vision, setVision] = useState('');
  const [missions, setMissions] = useState<string[]>(['']);
  const [phone, setPhone] = useState('081234567890');
  const [email, setEmail] = useState('desa.Suka Banjar@gmail.com');
  const [address, setAddress] = useState('Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing profile on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/village-profile');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.profile) {
            const p = json.data.profile;
            setName(p.name || 'Suka Banjar');
            setSubdistrict(p.subdistrict || 'Sidomulyo');
            setDistrict(p.district || 'Lampung Selatan');
            setProvince(p.province || 'Lampung');
            setHistory(p.history || '');
            setVision(p.vision || '');
            if (p.missions && p.missions.length > 0) setMissions(p.missions);
            setPhone(p.phone || '');
            setEmail(p.email || '');
            setAddress(p.address || '');
          }
        }
      } catch (err) {
        console.error('Error loading village profile:', err);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          subdistrict,
          district,
          province,
          history,
          vision,
          missions: missions.filter((m) => m.trim() !== ''),
          phone,
          email,
          address,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Data profil Desa Suka Banjar telah berhasil diperbarui.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal menyimpan profil desa.',
        });
      }
    } catch (err) {
      console.error('Save profile error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan sistem saat menyimpan data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMissionChange = (index: number, value: string) => {
    const updated = [...missions];
    updated[index] = value;
    setMissions(updated);
  };

  const addMissionRow = () => {
    setMissions([...missions, '']);
  };

  const removeMissionRow = (index: number) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
            <Building2 size={14} />
            <span>Pengaturan Identitas Desa</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Editor Profil Desa
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Ubah narasi sejarah, Visi, Misi, serta nomor telepon dan email Balai Desa.
          </p>
        </div>
      </div>

      {/* Alert Status */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">Nama Desa</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">Kecamatan</label>
            <input
              type="text"
              required
              value={subdistrict}
              onChange={(e) => setSubdistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">Kabupaten</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">Provinsi</label>
            <input
              type="text"
              required
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Sejarah Desa */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">Sejarah Pembentukan Desa</label>
          <textarea
            rows={4}
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Visi Desa */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">Visi Utama Desa</label>
          <textarea
            rows={2}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Misi List Array */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-800">Poin Misi Desa</label>
            <button
              type="button"
              onClick={addMissionRow}
              className="text-xs font-bold text-primary-600 hover:underline"
            >
              Tambah Poin Misi
            </button>
          </div>

          <div className="space-y-2">
            {missions.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={m}
                  onChange={(e) => handleMissionChange(idx, e.target.value)}
                  placeholder={`Misi ${idx + 1}`}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                {missions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMissionRow(idx)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    Hapus
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">No. Telepon / WhatsApp Desa</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">Email Resmi Desa</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">Alamat Kantor Balai Desa</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-primary-600/20 cursor-pointer disabled:bg-slate-300"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
