'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemographicItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface DemographicsData {
  totalPopulation: number;
  totalHouseholds: number;
  occupations: DemographicItem[];
  education: DemographicItem[];
  ageGroups: DemographicItem[];
}

interface DemographicsSectionProps {
  demographics: DemographicsData;
}

export default function DemographicsSection({ demographics }: DemographicsSectionProps) {
  const [activeTab, setActiveTab] = useState<'occupations' | 'education' | 'ageGroups'>('occupations');

  const tabs = [
    { key: 'occupations', label: 'Mata Pencaharian', icon: Briefcase, data: demographics.occupations },
    { key: 'education', label: 'Tingkat Pendidikan', icon: GraduationCap, data: demographics.education },
    { key: 'ageGroups', label: 'Kelompok Umur', icon: Users, data: demographics.ageGroups },
  ] as const;

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  return (
    <section className="section-padding bg-slate-50 relative">
      <div className="container-section">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700 border border-accent-200">
            Data Statistik Warga
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Demografi Desa Sukabanjar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Gambaran statistik mata pencaharian, pendidikan, serta struktur usia penduduk desa.
          </p>
        </div>

        {/* Demographics Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-sm max-w-4xl mx-auto space-y-8">
          {/* Tab Selection */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 pb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  )}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Progress Bars List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <BarChart3 size={20} className="text-primary-600" />
                <span>Distribusi {currentTab.label}</span>
              </h3>
              <span className="text-xs text-slate-400">
                Total: {demographics.totalPopulation.toLocaleString('id-ID')} Jiwa
              </span>
            </div>

            <div className="space-y-4">
              {currentTab.data.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <span className="text-slate-500 font-medium">
                      {item.count.toLocaleString('id-ID')} Jiwa ({item.percentage}%)
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700 ease-out', item.color)}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographic Summary Footer */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl bg-primary-50/60 border border-primary-100">
              <span className="block text-xs text-slate-500">Total Penduduk</span>
              <span className="text-lg sm:text-xl font-bold text-primary-700 font-heading">
                {demographics.totalPopulation.toLocaleString('id-ID')} Jiwa
              </span>
            </div>
            <div className="p-4 rounded-xl bg-accent-50/60 border border-accent-100">
              <span className="block text-xs text-slate-500">Jumlah Kepala Keluarga</span>
              <span className="text-lg sm:text-xl font-bold text-accent-700 font-heading">
                {demographics.totalHouseholds.toLocaleString('id-ID')} KK
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
