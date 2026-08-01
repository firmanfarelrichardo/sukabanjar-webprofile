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
  Instagram,
  Facebook,
  Youtube,
  Video,
  Twitter,
  ExternalLink,
  Edit3,
} from 'lucide-react';

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

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return Facebook;
    if (p.includes('instagram')) return Instagram;
    if (p.includes('tiktok')) return Video;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('twitter') || p.includes('x')) return Twitter;
    return Globe;
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Fitur Pengelolaan Identitas & Sosial Media Desa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            Menu 4. Edit Profil, Ikon & Sosial Media Desa
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Kelola gambar logo ikon desa (favicon & header), nomor telepon, email, serta URL 5 akun sosial media resmi desa.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs animate-bounce shadow">
            <Check size={16} />
            <span>Perubahan Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Row 1: Gambar Ikon Desa (Favicon & Website Logo) */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-primary-600" />
              <span>1. Gambar Ikon Desa (Tampil di Seluruh Website & Favicon Browser)</span>
            </label>
            <span className="text-xs text-slate-500 font-medium">Format: PNG, JPG, WebP</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Logo Preview Box */}
            <div className="w-24 h-24 rounded-3xl bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Ikon Desa" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl font-black text-primary-600 font-heading">S</span>
              )}
            </div>

            <div className="space-y-3 flex-1 w-full">
              <p className="text-xs text-slate-600 leading-relaxed">
                Gambar ikon ini akan ditampilkan pada Header, Footer, serta sebagai <strong>Favicon Tab Browser</strong> secara otomatis untuk seluruh pengunjung website.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer">
                  <Upload size={15} />
                  <span>{isUploading ? 'Mengunggah...' : 'Upload File Ikon Baru'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">atau</span>
                <input
                  type="text"
                  placeholder="Masukkan URL Gambar (https://...)"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none min-w-[200px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Kontak Resmi (Nomor Telepon & Email) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <Phone size={16} className="text-emerald-600" />
              <span>Nomor Telepon Desa</span>
            </label>
            <input
              type="text"
              placeholder="081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <Mail size={16} className="text-rose-600" />
              <span>Email Resmi Desa</span>
            </label>
            <input
              type="email"
              placeholder="desa.sukabanjar@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3: Pengelolaan 5 Sosial Media Standar (Fitur Edit URL) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <Globe size={18} className="text-amber-500" />
                <span>Pengelolaan URL Sosial Media Desa</span>
              </h3>
              <p className="text-xs text-slate-500">
                Masukkan atau edit URL akun sosial media resmi desa. Biarkan kosong jika desa belum menggunakan platform tersebut.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs">
              5 Platform Standar Sistem
            </span>
          </div>

          {/* 5 Fixed Social Media Cards with Edit URL Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialMedia.map((sm) => {
              const IconComponent = getPlatformIcon(sm.platform);
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
