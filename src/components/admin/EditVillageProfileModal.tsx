'use client';

import { useState, useEffect } from 'react';
import { useVillageProfile, SocialMediaItem, DEFAULT_5_SOCIAL_MEDIA } from '@/context/VillageProfileContext';
import { X, Upload, Check, ShieldCheck, Globe, Phone, Mail, Image as ImageIcon, Edit3, ExternalLink } from 'lucide-react';
import { getSocialPlatformIcon } from '@/components/ui/SocialIcons';

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

      // 1. Update local state & localStorage
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

      onClose();
    } catch (err) {
      console.error('Error updating village profile:', err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-slate-900">
                Edit Profil, Logo & Kontak Desa
              </h3>
              <p className="text-xs text-slate-500">
                Kelola favicon tab browser, logo header, telepon, email & 5 sosmed resmi.
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Logo Upload */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-heading">
              <ImageIcon size={16} className="text-amber-600" />
              <span>Ikon Logo Desa (Favicon & Header)</span>
            </label>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {logoUrl ? (
                  <img src={logoUrl} alt="Preview Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-slate-400 font-bold text-xl font-heading">S</span>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm">
                  <Upload size={14} />
                  <span>{isUploading ? 'Mengunggah...' : 'Pilih Gambar Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400">
                  Format JPG, PNG, atau WebP. Gambar ini menjadi Ikon Header & Favicon browser.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone size={13} className="text-amber-600" />
                <span>Nomor Telepon Desa:</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Mail size={13} className="text-amber-600" />
                <span>Alamat Email Desa:</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="desa.sukabanjar@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: 5 Sosial Media Standar System */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-heading">
                <Globe size={16} className="text-amber-600" />
                <span>Sosial Media Resmi Desa (Edit URL Akun)</span>
              </label>
              <span className="text-[10px] text-slate-500">Tampil di widget melayang sebelah kanan website</span>
            </div>

            {/* List 5 Social Media Cards */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {socialMedia.map((sm) => {
                const IconComponent = getSocialPlatformIcon(sm.platform);
                return (
                  <div
                    key={sm.platform}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                          <IconComponent size={14} />
                        </div>
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
                );
              })}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
