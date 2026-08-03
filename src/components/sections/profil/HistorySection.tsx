'use client';

import { History, BookmarkCheck, Landmark } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useState, useEffect } from 'react';

interface HistorySectionProps {
  historyText?: string;
  villageName?: string;
  historyCardTitle?: string;
  historyCardQuote?: string;
}

export default function HistorySection({
  historyText,
  villageName = 'Suka Banjar',
  historyCardTitle,
  historyCardQuote,
}: HistorySectionProps) {
  const { isAdmin, isEditMode, updateLiveText } = useAdmin();

  const defaultTitle = historyCardTitle || 'Warisan Nilai & Gotong Royong';
  const defaultQuote =
    historyCardQuote ||
    'Menjaga peninggalan nilai luhur pendiri desa, membangun tatanan kemasyarakatan yang harmonis dan sejalan dengan perkembangan jaman digital.';
  const defaultHistory =
    historyText ||
    `Desa Suka Banjar didirikan dengan semangat kebersamaan dan gotong royong warga masyarakat. Nama "Suka Banjar" memiliki makna filosofis yang mendalam, di mana "Suka" melambangkan kedamaian dan kegembiraan, serta "Banjar" melambangkan perkampungan atau tatanan sosial yang teratur dan harmonis.\n\nSecara historis, wilayah ini awalnya berkembang dari pemukiman warga berbasis sektor pertanian dan perkebunan. Berkat kegigihan para tokoh pendiri desa, Suka Banjar tumbuh menjadi salah satu wilayah yang mandiri dan berdaya saing di Kecamatan Sidomulyo, Kabupaten Lampung Selatan. Semangat kebersamaan dan tradisi gotong royong terus dilestarikan oleh generasi ke generasi hingga saat ini.`;

  const [cardTitle, setCardTitle] = useState(defaultTitle);
  const [cardQuote, setCardQuote] = useState(defaultQuote);
  const [historyContent, setHistoryContent] = useState(defaultHistory);

  useEffect(() => {
    setCardTitle(defaultTitle);
    setCardQuote(defaultQuote);
    setHistoryContent(defaultHistory);
  }, [defaultTitle, defaultQuote, defaultHistory]);

  const handleTitleChange = (val: string) => {
    setCardTitle(val);
    updateLiveText('historyCardTitle', val);
  };

  const handleQuoteChange = (val: string) => {
    setCardQuote(val);
    updateLiveText('historyCardQuote', val);
  };

  const handleHistoryChange = (val: string) => {
    setHistoryContent(val);
    updateLiveText('history', val);
  };

  const paragraphs = historyContent.split('\n\n');

  return (
    <section className="py-16 md:py-24 bg-white relative border-b border-slate-100">
      <div className="container-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Side: Visual Light Theme Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl p-8 text-slate-900 space-y-6 hover:border-[#0086C9]/40 transition-all duration-300">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0086C9]/10 text-[#0086C9] flex items-center justify-center border border-[#0086C9]/20 shadow-sm">
                  <Landmark size={26} />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0086C9] bg-[#0086C9]/10 px-3 py-1 rounded-full border border-[#0086C9]/20 inline-block">
                    Kilas Balik Historis
                  </span>

                  {/* Direct Editable Title */}
                  {isAdmin && isEditMode ? (
                    <input
                      type="text"
                      value={cardTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full text-2xl font-extrabold font-heading text-slate-900 bg-amber-50/50 p-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <h3 className="text-2xl font-extrabold font-heading text-slate-900">
                      {cardTitle}
                    </h3>
                  )}
                </div>

                {/* Direct Editable Quote Subtitle */}
                {isAdmin && isEditMode ? (
                  <textarea
                    rows={3}
                    value={cardQuote}
                    onChange={(e) => handleQuoteChange(e.target.value)}
                    className="w-full text-slate-800 text-sm leading-relaxed bg-amber-50/50 p-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                ) : (
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic font-medium">
                    "{cardQuote}"
                  </p>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold">
                    <BookmarkCheck size={16} className="text-[#0086C9]" />
                    <span>Sidomulyo, Lampung Selatan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 shadow-sm">
              <h4 className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <History size={16} className="text-[#0086C9]" />
                Identitas Geografis
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500 font-medium">Kecamatan:</span>
                  <span className="font-extrabold text-slate-900">Sidomulyo</span>
                </li>
                <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500 font-medium">Kabupaten:</span>
                  <span className="font-extrabold text-slate-900">Lampung Selatan</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500 font-medium">Provinsi:</span>
                  <span className="font-extrabold text-slate-900">Lampung</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Article Body Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0086C9]/10 text-[#0086C9] border border-[#0086C9]/20 inline-block">
                Sejarah Singkat
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                Sejarah Berdirinya Desa {villageName}
              </h2>
            </div>

            {/* Direct Editable Sejarah Text */}
            {isAdmin && isEditMode ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-amber-600 uppercase">
                  Edit Paragraf Sejarah Desa Langsung:
                </label>
                <textarea
                  rows={8}
                  value={historyContent}
                  onChange={(e) => handleHistoryChange(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/30 text-slate-900 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="first-letter:text-3xl first-letter:font-extrabold first-letter:text-[#0086C9] first-letter:mr-1">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
