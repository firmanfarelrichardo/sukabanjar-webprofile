'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OccupationItem {
  category: string;
  count: number;
  percentage: number;
}

interface EducationItem {
  level: string;
  count: number;
  percentage: number;
}

interface AgeGroupItem {
  range: string;
  count: number;
  percentage: number;
}

interface DusunItem {
  name: string;
  population: number;
  households: number;
}

interface DemographicsChartsProps {
  occupations: OccupationItem[];
  educationLevels: EducationItem[];
  ageGroups: AgeGroupItem[];
  dusunDistribution: DusunItem[];
}

export default function DemographicsCharts({
  occupations,
  educationLevels,
  ageGroups,
  dusunDistribution,
}: DemographicsChartsProps) {
  const [activeTab, setActiveTab] = useState<'pekerjaan' | 'pendidikan' | 'usia' | 'dusun'>('pekerjaan');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-8">
      {/* Header & Tab Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
            Grafik Demografi Penduduk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilih kategori di bawah untuk melihat rincian persentase dan statistik kependudukan
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pekerjaan')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer',
              activeTab === 'pekerjaan'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Briefcase size={14} />
            <span>Pekerjaan</span>
          </button>

          <button
            onClick={() => setActiveTab('pendidikan')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer',
              activeTab === 'pendidikan'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <GraduationCap size={14} />
            <span>Pendidikan</span>
          </button>

          <button
            onClick={() => setActiveTab('usia')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer',
              activeTab === 'usia'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Clock size={14} />
            <span>Usia</span>
          </button>

          <button
            onClick={() => setActiveTab('dusun')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer',
              activeTab === 'dusun'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <MapPin size={14} />
            <span>Per Dusun</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Mata Pencaharian / Pekerjaan */}
      {activeTab === 'pekerjaan' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-base font-bold text-slate-800 font-heading">
            Distribusi Mata Pencaharian Utama Warga
          </h3>
          <div className="space-y-4">
            {occupations.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-800">{item.category}</span>
                  <span className="text-slate-900 font-bold">
                    {item.count.toLocaleString('id-ID')} Jiwa ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tingkat Pendidikan */}
      {activeTab === 'pendidikan' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-base font-bold text-slate-800 font-heading">
            Tingkat Pendidikan Terakhir Warga Desa
          </h3>
          <div className="space-y-4">
            {educationLevels.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-800">{item.level}</span>
                  <span className="text-slate-900 font-bold">
                    {item.count.toLocaleString('id-ID')} Jiwa ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Kelompok Usia */}
      {activeTab === 'usia' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-base font-bold text-slate-800 font-heading">
            Struktur Kelompok Usia Kependudukan
          </h3>
          <div className="space-y-4">
            {ageGroups.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-800">{item.range}</span>
                  <span className="text-slate-900 font-bold">
                    {item.count.toLocaleString('id-ID')} Jiwa ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Distribusi Per Dusun */}
      {activeTab === 'dusun' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-base font-bold text-slate-800 font-heading">
            Sebaran Jumlah Penduduk Menurut Wilayah Dusun
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dusunDistribution.map((dusun, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-slate-900 text-sm">
                    {dusun.name}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    {dusun.households} KK
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-primary-600 font-heading block">
                  {dusun.population.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal text-slate-500">Jiwa</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
