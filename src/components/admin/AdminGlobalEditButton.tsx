'use client';

import { useAdmin } from '@/context/AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function AdminGlobalEditButton() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isAdmin,
    isEditMode,
    setIsEditMode,
    liveTextChanges,
    openExitModal,
  } = useAdmin();

  // Hide on /admin routes entirely; only show on public pages when edit mode is ON
  if (!isAdmin) return null;
  if (pathname?.startsWith('/admin')) return null;
  if (!isEditMode) return null;

  const handleExit = () => {
    const hasUnsavedChanges = Object.keys(liveTextChanges).length > 0;
    if (hasUnsavedChanges) {
      openExitModal();
    } else {
      setIsEditMode(false);
      router.push('/admin');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleExit}
        className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full font-extrabold text-xs sm:text-sm shadow-2xl border-2 transition-all duration-200 hover:scale-105 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/30"
        title="Klik untuk keluar dari mode edit dan kembali ke Dashboard Admin"
      >
        <CheckCircle2 size={18} className="text-slate-950 stroke-[2.5]" />
        <span>⚡ Keluar Edit &amp; Ke Dashboard</span>
      </button>
    </div>
  );
}

