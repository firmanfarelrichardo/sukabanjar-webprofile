'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { X, ShieldCheck, Check, Trash2, User, Phone, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PendingUmkm {
  id: string;
  title: string;
  ownerName: string;
  category?: string;
  description: string;
  price: string;
  whatsapp: string;
  imageUrls?: string[];
  isApproved: boolean;
  createdAt: string;
}

interface AdminUmkmValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminUmkmValidationModal({
  isOpen,
  onClose,
}: AdminUmkmValidationModalProps) {
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
    if (isAdmin && isOpen) {
      fetchPending();
    }
  }, [isAdmin, isOpen]);

  if (!isOpen || !isAdmin) return null;

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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border-4 border-amber-400">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
              Panel Validasi Admin
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-slate-900">
              Validasi Pengajuan UMKM Warga
            </h3>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-10 text-slate-400 text-xs animate-pulse">
            Memuat daftar pengajuan UMKM...
          </div>
        ) : pendingList.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <p className="text-sm font-bold text-slate-800">Semua Pengajuan Telah Divalidasi!</p>
            <p className="text-xs text-slate-400">
              Tidak ada pengajuan UMKM warga baru yang belum diproses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">
              Ada <span className="font-bold text-slate-900">{pendingList.length}</span> pengajuan usaha warga yang belum disetujui:
            </p>

            <div className="space-y-3">
              {pendingList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                        Menunggu Approval
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <User size={12} />
                        {item.ownerName}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900">
                      {item.title}
                    </h4>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Tag size={12} />
                        {item.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {item.whatsapp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Tolak</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Check size={16} />
                      <span>Setujui & Tampilkan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
