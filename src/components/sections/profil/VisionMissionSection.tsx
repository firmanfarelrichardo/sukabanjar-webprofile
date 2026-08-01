'use client';

import { Target, CheckCircle2, Compass, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useState, useEffect } from 'react';

interface VisionMissionProps {
  vision?: string;
  missions?: string[];
}

export default function VisionMissionSection({ vision, missions }: VisionMissionProps) {
  const { isAdmin, isEditMode, updateLiveText } = useAdmin();

  const defaultVision =
    vision ||
    'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.';

  const defaultMissions =
    missions && missions.length > 0
      ? missions
      : [
          'Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa yang transparan, akuntabel, dan berbasis digital.',
          'Mengembangkan potensi UMKM lokal, ekonomi kreatif, dan hasil sektor pertanian untuk meningkatkan kesejahteraan warga.',
          'Meningkatkan pembangunan infrastruktur fasilitas publik yang merata, aman, serta ramah lingkungan.',
          'Memberdayakan pemuda, lembaga kemasyarakatan, dan menjaga kelestarian budaya serta nilai gotong royong.',
        ];

  const [visionText, setVisionText] = useState(defaultVision);
  const [missionList, setMissionList] = useState<string[]>(defaultMissions);

  useEffect(() => {
    setVisionText(defaultVision);
    setMissionList(defaultMissions);
  }, [defaultVision, defaultMissions]);

  const handleVisionChange = (val: string) => {
    setVisionText(val);
    updateLiveText('vision', val);
  };

  const handleMissionChange = (index: number, val: string) => {
    const updated = [...missionList];
    updated[index] = val;
    setMissionList(updated);
    updateLiveText('missions', updated);
  };

  const handleAddMission = () => {
    const updated = [...missionList, ''];
    setMissionList(updated);
    updateLiveText('missions', updated);
  };

  const handleRemoveMission = (index: number) => {
    const updated = missionList.filter((_, i) => i !== index);
    setMissionList(updated);
    updateLiveText('missions', updated);
  };

  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="container-section">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700 border border-accent-200">
            Arah Pembangunan
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Visi & Misi Desa
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Pedoman dan prioritas utama pemerintahan Desa Suka Banjar demi terwujudnya kesejahteraan warga.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visi Utama Card */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-3xl bg-gradient-to-br from-primary-900 via-slate-900 to-primary-950 text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden ring-2 ring-primary-500/30">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center border border-accent-500/30">
                    <Target size={26} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/15">
                    VISI DESA
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-semibold text-primary-400 tracking-wider">
                    Cita-Cita Utama
                  </h3>

                  {/* Direct Editable Visi Textarea */}
                  {isAdmin && isEditMode ? (
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-amber-400 uppercase">
                        ✏️ Edit Visi Utama Langsung:
                      </label>
                      <textarea
                        rows={4}
                        value={visionText}
                        onChange={(e) => handleVisionChange(e.target.value)}
                        className="w-full text-lg font-bold font-heading leading-snug text-white bg-white/10 p-3 rounded-2xl border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="Masukkan visi utama desa..."
                      />
                    </div>
                  ) : (
                    <blockquote className="text-xl sm:text-2xl font-bold font-heading leading-snug text-white italic">
                      "{visionText}"
                    </blockquote>
                  )}
                </div>
              </div>

              <div className="pt-8 relative z-10 border-t border-white/10 mt-6 flex items-center gap-2 text-xs text-slate-300">
                <Compass size={16} className="text-accent-400 shrink-0" />
                <span>Desa Suka Banjar, Kec. Sidomulyo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Misi List */}
          <div className="lg:col-span-7 flex">
            <div className="w-full rounded-3xl bg-white border border-slate-200/80 p-7 sm:p-9 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    Misi & Poin Prioritas
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                      {missionList.length} Poin Utama
                    </span>
                    {isAdmin && isEditMode && (
                      <button
                        type="button"
                        onClick={handleAddMission}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Tambah Misi</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Editable Mission Items */}
                <ul className="space-y-4">
                  {missionList.map((item, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="text-xs font-semibold text-primary-600">
                          Misi {index + 1}
                        </span>

                        {isAdmin && isEditMode ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleMissionChange(index, e.target.value)}
                              placeholder={`Tuliskan poin misi ${index + 1}...`}
                              className="w-full p-2.5 rounded-xl border-2 border-amber-400 bg-amber-50/40 text-slate-950 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            {missionList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMission(index)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                                title="Hapus poin misi ini"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                            {item}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
