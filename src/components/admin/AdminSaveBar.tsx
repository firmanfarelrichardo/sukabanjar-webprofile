'use client';

import { useAdmin } from '@/context/AdminContext';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSaveBar() {
  const router = useRouter();
  const { isAdmin, isEditMode, liveTextChanges, clearLiveTextChanges, triggerRefresh } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasChanges = Object.keys(liveTextChanges).length > 0;

  if (!isAdmin || !isEditMode || !hasChanges) return null;

  const handleSaveLiveText = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveTextChanges),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: 'Perubahan teks live berhasil disimpan ke database!',
        });
        clearLiveTextChanges();
        triggerRefresh();
        router.refresh();
        setTimeout(() => {
          setStatusMessage(null);
        }, 2500);
      } else {
        setStatusMessage({
          type: 'error',
          text: json.message || 'Gagal menyimpan perubahan teks.',
        });
      }
    } catch (err) {
      console.error('Error saving live text changes:', err);
      setStatusMessage({
        type: 'error',
        text: 'Terjadi kesalahan jaringan saat menyimpan teks.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-950/95 text-white px-6 py-3.5 rounded-full border-2 border-emerald-500 shadow-2xl backdrop-blur-md flex items-center gap-4">
        {statusMessage ? (
          <div className="flex items-center gap-2 text-xs font-semibold">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">
                Teks Diubah ({Object.keys(liveTextChanges).length} Bagian)
              </span>
            </div>

            <button
              onClick={handleSaveLiveText}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:bg-slate-700"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>💾 Simpan Semua Perubahan Teks</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
