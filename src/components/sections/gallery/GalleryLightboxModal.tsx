'use client';

import { useAdmin } from '@/context/AdminContext';
import { X, MapPin, Tag, Calendar, Trash2, ExternalLink, Edit3 } from 'lucide-react';
import { MasonryItem } from '@/components/ui/Masonry';

interface GalleryLightboxModalProps {
  item: MasonryItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: MasonryItem) => void;
}

export default function GalleryLightboxModal({
  item,
  onClose,
  onDelete,
  onEdit,
}: GalleryLightboxModalProps) {
  const { isAdmin } = useAdmin();

  if (!item) return null;

  const handleDelete = () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus foto "${item.title}" dari galeri?`)) return;
    if (onDelete) onDelete(item.id);
    onClose();
  };

  const handleEdit = () => {
    if (onEdit) onEdit(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
          title="Tutup Modal"
        >
          <X size={20} />
        </button>

        {/* Left Column: High-Res Image Display */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[480px]">
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-contain max-h-[70vh] md:max-h-[85vh]"
          />
        </div>

        {/* Right Column: Information & Admin Controls */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-slate-900 text-white">
          <div className="space-y-4">
            {/* Category Tag */}
            {item.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                <Tag size={12} />
                {item.category}
              </span>
            )}

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white leading-snug">
              {item.title}
            </h2>

            {/* Location & Date metadata */}
            <div className="space-y-1.5 text-xs text-slate-300">
              {item.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-amber-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.createdAt && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} className="shrink-0" />
                  <span>
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <a
              href={item.img}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              <ExternalLink size={14} />
              <span>Buka Resolusi Penuh</span>
            </a>

            {isAdmin && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleEdit}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Edit Foto</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Hapus Foto</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
