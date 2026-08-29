'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  Home,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Edit3,
  X,
  Save,
} from 'lucide-react';

export default function AdminSipdeskelTab() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'dusun' | 'usia' | 'pendidikan' | 'pekerjaan'>('dusun');
  const [expandedDusunId, setExpandedDusunId] = useState<string | null>('dus-1');

  // Manual Edit State
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/statistik');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching statistik data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      setSyncResult(null);

      const res = await fetch('/api/statistik', { method: 'POST' });
      const json = await res.json();

      if (res.ok && json.success) {
        setSyncResult({
          success: true,
          message: `Sinkronisasi SIPDeskel berhasil! Total ${json.data.totalRecords} record diperbarui dari server.`,
        });
        fetchData();
      } else {
        setSyncResult({
          success: false,
          message: json.message || 'Sinkronisasi gagal. Menggunakan data akurat lokal.',
        });
      }
    } catch (err) {
      console.error('Error triggering manual sync:', err);
      setSyncResult({
        success: false,
        message: 'Gagal menghubungkan server ke SIPDeskel.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      const payload = {
        ...editingItem,
        jumlahKK: editingItem.jumlahKK !== undefined ? Number(editingItem.jumlahKK) : undefined,
        jumlah: Number(editingItem.jumlah) || Number(editingItem.lakiLaki || 0) + Number(editingItem.perempuan || 0),
        lakiLaki: Number(editingItem.lakiLaki) || 0,
        perempuan: Number(editingItem.perempuan) || 0,
        persentase: editingItem.persentase !== undefined ? Number(editingItem.persentase) : undefined,
      };

      const res = await fetch('/api/statistik', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // Optimistic State Update for Instant Feedback
        setData((prev: any) => {
          if (!prev) return prev;
          const targetKey = editingItem.type; // 'dusun' | 'usia' | 'pendidikan' | 'pekerjaan'
          if (!prev[targetKey]) return prev;

          const updatedList = prev[targetKey].map((item: any) => {
            if (item.id === editingItem.id || (item.namaDusun && item.namaDusun === editingItem.namaDusun) || (item.kategori && item.kategori === editingItem.kategori)) {
              return {
                ...item,
                ...payload,
              };
            }
            return item;
          });

          // Recalculate totals if dusun was edited
          let newOverview = prev.overview;
          if (targetKey === 'dusun') {
            const totalPop = updatedList.reduce((acc: number, d: any) => acc + (d.jumlah || 0), 0);
            const totalMale = updatedList.reduce((acc: number, d: any) => acc + (d.lakiLaki || 0), 0);
            const totalFemale = updatedList.reduce((acc: number, d: any) => acc + (d.perempuan || 0), 0);
            const totalKK = updatedList.reduce((acc: number, d: any) => acc + (d.jumlahKK || 0), 0);
            newOverview = {
              ...prev.overview,
              totalPopulation: totalPop,
              malePopulation: totalMale,
              femalePopulation: totalFemale,
              totalHouseholds: totalKK,
            };
          }

          return {
            ...prev,
            [targetKey]: updatedList,
            overview: newOverview,
          };
        });

        setSyncResult({
          success: true,
          message: `Perubahan data ${editingItem.type} berhasil disimpan ke database!`,
        });
        setEditingItem(null);

        // Fetch fresh server state
        fetchData();
      } else {
        setSyncResult({
          success: false,
          message: json.message || 'Gagal menyimpan data.',
        });
      }
    } catch (err) {
      console.error('Error saving manual edit:', err);
      setSyncResult({
        success: false,
        message: 'Terjadi kesalahan saat menyimpan perubahan data.',
      });
    }
  };

  if (isLoading && !data) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-200">
        <RefreshCw size={28} className="animate-spin mx-auto text-[#0086C9]" />
        <p className="text-xs font-semibold">Memuat modul sinkronisasi demografi SIPDeskel...</p>
      </div>
    );
  }

  const lastSync = data?.lastSync;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner & Status Dashboard */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Modul Integrasi Data SIPDeskel Desa Suka Banjar</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              Sinkronisasi & Pengelolaan Demografi
            </h2>
            <p className="text-xs text-slate-500">
              Sinkronisasi data otomatis dari portal SIPDeskel dan edit data manual jika diperlukan.
            </p>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0086C9] to-[#006ca3] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#0086C9]/20 transition-all hover:scale-105 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Menyingkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>
        </div>

        {/* Sync Status Alert Notification */}
        {syncResult && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
              syncResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {syncResult.success ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{syncResult.message}</span>
          </div>
        )}

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Status Sinkronisasi
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              <CheckCircle2 size={12} />
              {lastSync?.status || 'SUCCESS'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sinkronisasi Terakhir
            </span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <Clock size={13} className="text-[#0086C9]" />
              {new Date(lastSync?.syncedAt || Date.now()).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Penduduk Desa
            </span>
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
              <Database size={13} className="text-amber-600" />
              {data?.overview?.totalPopulation.toLocaleString('id-ID')} Jiwa ({data?.overview?.totalHouseholds} KK)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Wilayah Administratif
            </span>
            <span className="text-xs font-extrabold text-slate-900">
              5 Dusun Suka Banjar
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Demografi Categories */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
          <button
            onClick={() => setActiveSubTab('dusun')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'dusun'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home size={14} />
            <span>Per Dusun & RT/RW ({(data?.dusun || []).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('usia')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'usia'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock size={14} />
            <span>Usia ({(data?.usia || []).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pendidikan')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'pendidikan'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap size={14} />
            <span>Pendidikan ({(data?.pendidikan || []).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pekerjaan')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'pekerjaan'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Briefcase size={14} />
            <span>Pekerjaan ({(data?.pekerjaan || []).length})</span>
          </button>
        </div>

        {/* Tab Content: Dusun Table with RT / RW Breakdown */}
        {activeSubTab === 'dusun' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 font-heading">
                  Rincian Wilayah Administratif 5 Dusun Desa Suka Banjar
                </h4>
                <p className="text-xs text-slate-500">
                  Klik dusun untuk melihat rincian RT/RW. Klik tombol Edit untuk mengubah data secara manual.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(data?.dusun || []).map((dus: any) => {
                const isExpanded = expandedDusunId === dus.id;
                return (
                  <div
                    key={dus.id}
                    className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm transition-all"
                  >
                    {/* Dusun Header Accordion Trigger */}
                    <div className="p-5 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60">
                      <div
                        onClick={() => setExpandedDusunId(isExpanded ? null : dus.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <div className="p-2.5 rounded-xl bg-[#0086C9] text-white">
                          <Home size={18} />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900 font-heading">
                            {dus.namaDusun}
                          </h5>
                          {dus.ketua && (
                            <span className="text-xs text-slate-500 font-medium">
                              Ketua Dusun: <strong className="text-slate-800">{dus.ketua}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="font-extrabold text-[#0086C9] text-sm block">
                            {dus.jumlah} Jiwa
                          </span>
                          <span className="text-slate-500 text-[11px] font-semibold">
                            {dus.jumlahKK} KK | L: {dus.lakiLaki} | P: {dus.perempuan}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            setEditingItem({
                              type: 'dusun',
                              id: dus.id,
                              namaDusun: dus.namaDusun,
                              ketua: dus.ketua || '',
                              jumlah: dus.jumlah,
                              lakiLaki: dus.lakiLaki,
                              perempuan: dus.perempuan,
                              jumlahKK: dus.jumlahKK,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        <div
                          onClick={() => setExpandedDusunId(isExpanded ? null : dus.id)}
                          className="p-1 rounded-lg bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Nested Breakdown: RW & RT Tables */}
                    {isExpanded && (
                      <div className="p-5 space-y-6 bg-white animate-fadeIn">
                        {(dus.rws || []).map((rwItem: any, rwIdx: number) => {
                          const rwKK = (dus.rws && dus.rws.length === 1) ? dus.jumlahKK : (rwItem.jumlahKK || dus.jumlahKK);
                          const rwJumlah = (dus.rws && dus.rws.length === 1) ? dus.jumlah : (rwItem.jumlah || dus.jumlah);
                          const rwLaki = (dus.rws && dus.rws.length === 1) ? dus.lakiLaki : (rwItem.lakiLaki || dus.lakiLaki);
                          const rwPerempuan = (dus.rws && dus.rws.length === 1) ? dus.perempuan : (rwItem.perempuan || dus.perempuan);

                          return (
                            <div key={rwIdx} className="space-y-3">
                              <div className="flex items-center justify-between bg-sky-50 p-3 rounded-xl border border-sky-100 text-xs font-bold text-sky-900">
                                <span>
                                  {rwItem.rw} {rwItem.ketua && rwItem.ketua !== '-' ? `(Ketua: ${rwItem.ketua})` : ''}
                                </span>
                                <span>
                                  {rwKK} KK | Total: {rwJumlah} Jiwa (L: {rwLaki}, P: {rwPerempuan})
                                </span>
                              </div>

                            <div className="overflow-x-auto pl-2 sm:pl-4">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                                    <th className="py-2.5 px-3">Wilayah RT</th>
                                    <th className="py-2.5 px-3">Ketua RT</th>
                                    <th className="py-2.5 px-3 text-center">Jumlah KK</th>
                                    <th className="py-2.5 px-3 text-center">L + P</th>
                                    <th className="py-2.5 px-3 text-center">Laki-Laki</th>
                                    <th className="py-2.5 px-3 text-center">Perempuan</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                  {(rwItem.rts || []).map((rtItem: any, rtIdx: number) => (
                                    <tr key={rtIdx} className="hover:bg-slate-50">
                                      <td className="py-3 px-3 font-bold text-slate-900">{rtItem.rt}</td>
                                      <td className="py-3 px-3 text-slate-700">{rtItem.ketua || '-'}</td>
                                      <td className="py-3 px-3 text-center font-bold text-amber-700">{rtItem.jumlahKK} KK</td>
                                      <td className="py-3 px-3 text-center font-extrabold text-[#0086C9]">{rtItem.jumlah} Jiwa</td>
                                      <td className="py-3 px-3 text-center text-blue-600">{rtItem.lakiLaki}</td>
                                      <td className="py-3 px-3 text-center text-emerald-600">{rtItem.perempuan}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Usia Table */}
        {activeSubTab === 'usia' && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 font-heading">
              Data Demografi Menurut Kelompok Usia (Rentang)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Kelompok Usia</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Laki-Laki</th>
                    <th className="py-3 px-4">Perempuan</th>
                    <th className="py-3 px-4">Persentase</th>
                    <th className="py-3 px-4 text-center">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(data?.usia || []).map((item: any, idx: number) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.kategori}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0086C9]">{item.jumlah} Jiwa</td>
                      <td className="py-3.5 px-4 text-blue-600">{item.lakiLaki} Jiwa</td>
                      <td className="py-3.5 px-4 text-emerald-600">{item.perempuan} Jiwa</td>
                      <td className="py-3.5 px-4 text-amber-700 font-semibold">{item.persentase || '-'}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() =>
                            setEditingItem({
                              type: 'usia',
                              id: item.id,
                              kategori: item.kategori,
                              jumlah: item.jumlah,
                              lakiLaki: item.lakiLaki,
                              perempuan: item.perempuan,
                              persentase: item.persentase,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Pendidikan Table */}
        {activeSubTab === 'pendidikan' && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 font-heading">
              Data Demografi Tingkat Pendidikan Ditempuh
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Tingkat Pendidikan</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Laki-Laki</th>
                    <th className="py-3 px-4">Perempuan</th>
                    <th className="py-3 px-4">Persentase</th>
                    <th className="py-3 px-4 text-center">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(data?.pendidikan || []).map((item: any, idx: number) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.kategori}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0086C9]">{item.jumlah} Jiwa</td>
                      <td className="py-3.5 px-4 text-blue-600">{item.lakiLaki} Jiwa</td>
                      <td className="py-3.5 px-4 text-emerald-600">{item.perempuan} Jiwa</td>
                      <td className="py-3.5 px-4 text-amber-700 font-semibold">{item.persentase || '-'}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() =>
                            setEditingItem({
                              type: 'pendidikan',
                              id: item.id,
                              kategori: item.kategori,
                              jumlah: item.jumlah,
                              lakiLaki: item.lakiLaki,
                              perempuan: item.perempuan,
                              persentase: item.persentase,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Pekerjaan Table */}
        {activeSubTab === 'pekerjaan' && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 font-heading">
              Data Demografi Jenis Mata Pencaharian / Pekerjaan
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Jenis Pekerjaan</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Laki-Laki</th>
                    <th className="py-3 px-4">Perempuan</th>
                    <th className="py-3 px-4">Persentase</th>
                    <th className="py-3 px-4 text-center">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(data?.pekerjaan || []).map((item: any, idx: number) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.kategori}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0086C9]">{item.jumlah} Jiwa</td>
                      <td className="py-3.5 px-4 text-blue-600">{item.lakiLaki} Jiwa</td>
                      <td className="py-3.5 px-4 text-emerald-600">{item.perempuan} Jiwa</td>
                      <td className="py-3.5 px-4 text-amber-700 font-semibold">{item.persentase || '-'}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() =>
                            setEditingItem({
                              type: 'pekerjaan',
                              id: item.id,
                              kategori: item.kategori,
                              jumlah: item.jumlah,
                              lakiLaki: item.lakiLaki,
                              perempuan: item.perempuan,
                              persentase: item.persentase,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <Edit3 size={18} className="text-amber-500" />
                <span>Edit Data Demografi ({editingItem.type.toUpperCase()})</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {editingItem.type === 'dusun' ? (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nama Dusun</label>
                    <input
                      type="text"
                      value={editingItem.namaDusun}
                      onChange={(e) => setEditingItem({ ...editingItem, namaDusun: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nama Ketua Dusun</label>
                    <input
                      type="text"
                      value={editingItem.ketua}
                      onChange={(e) => setEditingItem({ ...editingItem, ketua: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Jumlah KK</label>
                    <input
                      type="number"
                      value={editingItem.jumlahKK}
                      onChange={(e) => setEditingItem({ ...editingItem, jumlahKK: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-900"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori / Rentang</label>
                  <input
                    type="text"
                    value={editingItem.kategori}
                    onChange={(e) => setEditingItem({ ...editingItem, kategori: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Laki-Laki</label>
                  <input
                    type="number"
                    value={editingItem.lakiLaki}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      const p = Number(editingItem.perempuan || 0);
                      setEditingItem({ ...editingItem, lakiLaki: l, jumlah: l + p });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Perempuan</label>
                  <input
                    type="number"
                    value={editingItem.perempuan}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const l = Number(editingItem.lakiLaki || 0);
                      setEditingItem({ ...editingItem, perempuan: p, jumlah: l + p });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total (L+P)</label>
                  <input
                    type="number"
                    value={editingItem.jumlah}
                    readOnly
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-100 font-extrabold text-[#0086C9]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Save size={14} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
