'use client';

import { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle,
  Eye,
  Trash2,
  Paperclip,
  X,
  AlertCircle,
  User,
  Calendar,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AspirationItem {
  id: string;
  senderName: string;
  isAnonymous: boolean;
  category: string;
  title: string;
  content: string;
  attachment?: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function AdminAspirasiPage() {
  const [aspirations, setAspirations] = useState<AspirationItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedItem, setSelectedItem] = useState<AspirationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data aspirasi dari API
  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/landing');
      if (res.ok) {
        const json = await res.json();
        // Alternatif fetch via direct custom API or store
      }
      // Direct client fetch list
      const listRes = await fetch('/api/aspirations');
      // If listRes endpoint exists or direct fetch from API
    } catch (err) {
      console.error('Error loading aspirations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulasi / direct list fetch
  useEffect(() => {
    async function fetchList() {
      try {
        setIsLoading(true);
        // Direct query or fetch
        const res = await fetch('/api/landing');
        if (res.ok) {
          const json = await res.json();
          // Data
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchList();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/aspirations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });

      if (res.ok) {
        setAspirations((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isRead: !currentStatus } : item
          )
        );
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem((prev) => (prev ? { ...prev, isRead: !currentStatus } : null));
        }
      }
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan aspirasi ini?')) return;

    try {
      const res = await fetch(`/api/admin/aspirations?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAspirations((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    } catch (err) {
      console.error('Error deleting aspiration:', err);
    }
  };

  const filteredItems = aspirations.filter((item) => {
    if (filterStatus === 'unread') return !item.isRead;
    if (filterStatus === 'read') return item.isRead;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
            <Inbox size={14} />
            <span>Inbox Laporan & Pengaduan Warga</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Moderasi Aspirasi Warga
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Kelola, baca, dan tandai pesan pengaduan yang dikirimkan warga Desa Sukabanjar.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-colors',
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Semua ({aspirations.length})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-colors',
              filterStatus === 'unread'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Belum Dibaca ({aspirations.filter((a) => !a.isRead).length})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-colors',
              filterStatus === 'read'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Sudah Dibaca ({aspirations.filter((a) => a.isRead).length})
          </button>
        </div>
      </div>

      {/* Table Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Inbox size={40} className="mx-auto text-slate-300" />
            <p className="text-slate-500 text-sm font-medium">
              Tidak ada pesan aspirasi pada kategori filter ini.
            </p>
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
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
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
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          Baru
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            if (!item.isRead) toggleReadStatus(item.id, false);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                          title="Baca Detail"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => toggleReadStatus(item.id, item.isRead)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                          title={item.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                        >
                          <CheckCircle size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Hapus Pesan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Pesan */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-3 border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
                {selectedItem.category}
              </span>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {selectedItem.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User size={13} />
                  {selectedItem.isAnonymous ? 'Anonim' : selectedItem.senderName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(selectedItem.createdAt).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Isi Pesan Aspirasi:</span>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {selectedItem.content}
              </p>
            </div>

            {selectedItem.attachment && (
              <div className="pt-2">
                <a
                  href={selectedItem.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-primary-600 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  <Paperclip size={14} />
                  Lihat Lampiran Foto Bukti
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Tutup Pesan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
