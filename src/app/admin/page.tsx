'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Newspaper,
  ShoppingBag,
  MapPin,
  Palmtree,
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
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import AddUmkmModal from '@/components/admin/AddUmkmModal';
import AddTourismModal from '@/components/admin/AddTourismModal';
import AddArticleModal from '@/components/admin/AddArticleModal';
import AdminUmkmValidationModal from '@/components/sections/umkm/AdminUmkmValidationModal';

export default function AdminDashboardPage() {
  const { openInboxModal, setIsEditMode, setUnreadCount } = useAdmin();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'edit-website' | 'inbox'>('dashboard');

  const [stats, setStats] = useState({
    totalAspirations: 0,
    unreadAspirations: 0,
    totalArticles: 0,
    totalUmkm: 0,
    pendingUmkm: 0,
    totalTourism: 3,
    totalFacilities: 6,
    recentAspirations: [] as any[],
  });

  const [aspirationsList, setAspirationsList] = useState<any[]>([]);
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread'>('all');
  const [selectedAspiration, setSelectedAspiration] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAddUmkmOpen, setIsAddUmkmOpen] = useState(false);
  const [isAddTourismOpen, setIsAddTourismOpen] = useState(false);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
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

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const [aspRes, artRes, umkmRes, tourRes] = await Promise.all([
          fetch('/api/admin/aspirations'),
          fetch('/api/articles'),
          fetch('/api/umkm?all=true'),
          fetch('/api/tourism'),
        ]);

        let aspirations = [];
        let articles = [];
        let umkm = [];
        let tourism = [];

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

        if (tourRes.ok) {
          const json = await tourRes.json();
          if (json.success && json.data) tourism = json.data;
        }

        setAspirationsList(aspirations);
        const unreadAsp = aspirations.filter((a: any) => !a.isRead).length;
        setUnreadCount(unreadAsp);
        const pendingUmkmCount = umkm.filter((u: any) => u.isApproved === false).length;

        setStats({
          totalAspirations: aspirations.length,
          unreadAspirations: unreadAsp,
          totalArticles: articles.length,
          totalUmkm: umkm.length,
          pendingUmkm: pendingUmkmCount,
          totalTourism: tourism.length,
          totalFacilities: 6,
          recentAspirations: aspirations.slice(0, 5),
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

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

  const filteredAspirations = aspirationsList.filter((item) => {
    if (inboxFilter === 'unread') return !item.isRead;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner & Three Navigation Tabs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Sistem Manajemen CMS Portal Desa Sukabanjar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Panel Pengelola Desa
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Kelola laporan pengaduan warga, publikasi informasi, dan pengeditan teks website desa.
            </p>
          </div>

          <Link
            href="/"
            onClick={() => setIsEditMode(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Edit3 size={16} />
            <span>⚡ Buka Mode Edit Visual Website</span>
          </Link>
        </div>

        {/* 3 MAIN NAVIGATION MENUS (Dashboard, Edit Website, Inbox Aspirasi) */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-3.5 font-extrabold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-primary-600 text-primary-700 bg-primary-50/50 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>1. Dashboard Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('edit-website')}
            className={`flex items-center gap-2 px-5 py-3.5 font-extrabold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'edit-website'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 size={18} className="text-amber-600" />
            <span>2. Edit & Pengelolaan Isi Website</span>
            {stats.pendingUmkm > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold">
                {stats.pendingUmkm} UMKM
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-5 py-3.5 font-extrabold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'border-rose-500 text-rose-800 bg-rose-50/50 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox size={18} className="text-rose-600" />
            <span>3. Inbox Aspirasi & Pengaduan Warga</span>
            {stats.unreadAspirations > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                {stats.unreadAspirations} Baru
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-semibold">
                {stats.totalAspirations}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MENU 1: DASHBOARD RINGKASAN */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={() => setActiveTab('inbox')}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-300 transition-all space-y-4 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-md">
                  <Inbox size={22} />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                  {stats.unreadAspirations} Belum Dibaca
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-900 font-heading block">
                  {stats.totalAspirations}
                </span>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-primary-600 transition-colors">
                  Inbox Aspirasi Warga
                </span>
              </div>
            </div>

            <Link
              href="/umkm"
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                  <ShoppingBag size={22} />
                </div>
                {stats.pendingUmkm > 0 ? (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    {stats.pendingUmkm} Pengajuan Warga
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    Aktif
                  </span>
                )}
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-900 font-heading block">
                  {stats.totalUmkm}
                </span>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-amber-600 transition-colors">
                  Katalog UMKM Desa
                </span>
              </div>
            </Link>

            <Link
              href="/wisata"
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
                  <Palmtree size={22} />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Destinasi Alam
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-900 font-heading block">
                  {stats.totalTourism}
                </span>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-teal-600 transition-colors">
                  Destinasi Wisata
                </span>
              </div>
            </Link>

            <Link
              href="/berita"
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
                  <Newspaper size={22} />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Pengumuman
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-900 font-heading block">
                  {stats.totalArticles}
                </span>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  Artikel Berita
                </span>
              </div>
            </Link>
          </div>

          {/* Recent Aspirations Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900">
                  Laporan Pengaduan & Aspirasi Warga Terbaru
                </h2>
                <p className="text-xs text-slate-500">
                  Pesan masuk dari masyarakat yang dikirim melalui portal digital
                </p>
              </div>
              <button
                onClick={() => setActiveTab('inbox')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <span>Buka Menu Inbox Moderasi</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {stats.recentAspirations.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Belum ada pesan aspirasi yang masuk.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Pengirim</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Judul Laporan</th>
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

      {/* MENU 2: EDIT & PENGELOLAAN ISI WEBSITE */}
      {activeTab === 'edit-website' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Guide Banner for Live Visual Editing */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950 text-white p-8 border-2 border-amber-400/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                Fitur Unggulan: Live Visual In-Place Editor
              </span>
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

          {/* Quick Management Cards per Page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Halaman Beranda / Landing */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Home size={20} />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Halaman Beranda (Landing Page)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kelola nama desa, tagline header, teks Visi Utama di banner, dan tombol Akses Cepat.
                </p>
              </div>
              <Link
                href="/"
                onClick={() => setIsEditMode(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                <Edit3 size={14} />
                Edit Beranda (Visual Live)
              </Link>
            </div>

            {/* Card 2: Halaman Profil & Sejarah */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Halaman Profil & Sejarah Desa
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Edit narasi Sejarah Desa, kartu Kilas Balik Historis ("Warisan Nilai"), serta daftar Visi & Misi Desa.
                </p>
              </div>
              <Link
                href="/profil"
                onClick={() => setIsEditMode(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                <Edit3 size={14} />
                Edit Profil Desa (Visual Live)
              </Link>
            </div>

            {/* Card 3: Katalog UMKM Desa */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Katalog UMKM Desa
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Validasi pengajuan UMKM warga, tambah produk usaha baru, atau edit detail UMKM yang terdaftar.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setIsUmkmValidationOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <span>Validasi Pengajuan Warga ({stats.pendingUmkm})</span>
                </button>
                <button
                  onClick={() => setIsAddUmkmOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>+ Tambah Produk UMKM</span>
                </button>
              </div>
            </div>

            {/* Card 4: Destinasi Wisata Desa */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <Palmtree size={20} />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Destinasi Wisata Desa
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tambah spot tempat wisata baru, saung kumpul sawah, atau lokasi pemandangan alam desa.
                </p>
              </div>
              <button
                onClick={() => setIsAddTourismOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Tambah Tempat Wisata</span>
              </button>
            </div>

            {/* Card 5: Artikel Berita & Pengumuman */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Newspaper size={20} />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Berita & Pengumuman Desa
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Terbitkan berita kegiatan desa, pengumuman gotong royong, atau laporan KKN mahasiswa.
                </p>
              </div>
              <button
                onClick={() => setIsAddArticleOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Terbit Artikel Berita Baru</span>
              </button>
            </div>

            {/* Card 6: Peta Fasilitas Desa */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Peta Fasilitas Publik
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kelola koordinat lokasi balai desa, sekolah, puskesmas, dan tempat ibadah di peta interaktif.
                </p>
              </div>
              <Link
                href="/peta"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                <ExternalLink size={14} />
                Buka Peta Interaktif
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MENU 3: INBOX ASPIRASI & PENGADUAN WARGA */}
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

          {/* Inbox Split View (Left List, Right Selected Message Detail) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Messages List */}
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
                          ? 'bg-primary-50/80 border-primary-500 shadow-md ring-2 ring-primary-500/20'
                          : item.isRead
                            ? 'bg-white border-slate-200/80 hover:border-slate-300'
                            : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {item.isAnonymous ? '👤 Anonim' : item.senderName}
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
                          <span className="flex items-center gap-1 text-primary-600 font-bold">
                            <Paperclip size={12} /> Foto Bukti
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Message Detail */}
            <div className="lg:col-span-7">
              {selectedAspiration ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-5 gap-4">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
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
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors shrink-0 cursor-pointer"
                      title="Hapus pesan aspirasi"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      Isi Laporan / Pesan Aspirasi Warga:
                    </h4>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedAspiration.content}
                    </div>
                  </div>

                  {/* Attachment if present */}
                  {selectedAspiration.attachment && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Foto Bukti Laporan:
                      </h4>
                      <a
                        href={selectedAspiration.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-700 font-bold text-xs border border-primary-200 hover:bg-primary-100 transition-colors"
                      >
                        <Paperclip size={14} />
                        <span>Lihat Lampiran Foto Bukti Laporan Full-Size</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}

                  {/* Bottom Controls */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Status: {selectedAspiration.isRead ? '✅ Telah Dibaca' : '🔴 Belum Dibaca'}
                    </span>
                    {!selectedAspiration.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(selectedAspiration.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        <span>Tandai Sudah Dibaca</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                  <Mail size={40} className="text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-700 text-base">
                    Pilih Pesan Aspirasi di Sebelah Kiri
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Klik salah satu pesan di sebelah kiri untuk membaca detail laporan dan melihat foto bukti lampiran dari warga.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddUmkmModal isOpen={isAddUmkmOpen} onClose={() => setIsAddUmkmOpen(false)} />
      <AddTourismModal isOpen={isAddTourismOpen} onClose={() => setIsAddTourismOpen(false)} />
      <AddArticleModal isOpen={isAddArticleOpen} onClose={() => setIsAddArticleOpen(false)} />
      <AdminUmkmValidationModal
        isOpen={isUmkmValidationOpen}
        onClose={() => setIsUmkmValidationOpen(false)}
      />
    </div>
  );
}
