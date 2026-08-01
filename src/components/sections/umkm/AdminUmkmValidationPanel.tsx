'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { ShieldCheck, Check, Trash2, User, Phone, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PendingUmkm {
  id: string;
  title: string;
  ownerName: string;
  description: string;
  price: string;
  whatsapp: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminUmkmValidationPanel() {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [pendingList, setPendingList] = useState<PendingUmkm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/umkm?all=true');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const unapproved = json.data.filter((item: PendingUmkm) => item.isApproved === false);
          setPendingList(unapproved);
        }
      }
    } catch (err) {
      console.error('Error loading pending UMKM:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPending();
    }
  }, [isAdmin]);

  if (!isAdmin || pendingList.length === 0) return null;

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/umkm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: true }),
      });

      if (res.ok) {
        setPendingList((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tolak dan hapus pengajuan UMKM ini?')) return;

    try {
      const res = await fetch(`/api/umkm?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPendingList((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-amber-950 text-white p-6 sm:p-8 border-2 border-amber-400 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-amber-400/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              Validasi Pengajuan UMKM Warga
            </h3>
            <p className="text-xs text-amber-300 font-medium">
              Ada {pendingList.length} pengajuan usaha baru yang memerlukan persetujuan Admin Desa
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-3 backdrop-blur-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                  Pengajuan Baru
                </span>
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <User size={12} />
                  {item.ownerName}
                </span>
              </div>

              <h4 className="font-heading font-bold text-base text-white">
                {item.title}
              </h4>

              <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  {item.price}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {item.whatsapp}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 size={14} />
                <span>Tolak</span>
              </button>
              <button
                onClick={() => handleApprove(item.id)}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
              >
                <Check size={16} />
                <span>Setujui & Tampilkan</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
