import { Users, UserCheck, Home, MapPin, Scale } from 'lucide-react';

interface OverviewData {
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  totalHouseholds: number;
  totalAreaKm2?: number;
  totalDusun?: number;
  sexRatio: number;
}

interface StatistikOverviewCardsProps {
  overview: OverviewData;
}

export default function StatistikOverviewCards({ overview }: StatistikOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Penduduk',
      value: overview.totalPopulation.toLocaleString('id-ID'),
      unit: 'Jiwa',
      badge: '100% Warga',
      icon: Users,
      color: 'bg-primary-500',
    },
    {
      title: 'Penduduk Laki-Laki',
      value: overview.malePopulation.toLocaleString('id-ID'),
      unit: 'Jiwa',
      badge: `${((overview.malePopulation / overview.totalPopulation) * 100).toFixed(1)}% Total`,
      icon: UserCheck,
      color: 'bg-blue-500',
    },
    {
      title: 'Penduduk Perempuan',
      value: overview.femalePopulation.toLocaleString('id-ID'),
      unit: 'Jiwa',
      badge: `${((overview.femalePopulation / overview.totalPopulation) * 100).toFixed(1)}% Total`,
      icon: UserCheck,
      color: 'bg-emerald-500',
    },
    {
      title: 'Kepala Keluarga (KK)',
      value: overview.totalHouseholds.toLocaleString('id-ID'),
      unit: 'KK',
      badge: 'Rata-rata 3.8 Jiwa/KK',
      icon: Home,
      color: 'bg-amber-500',
    },
    {
      title: 'Total Dusun Desa',
      value: (overview.totalDusun || 5).toLocaleString('id-ID'),
      unit: 'Dusun',
      badge: '5 Wilayah Dusun',
      icon: Home,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md`}
              >
                <Icon size={24} />
              </div>
            </div>

            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading block">
                {item.value}{' '}
                <span className="text-sm font-semibold text-slate-500">{item.unit}</span>
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mt-1">
                {item.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
