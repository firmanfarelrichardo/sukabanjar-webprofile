'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Newspaper,
  ShoppingBag,
  MapPin,
  Camera,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  Edit3,
  ExternalLink,
  Plus,
  Home,
  BookOpen,
  Mail,
  CheckCircle2,
  Trash2,
  Paperclip,
  Clock,
  Database,
  Building2,
  Store,
  Check,
  Eye,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import AddUmkmModal from '@/components/admin/AddUmkmModal';
import EditUmkmModal from '@/components/admin/EditUmkmModal';
import AddGalleryModal from '@/components/admin/AddGalleryModal';
import AddArticleModal from '@/components/admin/AddArticleModal';
import AddFacilityModal from '@/components/admin/AddFacilityModal';
import EditVillageProfileModal from '@/components/admin/EditVillageProfileModal';
import AdminUmkmValidationModal from '@/components/sections/umkm/AdminUmkmValidationModal';
import AdminProfileEditTab from '@/components/admin/AdminProfileEditTab';
import AdminSipdeskelTab from '@/components/admin/AdminSipdeskelTab';

export default function AdminDashboardPage() {
  const { openInboxModal, setIsEditMode, setUnreadCount } = useAdmin();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'edit-website' | 'sipdeskel' | 'inbox' | 'profile'>('dashboard');

  const [stats, setStats] = useState({
    totalAspirations: 0,
    unreadAspirations: 0,
    totalArticles: 0,
    totalUmkm: 0,
    pendingUmkm: 0,
    totalGallery: 0,
    totalFacilities: 0,
    recentAspirations: [] as any[],
  });

  const [aspirationsList, setAspirationsList] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [facilitiesList, setFacilitiesList] = useState<any[]>([]);

  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread'>('all');
  const [selectedAspiration, setSelectedAspiration] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isAddUmkmOpen, setIsAddUmkmOpen] = useState(false);
  const [isEditUmkmOpen, setIsEditUmkmOpen] = useState(false);
  const [umkmToEdit, setUmkmToEdit] = useState<any | null>(null);

  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [galleryItemToEdit, setGalleryItemToEdit] = useState<any | null>(null);

  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<any | null>(null);

  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [facilityToEdit, setFacilityToEdit] = useState<any | null>(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUmkmValidationOpen, setIsUmkmValidationOpen] = useState(false);

  const fetchAspirations = async () => {
    try {
      const res = await fetch('/api/admin/aspirations');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAspirationsList(json.data);
          const unread = json.data.filter((a: any) => !a.isRead).length;
          setUnreadCount(unread);
          setStats((prev) => ({
            ...prev,
            totalAspirations: json.data.length,
            unreadAspirations: unread,
            recentAspirations: json.data.slice(0, 5),
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching aspirations:', err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setArticlesList(json.data);
          setStats((prev) => ({ ...prev, totalArticles: json.data.length }));
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setGalleryList(json.data);
          setStats((prev) => ({ ...prev, totalGallery: json.data.length }));
        }
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const fetchUmkm = async () => {
    try {
      const res = await fetch('/api/umkm?all=true');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUmkmList(json.data);
          const pendingCount = json.data.filter((u: any) => u.isApproved === false).length;
          setStats((prev) => ({
            ...prev,
            totalUmkm: json.data.length,
            pendingUmkm: pendingCount,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching UMKM list:', err);
    }
  };

  const fetchFacilities = async () => {
    try {
      const res = await fetch('/api/facilities');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFacilitiesList(json.data);
          setStats((prev) => ({ ...prev, totalFacilities: json.data.length }));
        }
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const [aspRes, artRes, umkmRes, galRes, facRes] = await Promise.all([
          fetch('/api/admin/aspirations'),
          fetch('/api/articles'),
          fetch('/api/umkm?all=true'),
          fetch('/api/gallery'),
          fetch('/api/facilities'),
        ]);

        let aspirations = [];
        let articles = [];
        let umkm = [];
        let gallery = [];
        let facilities = [];

        if (aspRes.ok) {
          const json = await aspRes.json();
          if (json.success && json.data) aspirations = json.data;
        }

        if (artRes.ok) {
          const json = await artRes.json();
          if (json.success && json.data) articles = json.data;
        }

        if (umkmRes.ok) {
          const json = await umkmRes.json();
          if (json.success && json.data) umkm = json.data;
        }

        if (galRes.ok) {
          const json = await galRes.json();
          if (json.success && json.data) gallery = json.data;
        }

        if (facRes.ok) {
          const json = await facRes.json();
          if (json.success && json.data) facilities = json.data;
        }

        setAspirationsList(aspirations);
        setArticlesList(articles);
        setUmkmList(umkm);
        setGalleryList(gallery);
        setFacilitiesList(facilities);

        const unreadAsp = aspirations.filter((a: any) => !a.isRead).length;
        setUnreadCount(unreadAsp);
        const pendingUmkmCount = umkm.filter((u: any) => u.isApproved === false).length;

        setStats({
          totalAspirations: aspirations.length,
          unreadAspirations: unreadAsp,
          totalArticles: articles.length,
          totalUmkm: umkm.length,
          pendingUmkm: pendingUmkmCount,
          totalGallery: gallery.length,
          totalFacilities: facilities.length,
          recentAspirations: aspirations.slice(0, 5),
        });
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [setUnreadCount]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/aspirations?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      if (res.ok) {
        fetchAspirations();
        if (selectedAspiration?.id === id) {
          setSelectedAspiration((prev: any) => (prev ? { ...prev, isRead: true } : null));
        }
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDeleteAspiration = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan aspirasi ini?')) return;
    try {
      const res = await fetch(`/api/admin/aspirations?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedAspiration?.id === id) setSelectedAspiration(null);
        fetchAspirations();
      }
    } catch (err) {
      console.error('Error deleting aspiration:', err);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel berita "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  const handleDeleteGallery = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus foto "${title}" dari galeri?`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGallery();
      }
    } catch (err) {
      console.error('Error deleting gallery photo:', err);
    }
  };

  const handleDeleteFacility = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lokasi fasilitas "${name}"?`)) return;
    try {
      const res = await fetch(`/api/facilities?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFacilities();
      }
    } catch (err) {
      console.error('Error deleting facility:', err);
    }
  };

  const handleDeleteUmkm = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk UMKM "${title}"?`)) return;
    try {
      const res = await fetch(`/api/umkm?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUmkm();
      }
    } catch (err) {
      console.error('Error deleting UMKM:', err);
    }
  };

  const filteredAspirations = aspirationsList.filter((item) => {
    if (inboxFilter === 'unread') return !item.isRead;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner & Navigation Tabs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Sistem Manajemen CMS Portal Desa Suka Banjar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Panel Pengelola Desa
            </h1>
            <p className="text-xs text-slate-500">
              Kelola berita, foto galeri, profil desa, produk UMKM warga, peta lokasi fasilitas, dan tanggapi aspirasi publik.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <ExternalLink size={14} />
              <span>Lihat Website Publik</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('edit-website')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'edit-website'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 size={16} />
            <span>Kelola Website</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#0086C9] text-white shadow-lg shadow-[#0086C9]/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={16} />
            <span>Profil</span>
          </button>

          <button
            onClick={() => setActiveTab('sipdeskel')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sipdeskel'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database size={16} />
            <span>Sinkronisasi SIPDeskel</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'inbox'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox size={16} />
            <span>Inbox Aspirasi</span>
            {stats.unreadAspirations > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {stats.unreadAspirations}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MENU 1: DASHBOARD STATISTIK RINGKASAN */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Card 1: Aspirasi Warga */}
            <div
              onClick={() => setActiveTab('inbox')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 cursor-pointer hover:border-rose-300 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Inbox size={22} />
                </div>
                {stats.unreadAspirations > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-extrabold">
                    {stats.unreadAspirations} Baru
                  </span>
                )}
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-heading block">
                  {stats.totalAspirations}
                </span>
                <span className="text-xs font-semibold text-slate-500">Pesan Aspirasi Warga</span>
              </div>
            </div>

            {/* Card 2: Artikel Berita */}
            <div
              onClick={() => setActiveTab('edit-website')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 cursor-pointer hover:border-indigo-300 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Newspaper size={22} />
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Terpublikasi
                </span>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-heading block">
                  {stats.totalArticles}
                </span>
                <span className="text-xs font-semibold text-slate-500">Berita & Pengumuman</span>
              </div>
            </div>

            {/* Card 3: Katalog UMKM */}
            <div
              onClick={() => setIsUmkmValidationOpen(true)}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 cursor-pointer hover:border-amber-300 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag size={22} />
                </div>
                {stats.pendingUmkm > 0 ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold animate-pulse">
                    {stats.pendingUmkm} Pending
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-heading block">
                  {stats.totalUmkm}
                </span>
                <span className="text-xs font-semibold text-slate-500">Produk UMKM Terdaftar</span>
              </div>
            </div>

            {/* Card 4: Galeri Foto */}
            <div
              onClick={() => setActiveTab('edit-website')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 cursor-pointer hover:border-teal-300 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Camera size={22} />
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  Foto Desa
                </span>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-heading block">
                  {stats.totalGallery}
                </span>
                <span className="text-xs font-semibold text-slate-500">Koleksi Foto Galeri</span>
              </div>
            </div>

            {/* Card 5: Peta Fasilitas */}
            <div
              onClick={() => setActiveTab('edit-website')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 cursor-pointer hover:border-sky-300 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <MapPin size={22} />
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                  Titik Peta
                </span>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-heading block">
                  {stats.totalFacilities}
                </span>
                <span className="text-xs font-semibold text-slate-500">Lokasi Fasilitas Desa</span>
              </div>
            </div>
          </div>

          {/* Table: Aspirasi Masuk Terbaru */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                  Aspirasi Publik Terbaru
                </h3>
                <p className="text-xs text-slate-500">5 pesan pengaduan warga terakhir yang masuk</p>
              </div>

              <button
                onClick={() => setActiveTab('inbox')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0086C9] hover:text-[#006ca3] transition-colors"
              >
                <span>Buka Inbox Moderasi ({stats.unreadAspirations} Baru)</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {stats.recentAspirations.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada pesan aspirasi masuk.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Pengirim</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Judul Pesan</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recentAspirations.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {item.isAnonymous ? 'Anonim' : item.senderName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 font-medium line-clamp-1">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {item.isRead ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Dibaca
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                              Baru
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MENU 2: EDIT & PENGELOLAAN ISI WEBSITE (BERITA, GALERI, UMKM & PETA) */}
      {activeTab === 'edit-website' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Guide Banner for Live Visual Editing */}
          <div className="rounded-3xl bg-gradient-to-br from-primary-900 via-primary-850 to-primary-950 text-white p-8 border-2 border-primary-400/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h2 className="text-2xl font-extrabold font-heading text-white">
                Edit Teks Langsung di Tampilan Asli Website
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Anda dapat mengubah teks Judul, Tagline, Visi, Misi, Kilas Balik Historis, dan Sejarah secara langsung pada posisi elemen di tampilan publik!
              </p>
            </div>
            <Link
              href="/"
              onClick={() => setIsEditMode(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl transition-transform hover:scale-105 shrink-0"
            >
              <ExternalLink size={18} />
              <span>Buka Tampilan Visual Website</span>
            </Link>
          </div>

          {/* SECTION 1: PENGELOLAAN ARTIKEL BERITA DENGAN PREVIEW GAMBAR */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                  <Newspaper size={20} className="text-indigo-600" />
                  <span>Pengelolaan Berita & Pengumuman Desa</span>
                </h3>
                <p className="text-xs text-slate-500">Edit isi berita, gambar sampul, atau terbitkan berita baru</p>
              </div>

              <button
                onClick={() => {
                  setArticleToEdit(null);
                  setIsAddArticleOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>Terbit Artikel Berita Baru</span>
              </button>
            </div>

            {articlesList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada artikel berita yang dibuat.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articlesList.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* PREVIEW GAMBAR BERITA (TAMPIL SEPERTI PADA GALERI) */}
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 relative">
                        <img
                          src={
                            art.imageUrl ||
                            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#0086C9] text-white shadow">
                          {art.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Penulis: {art.author || 'Tim Redaksi'}</span>
                        <span>
                          {new Date(art.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {art.content.replace(/[\#\*\_\`]/g, '')}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setArticleToEdit(art);
                          setIsAddArticleOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: PENGELOLAAN FOTO GALERI */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                  <Camera size={20} className="text-teal-600" />
                  <span>Pengelolaan Galeri Foto Desa</span>
                </h3>
                <p className="text-xs text-slate-500">Edit keterangan, judul, atau hapus foto galeri desa</p>
              </div>

              <button
                onClick={() => {
                  setGalleryItemToEdit(null);
                  setIsAddGalleryOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>Tambah Foto Galeri Baru</span>
              </button>
            </div>

            {galleryList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada foto galeri yang diunggah.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={item.imageUrl || item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.location || 'Desa'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setGalleryItemToEdit(item);
                          setIsAddGalleryOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id, item.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-[11px] border border-rose-200 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: PENGELOLAAN PRODUK UMKM WARGA (DENGAN TOMBOL EDIT & HAPUS) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                  <Store size={20} className="text-amber-600" />
                  <span>Pengelolaan Produk UMKM Warga</span>
                </h3>
                <p className="text-xs text-slate-500">Kelola katalog produk, edit rincian harga, foto, pemilik, dan validasi pendaftaran warga</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsUmkmValidationOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Validasi Pendaftaran ({stats.pendingUmkm} Pending)</span>
                </button>

                <button
                  onClick={() => {
                    setUmkmToEdit(null);
                    setIsAddUmkmOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Produk UMKM</span>
                </button>
              </div>
            </div>

            {umkmList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada produk UMKM terdaftar.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {umkmList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 relative">
                        <img
                          src={
                            item.imageUrl ||
                            (item.imageUrls && item.imageUrls.length > 0
                              ? item.imageUrls[0]
                              : 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80')
                          }
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white shadow ${
                            item.isApproved ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        >
                          {item.isApproved ? 'Disetujui' : 'Menunggu Validasi'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0086C9]">{item.price || 'Sesuai Pesanan'}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Pemilik: {item.ownerName || 'Warga'}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* FITUR EDIT & HAPUS UMKM */}
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setUmkmToEdit(item);
                          setIsEditUmkmOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUmkm(item.id, item.title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: PENGELOLAAN PETA & LOKASI FASILITAS DESA */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                  <MapPin size={20} className="text-[#0086C9]" />
                  <span>Pengelolaan Peta & Fasilitas Desa</span>
                </h3>
                <p className="text-xs text-slate-500">Tambah lokasi fasilitas baru, upload foto sampul (maks 1MB), dan edit koordinat peta Leaflet/OpenStreetMap</p>
              </div>

              <button
                onClick={() => {
                  setFacilityToEdit(null);
                  setIsAddFacilityOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0086C9] hover:bg-[#006ca3] text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>Tambah Lokasi Fasilitas Baru</span>
              </button>
            </div>

            {facilitiesList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada lokasi fasilitas desa yang ditambahkan.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilitiesList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* PREVIEW GAMBAR SAMPUL FASILITAS */}
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 relative">
                        <img
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#0086C9] text-white shadow">
                          {item.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.address || 'Desa Suka Banjar, Kec. Sidomulyo'}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          Koordinat: {item.latitude}, {item.longitude}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setFacilityToEdit(item);
                          setIsAddFacilityOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFacility(item.id, item.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MENU 3: PROFIL DESA, KONTAK & SOSMED */}
      {activeTab === 'profile' && <AdminProfileEditTab />}

      {/* MENU 4: SINKRONISASI & DEMOGRAFI SIPDESKEL */}
      {activeTab === 'sipdeskel' && <AdminSipdeskelTab />}

      {/* MENU 5: INBOX ASPIRASI & PENGADUAN WARGA */}
      {activeTab === 'inbox' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Filter Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                Inbox Moderasi Aspirasi Warga
              </h2>
              <p className="text-xs text-slate-500">
                Pesan masuk dari masyarakat yang dikirim melalui formulir pengaduan online
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInboxFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                  inboxFilter === 'all'
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Pesan ({aspirationsList.length})
              </button>
              <button
                onClick={() => setInboxFilter('unread')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                  inboxFilter === 'unread'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Belum Dibaca ({stats.unreadAspirations})
              </button>
            </div>
          </div>

          {/* Inbox Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-3">
              {filteredAspirations.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
                  Tidak ada pesan aspirasi warga yang ditemukan.
                </div>
              ) : (
                filteredAspirations.map((item) => {
                  const isSelected = selectedAspiration?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedAspiration(item);
                        if (!item.isRead) handleMarkAsRead(item.id);
                      }}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#0086C9]/10 border-[#0086C9] shadow-md ring-2 ring-[#0086C9]/20'
                          : item.isRead
                            ? 'bg-white border-slate-200/80 hover:border-slate-300'
                            : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {item.isAnonymous ? 'Anonim' : item.senderName}
                          </span>
                          {!item.isRead && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                              Baru
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {item.category}
                        </span>
                        {item.attachment && (
                          <span className="flex items-center gap-1 text-[#0086C9] font-bold">
                            <Paperclip size={12} /> Foto Bukti
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="lg:col-span-7">
              {selectedAspiration ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-5 gap-4">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0086C9]/10 text-[#0086C9]">
                        {selectedAspiration.category}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                        {selectedAspiration.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="font-semibold text-slate-800">
                          Pengirim: {selectedAspiration.isAnonymous ? 'Anonim' : selectedAspiration.senderName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {new Date(selectedAspiration.createdAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAspiration(selectedAspiration.id)}
                      className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
                      title="Hapus Pesan Ini"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      Isi Pesan / Aspirasi Warga:
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                      {selectedAspiration.content}
                    </p>
                  </div>

                  {selectedAspiration.attachment && (
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Lampiran Foto Bukti:
                      </h4>
                      <div className="w-full max-h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                        <img
                          src={selectedAspiration.attachment}
                          alt="Lampiran Bukti"
                          className="w-full h-full object-contain max-h-80"
                        />
                      </div>
                    </div>
                  )}

                  {!selectedAspiration.isRead && (
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleMarkAsRead(selectedAspiration.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-md"
                      >
                        <CheckCircle2 size={16} />
                        <span>Tandai Sudah Dibaca</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3">
                  <Mail size={40} className="mx-auto text-slate-300" />
                  <h4 className="text-base font-bold text-slate-800 font-heading">
                    Pilih Pesan Aspirasi di Sebelah Kiri
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Klik salah satu daftar pesan untuk membaca rincian lengkap aspirasi dan melihat lampiran foto bukti dari warga.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddUmkmModal
        isOpen={isAddUmkmOpen}
        onClose={() => {
          setIsAddUmkmOpen(false);
          setUmkmToEdit(null);
        }}
        onSuccess={fetchUmkm}
      />

      <EditUmkmModal
        isOpen={isEditUmkmOpen}
        product={umkmToEdit}
        onClose={() => {
          setIsEditUmkmOpen(false);
          setUmkmToEdit(null);
        }}
        onSuccess={fetchUmkm}
      />

      <AddGalleryModal
        isOpen={isAddGalleryOpen}
        itemToEdit={galleryItemToEdit}
        onClose={() => {
          setIsAddGalleryOpen(false);
          setGalleryItemToEdit(null);
        }}
        onSuccess={fetchGallery}
      />

      <AddArticleModal
        isOpen={isAddArticleOpen}
        articleToEdit={articleToEdit}
        onClose={() => {
          setIsAddArticleOpen(false);
          setArticleToEdit(null);
        }}
        onSuccess={fetchArticles}
      />

      <AddFacilityModal
        isOpen={isAddFacilityOpen}
        facilityToEdit={facilityToEdit}
        onClose={() => {
          setIsAddFacilityOpen(false);
          setFacilityToEdit(null);
        }}
        onSuccess={fetchFacilities}
      />

      <EditVillageProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <AdminUmkmValidationModal
        isOpen={isUmkmValidationOpen}
        onClose={() => setIsUmkmValidationOpen(false)}
      />
    </div>
  );
}
