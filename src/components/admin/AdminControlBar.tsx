'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, Inbox, Edit3, LogOut, LayoutDashboard, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddUmkmModal from '@/components/admin/AddUmkmModal';
import AddTourismModal from '@/components/admin/AddTourismModal';
import AddArticleModal from '@/components/admin/AddArticleModal';

export default function AdminControlBar() {
  const pathname = usePathname();
  const {
    isAdmin,
    setIsAdmin,
    isEditMode,
    setIsEditMode,
    openInboxModal,
    unreadCount,
    liveTextChanges,
    openExitModal,
  } = useAdmin();

  const router = useRouter();

  const [isAddUmkmOpen, setIsAddUmkmOpen] = useState(false);
  const [isAddTourismOpen, setIsAddTourismOpen] = useState(false);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

  if (!isAdmin) return null;

  const isAdminDashboardRoute = pathname?.startsWith('/admin');

  const handleExitToDashboard = () => {
    const hasUnsavedChanges = Object.keys(liveTextChanges).length > 0;
    if (hasUnsavedChanges) {
      openExitModal();
    } else {
      setIsEditMode(false);
      router.push('/admin');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdmin(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Clean minimal header for /admin routes
  if (isAdminDashboardRoute) {
    return (
      <div className="bg-slate-950 text-white text-xs py-3 px-6 sticky top-0 z-50 border-b border-slate-800 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold font-heading text-amber-400 tracking-wide text-xs sm:text-sm">
              🛡️ MODE KELOLA ADMIN — DESA SUKABANJAR
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold transition-colors cursor-pointer text-xs"
            title="Keluar dari sesi admin"
          >
            <LogOut size={14} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </div>
    );
  }

  // Full quick-edit control bar for public pages when Admin is logged in
  return (
    <>
      <div className="bg-slate-950 text-white text-xs py-2.5 px-4 sticky top-0 z-50 border-b border-amber-500/30 shadow-xl backdrop-blur-md">
        <div className="container-section flex flex-wrap items-center justify-between gap-3">
          {/* Left: Status Badge & Dashboard Link */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <button
              onClick={handleExitToDashboard}
              className="flex items-center gap-1.5 font-bold font-heading text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ShieldCheck size={16} />
              <span>MODE KELOLA ADMIN</span>
            </button>
            <button
              onClick={handleExitToDashboard}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg transition-colors"
            >
              <LayoutDashboard size={12} />
              <span>Dashboard Admin</span>
            </button>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Exit Edit Mode & Redirect to Dashboard */}
            {isEditMode && (
              <button
                onClick={handleExitToDashboard}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold transition-all hover:bg-amber-300 shadow-md cursor-pointer"
                title="Keluar dari mode edit visual dan kembali ke Dashboard Admin"
              >
                <LayoutDashboard size={14} />
                <span>🚪 Keluar Edit & Ke Dashboard</span>
              </button>
            )}

            {/* Quick Add Buttons */}
            <button
              onClick={() => setIsAddUmkmOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>UMKM</span>
            </button>

            <button
              onClick={() => setIsAddTourismOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Wisata</span>
            </button>

            <button
              onClick={() => setIsAddArticleOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-semibold transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Berita</span>
            </button>

            {/* Inbox Aspirasi Button */}
            <button
              onClick={openInboxModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-md cursor-pointer"
            >
              <Inbox size={14} />
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Toggle Edit Mode */}
            <button
              onClick={handleExitToDashboard}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer',
                isEditMode
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              )}
            >
              <Edit3 size={14} />
              <span>{isEditMode ? 'Mode Edit: ON ✏️' : 'Mode Edit: OFF'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold transition-colors cursor-pointer"
              title="Keluar dari mode admin"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Manual Add Modals */}
      <AddUmkmModal isOpen={isAddUmkmOpen} onClose={() => setIsAddUmkmOpen(false)} />
      <AddTourismModal isOpen={isAddTourismOpen} onClose={() => setIsAddTourismOpen(false)} />
      <AddArticleModal isOpen={isAddArticleOpen} onClose={() => setIsAddArticleOpen(false)} />
    </>
  );
}
