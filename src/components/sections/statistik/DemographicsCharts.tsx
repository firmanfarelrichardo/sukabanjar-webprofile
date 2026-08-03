'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, Clock, MapPin, ChevronDown, ChevronRight, Home, PieChart as PieIcon, Table as TableIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OccupationItem {
  category: string;
  count: number;
  percentage: number;
  lakiLaki?: number;
  perempuan?: number;
}

interface EducationItem {
  level: string;
  count: number;
  percentage: number;
  lakiLaki?: number;
  perempuan?: number;
}

interface AgeGroupItem {
  range: string;
  count: number;
  percentage: number;
  lakiLaki?: number;
  perempuan?: number;
}

interface RtItem {
  rt: string;
  ketua?: string;
  jumlahKK: number;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
}

interface RwItem {
  rw: string;
  ketua?: string;
  jumlahKK: number;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
  rts?: RtItem[];
}

interface DusunItem {
  name: string;
  ketua?: string;
  population: number;
  households: number;
  lakiLaki?: number;
  perempuan?: number;
  rws?: RwItem[];
}

interface DemographicsChartsProps {
  occupations: OccupationItem[];
  educationLevels: EducationItem[];
  ageGroups: AgeGroupItem[];
  dusunDistribution: DusunItem[];
}

const PALETTE = [
  '#0086C9', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
  '#84CC16', '#EAB308', '#A855F7', '#64748B', '#0284C7',
  '#059669', '#D97706', '#7C3AED', '#DB2777'
];

