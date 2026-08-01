import { UserCheck, Shield, Users } from 'lucide-react';

interface ApparatusItem {
  id: string;
  name: string;
  role: string;
  orderNum: number;
  imageUrl?: string | null;
}

interface ApparatusSectionProps {
  apparatus: ApparatusItem[];
}

export default function ApparatusSection({ apparatus }: ApparatusSectionProps) {
  if (!apparatus || apparatus.length === 0) return null;

  return (
    <section className="section-padding bg-white relative">
      <div className="container-section">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200">
            Pemerintahan Desa
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">
            Struktur Organisasi Desa
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Perangkat Desa Suka Banjar yang siap memberikan pelayanan terbaik kepada seluruh warga.
          </p>
        </div>

        {/* Hierarchy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apparatus.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-white border border-slate-200/80 hover:border-primary-300 p-5 text-center shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-between"
            >
              {/* Top Photo / Avatar */}
              <div className="w-full space-y-4">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-primary-900 flex items-center justify-center text-white">
                      <UserCheck size={38} className="text-primary-400" />
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg group-hover:text-primary-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full inline-block">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-5 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <Shield size={12} className="text-emerald-500" />
                <span>Pemerintah Desa Suka Banjar</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
