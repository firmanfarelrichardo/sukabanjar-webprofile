'use client';

import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { Edit3, CheckCircle2 } from 'lucide-react';

export default function AdminGlobalEditButton() {
  const router = useRouter();
  const {
    isAdmin,
    isEditMode,
    setIsEditMode,
    liveTextChanges,
    openExitModal,
  } = useAdmin();

  if (!isAdmin) return null;

  const handleToggleOrExit = () => {
    if (isEditMode) {
      const hasUnsavedChanges = Object.keys(liveTextChanges).length > 0;
      if (hasUnsavedChanges) {
        openExitModal();
      } else {
        setIsEditMode(false);
        router.push('/admin');
      }
    } else {
      setIsEditMode(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleToggleOrExit}
        className={`inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full font-extrabold text-xs sm:text-sm shadow-2xl border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
          isEditMode
            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/30'
            : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30'
        }`}
        title={
          isEditMode
            ? 'Klik untuk keluar dari mode edit dan kembali ke Dashboard Admin'
            : 'Klik untuk mengaktifkan mode edit teks langsung di halaman ini'
        }
      >
        {isEditMode ? (
          <>
            <CheckCircle2 size={18} className="text-slate-950 stroke-[2.5]" />
            <span>⚡ Mode Edit: ON (Klik utk Selesai)</span>
          </>
        ) : (
          <>
            <Edit3 size={18} className="text-slate-950 stroke-[2.5]" />
            <span>Edit Konten Website</span>
          </>
        )}
      </button>
    </div>
  );
}
