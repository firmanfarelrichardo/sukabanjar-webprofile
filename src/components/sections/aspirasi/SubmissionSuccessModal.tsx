'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionSuccessModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Icon Checkmark Animated */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                <CheckCircle2 size={36} />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Aspirasi Berhasil Terkirim!
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Terima kasih atas partisipasi Anda. Pesan aspirasi/pengaduan Anda telah langsung diterima oleh tim Balai Desa Sukabanjar.
                </p>
              </div>

              {/* Info Note */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left">
                <span className="font-semibold block text-slate-800 mb-0.5">Catatan Penting:</span>
                Setiap masukan warga akan ditinjau secara berkala oleh perangkat desa demi perbaikan pelayanan dan pembangunan Desa Sukabanjar.
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-primary-600/20"
              >
                Selesai & Tutup
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
