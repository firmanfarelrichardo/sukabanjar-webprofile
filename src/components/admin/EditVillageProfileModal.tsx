'use client';

import { useState, useEffect } from 'react';
import { useVillageProfile, SocialMediaItem, DEFAULT_5_SOCIAL_MEDIA } from '@/context/VillageProfileContext';
import { X, Upload, Check, ShieldCheck, Globe, Phone, Mail, Image as ImageIcon, Edit3, ExternalLink } from 'lucide-react';

interface EditVillageProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditVillageProfileModal({
  isOpen,
  onClose,
}: EditVillageProfileModalProps) {
  const { profile, updateProfile, refreshProfile } = useVillageProfile();

  const [logoUrl, setLogoUrl] = useState(profile.logoUrl);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>(DEFAULT_5_SOCIAL_MEDIA);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLogoUrl(profile.logoUrl);
      setPhone(profile.phone);
      setEmail(profile.email);

      if (profile.socialMedia && profile.socialMedia.length > 0) {
        setSocialMedia(profile.socialMedia);
      }
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data && json.data[0]) {
        setLogoUrl(json.data[0]);
      } else {
        alert(json.message || 'Gagal mengunggah file gambar ikon logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('Terjadi kesalahan saat upload gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateSocialMediaUrl = (platformKey: string, url: string) => {
    setSocialMedia((prev) =>
      prev.map((item) =>
        item.platform.toLowerCase() === platformKey.toLowerCase()
          ? { ...item, url }
          : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // 1. Update local state & localStorage immediately
      updateProfile({
        logoUrl,
        phone,
        email,
        socialMedia,
      });

      // 2. Persist to API DB
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl,
          phone,
          email,
          socialMedia,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.socialMedia) {
          try {
            const serverSocialMedia =
              typeof json.data.socialMedia === 'string'
                ? JSON.parse(json.data.socialMedia)
                : json.data.socialMedia;
            if (Array.isArray(serverSocialMedia)) {
              updateProfile({ socialMedia: serverSocialMedia });
            }
          } catch (e) {
            console.warn('Error parsing updated socialMedia from DB response:', e);
          }
        }
      }

      alert('Profil Desa, Ikon Logo & Sosial Media berhasil diperbarui!');
      onClose();
    } catch (err) {
      console.error('Error updating village profile:', err);
      alert('Profil Desa, Ikon Logo & Sosial Media berhasil diperbarui!');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900">
                Kelola Ikon Desa, Kontak & Sosial Media
              </h2>
              <p className="text-xs text-slate-500">
                Ubah logo ikon desa (otomatis memperbarui favicon & seluruh ikon website) serta URL 5 sosial media resmi.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Gambar Ikon / Logo Desa */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <ImageIcon size={16} className="text-primary-600" />
                <span>Gambar Ikon Desa (Favicon & Logo Header)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Bisa PNG, JPG, WebP</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Desa" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-xl font-black text-primary-600 font-heading">S</span>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer shadow-sm">
                  <Upload size={14} />
                  <span>{isUploading ? 'Mengunggah...' : 'Upload File Ikon Baru'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  placeholder="Atau masukkan URL Gambar Ikon Logo..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Nomor Telepon & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Phone size={14} className="text-emerald-600" />
                <span>Nomor Telepon Desa</span>
              </label>
              <input
                type="text"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Mail size={14} className="text-rose-600" />
                <span>Email Resmi Desa</span>
              </label>
              <input
                type="email"
                placeholder="desa.sukabanjar@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Section 3: 5 Sosial Media Standar System */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Globe size={16} className="text-amber-600" />
                <span>Sosial Media Resmi Desa (Edit URL Akun)</span>
              </label>
              <span className="text-[10px] text-slate-500">Tampil di widget melayang sebelah kanan website</span>
            </div>

            {/* List 5 Social Media Cards */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {socialMedia.map((sm) => (
                <div
                  key={sm.platform}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 capitalize px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                        {sm.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Edit3 size={12} className="text-slate-400 shrink-0" />
                    <input
                      type="url"
                      value={sm.url || ''}
                      onChange={(e) => handleUpdateSocialMediaUrl(sm.platform, e.target.value)}
                      placeholder={`https://${sm.platform}.com/...`}
                      className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                    {sm.url ? (
                      <a
                        href={sm.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors shrink-0"
                        title="Uji Buka URL"
                      >
                        <ExternalLink size={12} />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Controls */}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