// ─── REUSABLE SVG PIE/DONUT CHART COMPONENT ──────────────────────────────────
function DemographicPieChart({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number; percentage: number; lakiLaki?: number; perempuan?: number }[];
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalCount = items.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativePercentage = 0;

  // Filter items with count > 0 for pie rendering
  const activeItems = items.filter((it) => it.count > 0);

  return (
    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-base text-slate-900 font-heading flex items-center gap-2">
          <PieIcon size={18} className="text-[#0086C9]" />
          <span>{title}</span>
        </h4>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0086C9]/10 text-[#0086C9]">
          Total: {totalCount.toLocaleString('id-ID')} Jiwa
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Pie Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-md transform -rotate-90">
            {activeItems.map((item, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              const pct = item.percentage > 0 ? item.percentage : (item.count / (totalCount || 1)) * 100;
              const startPct = cumulativePercentage;
              cumulativePercentage += pct / 100;
              const endPct = cumulativePercentage;

              const startX = Math.cos(2 * Math.PI * startPct);
              const startY = Math.sin(2 * Math.PI * startPct);
              const endX = Math.cos(2 * Math.PI * endPct);
              const endY = Math.sin(2 * Math.PI * endPct);

              const largeArcFlag = pct > 50 ? 1 : 0;

              const pathData = [
                `M 100 100`,
                `L ${100 + 80 * startX} ${100 + 80 * startY}`,
                `A 80 80 0 ${largeArcFlag} 1 ${100 + 80 * endX} ${100 + 80 * endY}`,
                `Z`,
              ].join(' ');

              const isHovered = hoveredIdx === idx;

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-300 cursor-pointer hover:opacity-90 hover:scale-105 origin-center"
                  style={{
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    transformOrigin: '100px 100px',
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
            {/* Center Donut Hole */}
            <circle cx="100" cy="100" r="42" fill="#ffffff" />
          </svg>

          {/* Donut Center Info Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total
            </span>
            <span className="text-base font-extrabold text-slate-900 font-heading">
              {totalCount.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] font-bold text-[#0086C9]">Jiwa</span>
          </div>
        </div>

        {/* Dynamic Legend List */}
        <div className="lg:col-span-7 space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
          {items.map((item, idx) => {
            const color = PALETTE[idx % PALETTE.length];
            const isHovered = hoveredIdx === idx;
            const pct = item.percentage > 0 ? item.percentage : (item.count / (totalCount || 1)) * 100;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  'p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer',
                  isHovered
                    ? 'bg-white border-[#0086C9] shadow-sm ring-1 ring-[#0086C9]/20'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-bold text-slate-800 truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-extrabold text-slate-900">
                    {item.count.toLocaleString('id-ID')} Jiwa
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-black bg-slate-100 text-slate-700 min-w-[50px] text-center">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DemographicsCharts({
  occupations,
  educationLevels,
  ageGroups,
  dusunDistribution,
}: DemographicsChartsProps) {
  const [activeTab, setActiveTab] = useState<'dusun' | 'usia' | 'pendidikan' | 'pekerjaan'>('dusun');
  const [expandedDusunIndex, setExpandedDusunIndex] = useState<number | null>(0);

  // Format data for Pie Charts
  const agePieItems = ageGroups.map((a) => ({
    label: a.range,
    count: a.count,
    percentage: a.percentage,
    lakiLaki: a.lakiLaki,
    perempuan: a.perempuan,
  }));

  const eduPieItems = educationLevels.map((e) => ({
    label: e.level,
    count: e.count,
    percentage: e.percentage,
    lakiLaki: e.lakiLaki,
    perempuan: e.perempuan,
  }));

  const occPieItems = occupations.map((o) => ({
    label: o.category,
    count: o.count,
    percentage: o.percentage,
    lakiLaki: o.lakiLaki,
    perempuan: o.perempuan,
  }));

  const dusunPieItems = dusunDistribution.map((d) => ({
    label: d.name,
    count: d.population,
    percentage: parseFloat(((d.population / (dusunDistribution.reduce((a, b) => a + b.population, 0) || 1)) * 100).toFixed(1)),
    lakiLaki: d.lakiLaki,
    perempuan: d.perempuan,
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-8">
      {/* Header & Tab Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
            Grafik & Data Demografi Penduduk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Grafik lingkaran interaktif (persentase & total) serta perincian lengkap Laki-Laki & Perempuan
          </p>
        </div>

        {/* Tabs - 1 Baris Mendatar Presisi (Flex-nowrap) */}
        <div className="flex items-center flex-nowrap gap-1 sm:gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold overflow-x-auto scrollbar-none max-w-full shrink-0">
          <button
            onClick={() => setActiveTab('dusun')}
            className={cn(
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0',
              activeTab === 'dusun'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <MapPin size={14} />
            <span>Per Dusun & RT/RW</span>
          </button>

          <button
            onClick={() => setActiveTab('usia')}
            className={cn(
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0',
              activeTab === 'usia'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Clock size={14} />
            <span>Kelompok Usia</span>
          </button>

          <button
            onClick={() => setActiveTab('pendidikan')}
            className={cn(
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0',
              activeTab === 'pendidikan'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <GraduationCap size={14} />
            <span>Pendidikan</span>
          </button>

          <button
            onClick={() => setActiveTab('pekerjaan')}
            className={cn(
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0',
              activeTab === 'pekerjaan'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Briefcase size={14} />
            <span>Pekerjaan</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PER DUSUN & RT/RW BREAKDOWN */}
      {activeTab === 'dusun' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Grafik Lingkaran Wilayah Dusun */}
          <DemographicPieChart title="Statistik Persentase Penduduk Per Wilayah Dusun" items={dusunPieItems} />

          {/* Accordion Dusun & RT/RW */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-heading">
              Tabel Perincian Akurat Per Wilayah Dusun, RW, dan RT
            </h3>
            {dusunDistribution.map((dusun, idx) => {
              const isExpanded = expandedDusunIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm transition-all"
                >
                  <div
                    onClick={() => setExpandedDusunIndex(isExpanded ? null : idx)}
                    className="p-5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary-600 text-white">
                        <Home size={18} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 font-heading">
                          {dusun.name}
                        </h4>
                        {dusun.ketua && (
                          <span className="text-xs text-slate-500 font-medium">
                            Ketua Dusun: <strong className="text-slate-800">{dusun.ketua}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="font-extrabold text-primary-600 text-sm block">
                          {dusun.population.toLocaleString('id-ID')} Jiwa
                        </span>
                        <span className="text-slate-500 text-[11px] font-semibold">
                          {dusun.households} KK
                          {dusun.lakiLaki ? ` | L: ${dusun.lakiLaki} | P: ${dusun.perempuan}` : ''}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-200 text-slate-600">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content: RT/RW Breakdown */}
                  {isExpanded && dusun.rws && dusun.rws.length > 0 && (
                    <div className="p-5 space-y-5 bg-white border-t border-slate-100 animate-fadeIn">
                      {dusun.rws.map((rw, rwIdx) => (
                        <div key={rwIdx} className="space-y-3">
                          <div className="flex items-center justify-between bg-primary-50 p-3 rounded-xl border border-primary-100 text-xs font-bold text-primary-900">
                            <span>
                              {rw.rw} {rw.ketua && rw.ketua !== '-' ? `(Ketua: ${rw.ketua})` : ''}
                            </span>
                            <span>
                              {rw.jumlahKK} KK | Total: {rw.jumlah} Jiwa (L: {rw.lakiLaki}, P: {rw.perempuan})
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
                                {(rw.rts || []).map((rt, rtIdx) => (
                                  <tr key={rtIdx} className="hover:bg-slate-50">
                                    <td className="py-3 px-3 font-bold text-slate-900">{rt.rt}</td>
                                    <td className="py-3 px-3 text-slate-700">{rt.ketua || '-'}</td>
                                    <td className="py-3 px-3 text-center font-bold text-amber-700">{rt.jumlahKK} KK</td>
                                    <td className="py-3 px-3 text-center font-extrabold text-primary-600">{rt.jumlah} Jiwa</td>
                                    <td className="py-3 px-3 text-center text-blue-600">{rt.lakiLaki}</td>
                                    <td className="py-3 px-3 text-center text-emerald-600">{rt.perempuan}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KELOMPOK USIA */}
      {activeTab === 'usia' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Grafik Lingkaran Kelompok Usia */}
          <DemographicPieChart title="Statistik Data Umur (Rentang)" items={agePieItems} />

          {/* Tabel Lengkap Laki-Laki & Perempuan */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-heading flex items-center gap-2">
              <TableIcon size={18} className="text-[#0086C9]" />
              <span>Tabel Rincian Lengkap Kelompok Usia (Laki-Laki & Perempuan)</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <th className="py-3.5 px-4 text-center">No</th>
                    <th className="py-3.5 px-4">Kelompok Usia</th>
                    <th className="py-3.5 px-4 text-center">Jumlah (L+P)</th>
                    <th className="py-3.5 px-4 text-center">Laki-Laki</th>
                    <th className="py-3.5 px-4 text-center">Perempuan</th>
                    <th className="py-3.5 px-4 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {ageGroups.map((item, idx) => {
                    const lPct = item.count > 0 && item.lakiLaki ? ((item.lakiLaki / item.count) * 100).toFixed(1) : '0';
                    const pPct = item.count > 0 && item.perempuan ? ((item.perempuan / item.count) * 100).toFixed(1) : '0';
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.range}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#0086C9]">
                          {item.count.toLocaleString('id-ID')} Jiwa
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                          {item.lakiLaki?.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">({lPct}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                          {item.perempuan?.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">({pPct}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TINGKAT PENDIDIKAN */}
      {activeTab === 'pendidikan' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Grafik Lingkaran Tingkat Pendidikan */}
          <DemographicPieChart title="Statistik Pendidikan Ditempuh" items={eduPieItems} />

          {/* Tabel Lengkap Laki-Laki & Perempuan */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-heading flex items-center gap-2">
              <TableIcon size={18} className="text-[#0086C9]" />
              <span>Tabel Rincian Lengkap Tingkat Pendidikan (Laki-Laki & Perempuan)</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <th className="py-3.5 px-4 text-center">No</th>
                    <th className="py-3.5 px-4">Tingkat Pendidikan</th>
                    <th className="py-3.5 px-4 text-center">Jumlah (L+P)</th>
                    <th className="py-3.5 px-4 text-center">Laki-Laki</th>
                    <th className="py-3.5 px-4 text-center">Perempuan</th>
                    <th className="py-3.5 px-4 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {educationLevels.map((item, idx) => {
                    const lPct = item.count > 0 && item.lakiLaki ? ((item.lakiLaki / item.count) * 100).toFixed(1) : '0';
                    const pPct = item.count > 0 && item.perempuan ? ((item.perempuan / item.count) * 100).toFixed(1) : '0';
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.level}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#0086C9]">
                          {item.count.toLocaleString('id-ID')} Jiwa
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                          {item.lakiLaki?.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">({lPct}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                          {item.perempuan?.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">({pPct}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MATA PENCAHARIAN / PEKERJAAN */}
      {activeTab === 'pekerjaan' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Grafik Lingkaran Jenis Pekerjaan */}
          <DemographicPieChart title="Statistik Pekerjaan Warga" items={occPieItems} />

          {/* Tabel Lengkap Laki-Laki & Perempuan */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-heading flex items-center gap-2">
              <TableIcon size={18} className="text-[#0086C9]" />
              <span>Tabel Rincian Lengkap Mata Pencaharian (Laki-Laki & Perempuan)</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <th className="py-3.5 px-4 text-center">No</th>
                    <th className="py-3.5 px-4">Jenis Pekerjaan</th>
                    <th className="py-3.5 px-4 text-center">Jumlah (L+P)</th>
                    <th className="py-3.5 px-4 text-center">Laki-Laki</th>
                    <th className="py-3.5 px-4 text-center">Perempuan</th>
                    <th className="py-3.5 px-4 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {occupations.map((item, idx) => {
                    const lPct = item.count > 0 && item.lakiLaki ? ((item.lakiLaki / item.count) * 100).toFixed(1) : '0';
                    const pPct = item.count > 0 && item.perempuan ? ((item.perempuan / item.count) * 100).toFixed(1) : '0';
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.category}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#0086C9]">
                          {item.count.toLocaleString('id-ID')} Jiwa
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                          {item.lakiLaki?.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">({lPct}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                          {item.perempuan?.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">({pPct}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
