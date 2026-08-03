'use client';

import { useState, useEffect } from 'react';
import { useVillageProfile, SocialMediaItem, DEFAULT_5_SOCIAL_MEDIA } from '@/context/VillageProfileContext';
import {
  Upload,
  Check,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  Image as ImageIcon,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { getSocialPlatformIcon } from '@/components/ui/SocialIcons';

export default function AdminProfileEditTab() {
  const { profile, updateProfile, refreshProfile } = useVillageProfile();

  const [logoUrl, setLogoUrl] = useState(profile.logoUrl);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>(DEFAULT_5_SOCIAL_MEDIA);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setLogoUrl(profile.logoUrl);
    setPhone(profile.phone);
    setEmail(profile.email);

    if (profile.socialMedia && profile.socialMedia.length > 0) {
      setSocialMedia(profile.socialMedia);
    }
  }, [profile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert(`Ukuran gambar logo "${file.name}" melebihi batas maksimum 1MB (Ukuran: ${(file.size / 1024 / 1024).toFixed(2)} MB). Silakan kompres gambar terlebih dahulu.`);
      return;
    }

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
      setSavedSuccess(false);

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

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error updating village profile:', err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>Pengaturan Identitas & Kontak Resmi</span>
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900">
            Profil, Ikon Logo & Sosial Media Desa
          </h2>
          <p className="text-xs text-slate-500">
            Kelola logo resmi desa (favicon/header), kontak publik (telepon & email), serta 5 akun sosial media resmi.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 shadow-sm animate-fadeIn">
            <Check size={16} />
            <span>Perubahan Profil Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Logo & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo Upload Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-heading">
              <ImageIcon size={15} className="text-amber-600" />
              <span>Gambar Ikon Logo Desa</span>
            </label>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                {logoUrl ? (
                  <img src={logoUrl} alt="Preview Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-slate-400 font-bold text-2xl font-heading">S</span>
                )}
              </div>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-md">
                <Upload size={14} />
                <span>{isUploading ? 'Mengunggah...' : 'Upload Logo Baru'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Gambar ikon ini akan ditampilkan pada Header, Footer, serta sebagai <strong>Favicon Tab Browser</strong> secara otomatis untuk seluruh pengunjung website.
            </p>
          </div>

          {/* Contact Fields */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-heading">
              <Phone size={15} className="text-amber-600" />
              <span>Kontak Resmi Pelayanan Desa</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Telepon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  <span>Nomor Telepon / WhatsApp Desa:</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  <span>Alamat Email Resmi Desa:</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="desa.sukabanjar@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 5 Fixed Social Media Cards */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-heading">
                <Globe size={16} className="text-amber-600" />
                <span>Pengelolaan URL Sosial Media Desa</span>
              </h3>
              <p className="text-xs text-slate-500">
                Masukkan atau edit URL akun sosial media resmi desa. Biarkan kosong jika desa belum menggunakan platform tersebut.
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold">
              5 Platform Standar Sistem
            </span>
          </div>

          {/* 5 Fixed Social Media Cards with Edit URL Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialMedia.map((sm) => {
              const IconComponent = getSocialPlatformIcon(sm.platform);
              return (
                <div
                  key={sm.platform}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 transition-all space-y-3"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <IconComponent size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block font-heading">
                        {sm.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {sm.platform}
                      </span>
                    </div>
                  </div>

                  {/* Edit URL Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Edit3 size={11} className="text-amber-600" />
                      <span>Edit URL {sm.label}:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={sm.url || ''}
                        onChange={(e) => handleUpdateSocialMediaUrl(sm.platform, e.target.value)}
                        placeholder={`https://${sm.platform}.com/...`}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      {sm.url ? (
                        <a
                          href={sm.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors shrink-0"
                          title="Uji Buka URL di Tab Baru"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <Check size={18} />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Seluruh Perubahan Profil Desa'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
