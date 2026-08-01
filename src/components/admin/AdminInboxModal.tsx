'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Inbox, X, Eye, CheckCircle, Trash2, User, Calendar, Paperclip } from 'lucide-react';

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

export default function AdminInboxModal() {
  const { isInboxOpen, closeInboxModal, setUnreadCount } = useAdmin();
  const [aspirations, setAspirations] = useState<AspirationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AspirationItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInboxOpen) {
      loadAspirations();
    }
  }, [isInboxOpen]);

  const loadAspirations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/landing');
      // Set count
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/aspirations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });

      if (res.ok) {
        setAspirations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isRead: !currentStatus } : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem((prev) => (prev ? { ...prev, isRead: !currentStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

    try {
      const res = await fetch(`/api/admin/aspirations?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAspirations((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isInboxOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              <Inbox size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-heading text-slate-900">
                Inbox Aspirasi Warga
              </h2>
              <p className="text-xs text-slate-500">
                Laporan & masukan yang dikirim langsung warga Desa Suka Banjar
              </p>
            </div>
          </div>

          <button
            onClick={closeInboxModal}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {aspirations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada pesan aspirasi warga yang masuk.
            </div>
          ) : (
            <div className="space-y-3">
              {aspirations.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    item.isRead
                      ? 'bg-slate-50 border-slate-200/80 text-slate-700'
                      : 'bg-primary-50/50 border-primary-200 text-slate-900 font-semibold'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                        {item.category}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {item.isAnonymous ? 'Anonim' : item.senderName}
                      </span>
                      <span className="text-slate-400">
                        • {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-slate-500 text-xs line-clamp-1">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        if (!item.isRead) toggleReadStatus(item.id, false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-primary-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>Baca</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Pesan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={closeInboxModal}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
          >
            Tutup Inbox
          </button>
        </div>
      </div>

      {/* Selected Item View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <span className="px-2.5 py-1 rounded text-xs font-bold bg-primary-100 text-primary-700 inline-block">
              {selectedItem.category}
            </span>

            <h3 className="text-xl font-bold font-heading text-slate-900">
              {selectedItem.title}
            </h3>

            <div className="text-xs text-slate-500 flex items-center gap-3">
              <span>Pengirim: {selectedItem.isAnonymous ? 'Anonim' : selectedItem.senderName}</span>
              <span>• {new Date(selectedItem.createdAt).toLocaleString('id-ID')}</span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap">
              {selectedItem.content}
            </p>

            {selectedItem.attachment && (
              <a
                href={selectedItem.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:underline"
              >
                <Paperclip size={14} />
                Lihat Lampiran Foto Bukti
              </a>
            )}

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
