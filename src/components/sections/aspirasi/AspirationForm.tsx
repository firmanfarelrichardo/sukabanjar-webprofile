'use client';

import { useState } from 'react';
import { Send, EyeOff, User, Tag, FileText, Paperclip, AlertCircle, Loader2 } from 'lucide-react';
import SubmissionSuccessModal from './SubmissionSuccessModal';

const CATEGORIES = [
  'Fasilitas Publik',
  'Kebersihan/Lingkungan',
  'Keamanan',
  'Saran/Masukan',
  'Lainnya',
];

export default function AspirationForm() {
  const [senderName, setSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Judul aspirasi / pengaduan wajib diisi.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Detail isi pesan wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/aspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: isAnonymous ? 'Anonim' : senderName,
          isAnonymous,
          category,
          title,
          content,
          attachment: attachment.trim() || null,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setShowSuccessModal(true);
        // Reset form
        setSenderName('');
        setIsAnonymous(false);
        setTitle('');
        setContent('');
        setAttachment('');
      } else {
        setErrorMessage(json.message || 'Gagal mengirim pesan. Silakan periksa kembali formulir.');
      }
    } catch (err) {
      console.error('Submit aspiration error:', err);
      setErrorMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="section-padding bg-white relative">
        <div className="container-section max-w-3xl mx-auto">
          {/* Form Container Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                Formulir Pesan Aspirasi
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Isi formulir di bawah ini dengan jelas. Pesan Anda akan langsung masuk ke Inbox Balai Desa.
              </p>
            </div>

            {/* Error Alert if any */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Nama Pelapor & Checkbox Anonim */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <User size={15} className="text-primary-600" />
                    Nama Pelapor
                  </label>

                  {/* Checkbox Anonim */}
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg hover:bg-primary-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                    />
                    <EyeOff size={13} />
                    <span>Sembunyikan Nama (Anonim)</span>
                  </label>
                </div>

                <input
                  type="text"
                  disabled={isAnonymous}
                  value={isAnonymous ? 'Anonim (Nama Disembunyikan)' : senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                />
              </div>

              {/* Row 2: Kategori Laporan */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Tag size={15} className="text-primary-600" />
                  Kategori Laporan
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Judul / Subjek */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText size={15} className="text-primary-600" />
                  Judul / Subjek Laporan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Perbaikan Lampu Jalan Dusun 3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Row 4: Detail Isi Pesan */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText size={15} className="text-primary-600" />
                  Detail Isi Pesan Aspirasi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Jelaskan kronologi, lokasi spesifik, atau usulan Anda secara mendetail..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Row 5: Lampiran URL / Foto Bukti (Opsional) */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Paperclip size={15} className="text-primary-600" />
                    Link Foto Bukti / Lampiran (Opsional)
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    URL Foto Google Drive / Cloud
                  </span>
                </label>
                <input
                  type="url"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  placeholder="https://drive.google.com/... atau link foto bukti"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-500 disabled:bg-slate-300 transition-all duration-200 shadow-lg shadow-primary-600/25 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Mengirim Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Kirim Pesan Aspirasi Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Modal Notifikasi Konfirmasi Sukses */}
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
