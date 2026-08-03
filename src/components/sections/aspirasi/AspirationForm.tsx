'use client';

import { useState } from 'react';
import { Send, EyeOff, User, Tag, FileText, Paperclip, AlertCircle, Loader2, Upload, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import SubmissionSuccessModal from './SubmissionSuccessModal';

const CATEGORIES = [
  'Fasilitas Publik',
  'Kebersihan/Lingkungan',
  'Keamanan',
  'Saran/Masukan',
  'Lainnya',
];

interface AttachmentItem {
  id: string;
  name: string;
  preview: string;
  url: string;
  sizeKb: string;
}

export default function AspirationForm() {
  const [senderName, setSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Attachment States (Upload File / URL Link) - Maksimal 2 Foto Bukti (Maks 1MB/Gambar)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [urlAttachment, setUrlAttachment] = useState('');
  const [attachmentItems, setAttachmentItems] = useState<AttachmentItem[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle local file selection (Maksimal 2 foto, maks 1MB per file)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage('');

    // Check total count limit (Maks 2 foto bukti untuk Aspirasi)
    if (attachmentItems.length + files.length > 2) {
      setErrorMessage(`Maksimal total 2 foto bukti untuk pengiriman aspirasi. Anda hanya bisa menambah ${2 - attachmentItems.length} foto lagi.`);
      return;
    }

    // Validate file sizes (Maks 1 MB per gambar)
    for (const file of Array.from(files)) {
      if (file.size > 1 * 1024 * 1024) {
        setErrorMessage(`File "${file.name}" melebihi batas 1 MB (Ukuran file: ${(file.size / 1024 / 1024).toFixed(2)} MB). Silakan kompres foto terlebih dahulu.`);
        return;
      }
    }

    setIsUploadingFile(true);
    const newItems: AttachmentItem[] = [...attachmentItems];

    for (const file of Array.from(files)) {
      const objectUrl = URL.createObjectURL(file);
      try {
        const formData = new FormData();
        formData.append('images', file);

        const res = await fetch('/api/upload?maxKb=1024', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();

        if (res.ok && json.success && json.data?.[0]) {
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            preview: objectUrl,
            url: json.data[0],
            sizeKb: (file.size / 1024).toFixed(1),
          });
        } else {
          // Fallback Base64
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            preview: objectUrl,
            url: base64,
            sizeKb: (file.size / 1024).toFixed(1),
          });
        }
      } catch (err) {
        console.error('File upload error, fallback base64:', err);
      }
    }

    setAttachmentItems(newItems);
    setIsUploadingFile(false);

    // Reset input
    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setAttachmentItems((prev) => prev.filter((item) => item.id !== id));
  };

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

    // Determine final attachment value
    let finalAttachment: string | null = null;
    if (uploadMethod === 'file') {
      if (attachmentItems.length > 0) {
        finalAttachment = attachmentItems.map((item) => item.url).join(',');
      }
    } else {
      if (urlAttachment.trim()) {
        finalAttachment = urlAttachment.trim();
      }
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
          attachment: finalAttachment,
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
        setUrlAttachment('');
        setAttachmentItems([]);
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

              {/* Row 5: Foto Bukti / Lampiran (Maksimal 2 Foto, Maks 1MB/Gambar - Opsional) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Paperclip size={15} className="text-primary-600" />
                    <span>Foto Bukti / Lampiran (Opsional, Maks. 2 Foto, Maks. 1MB/Gambar)</span>
                  </label>

                  {/* Mode Switcher: Upload File Lokal / URL Link */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        uploadMethod === 'file'
                          ? 'bg-white text-primary-700 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Upload File (Maks. 2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        uploadMethod === 'url'
                          ? 'bg-white text-primary-700 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Link URL Foto
                    </button>
                  </div>
                </div>

                {uploadMethod === 'file' ? (
                  <div className="space-y-3">
                    {/* List Uploaded Attachment Items (Up to 2) */}
                    {attachmentItems.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {attachmentItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.preview}
                                alt={`Foto bukti ${idx + 1}`}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {item.sizeKb} KB (Foto {idx + 1})
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(item.id)}
                              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer shrink-0"
                              title="Hapus foto ini"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload File Input Area (Disabled when 2 images reached) */}
                    {attachmentItems.length < 2 && (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer text-center group">
                        <Upload size={24} className="text-slate-400 group-hover:text-primary-600 mb-2 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-primary-700">
                          {attachmentItems.length === 0
                            ? 'Klik untuk memilih foto bukti dari perangkat (Lokal)'
                            : 'Tambah Foto Bukti Ke-2 (Maksimal 2 Foto)'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal mt-0.5">
                          Format: PNG, JPG, JPEG, WebP (Maks. 1MB Per Gambar)
                        </span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          multiple
                          onChange={handleFileChange}
                          disabled={isUploadingFile}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={urlAttachment}
                      onChange={(e) => setUrlAttachment(e.target.value)}
                      placeholder="https://drive.google.com/... atau link foto bukti"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <span className="text-[11px] text-slate-400 font-normal block pl-1">
                      Masukkan URL link foto bukti Google Drive / Cloud (Opsional)
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading || isUploadingFile}
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
