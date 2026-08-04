'use client';

import { useAdmin } from '@/context/AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminControlBar() {
  const pathname = usePathname();
  const { isAdmin, setIsAdmin, setIsEditMode } = useAdmin();
  const router = useRouter();

  if (!isAdmin) return null;

  const isAdminDashboardRoute = pathname?.startsWith('/admin');

  // Completely remove top control bar on public pages to keep header 100% clean
  if (!isAdminDashboardRoute) return null;

  // Clean minimal header ONLY inside /admin dashboard pages
  return (
    <div className="bg-gradient-to-r from-[#001929] via-[#005480] to-[#0086C9] text-white text-xs py-3 px-6 sticky top-0 z-50 border-b border-white/15 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold font-heading text-amber-300 tracking-wide text-xs sm:text-sm drop-shadow-sm">
            MODE KELOLA ADMIN — DESA Suka Banjar
          </span>
        </div>

        <button
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
              setIsAdmin(false);
              setIsEditMode(false);
              router.push('/admin/login');
              router.refresh();
            } catch (err) {
              console.error('Logout error:', err);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold transition-colors cursor-pointer text-xs border border-white/20 shadow-sm"
          title="Keluar dari sesi admin"
        >
          <LogOut size={14} className="text-amber-300" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </div>
  );
}
