'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Save, Trash2, X, Loader2 } from 'lucide-react';

export default function ExitEditConfirmationModal() {
  const router = useRouter();
  const {
    isExitModalOpen,
    closeExitModal,
    liveTextChanges,
    clearLiveTextChanges,
    setIsEditMode,
    triggerRefresh,
  } = useAdmin();

  const [isLoading, setIsLoading] = useState(false);

  if (!isExitModalOpen) return null;

  const changeCount = Object.keys(liveTextChanges).length;

  const handleSaveAndExit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveTextChanges),
      });

      if (res.ok) {
        clearLiveTextChanges();
        setIsEditMode(false);
        closeExitModal();
        triggerRefresh();
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error('Error saving before exit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardAndExit = () => {
    clearLiveTextChanges();
    setIsEditMode(false);
    closeExitModal();
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border-4 border-amber-400">
        {/* Close Button */}
        <button
          onClick={closeExitModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        {/* Header Icon & Title */}
        <div className="space-y-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
            <AlertTriangle size={30} />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              Verifikasi Sebelum Keluar
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-slate-900">
              Simpan Perubahan Teks?
            </h3>
          </div>
        </div>

        {/* Notice Text */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="font-bold">
            Ada <span className="text-amber-700 underline">{changeCount} bagian teks</span> yang telah Anda ubah pada halaman ini!
          </p>
          <p className="text-slate-600">
            Apakah Anda ingin menyimpan perubahan tersebut terlebih dahulu sebelum kembali ke Dashboard Admin?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleSaveAndExit}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 cursor-pointer disabled:bg-slate-300"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Menyimpan & Memproses...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Simpan & Ke Dashboard</span>
              </>
            )}
          </button>

          <button
            onClick={handleDiscardAndExit}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Buang Perubahan & Ke Dashboard</span>
          </button>

          <button
            onClick={closeExitModal}
            className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold text-xs transition-colors"
          >
            Lanjutkan Pengeditan
          </button>
        </div>
      </div>
    </div>
  );
}
