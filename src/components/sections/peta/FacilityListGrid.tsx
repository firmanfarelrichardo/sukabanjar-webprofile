'use client';

import { Navigation, MapPin, ExternalLink } from 'lucide-react';
import { CATEGORY_ICONS, MapCategory } from './MapFilterBar';

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  imageUrl?: string | null;
}

interface FacilityListGridProps {
  facilities: FacilityItem[];
}

export default function FacilityListGrid({ facilities }: FacilityListGridProps) {
  if (!facilities || facilities.length === 0) return null;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="font-heading font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
          <MapPin size={22} className="text-[#0086C9]" />
          Daftar Tempat & Fasilitas Terdaftar
        </h3>
        <span className="text-xs text-[#0086C9] font-extrabold bg-[#0086C9]/10 px-3.5 py-1 rounded-full border border-[#0086C9]/20">
          {facilities.length} Lokasi
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((item) => {
          const Icon = CATEGORY_ICONS[item.category as MapCategory] || MapPin;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;
          const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-[#0086C9]/40 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* GAMBAR PREVIEW FASILITAS DI PUBLIK */}
              <div className="block aspect-[16/10] w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category Badge Overlay */}
                <span className="absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 rounded-xl bg-[#0086C9] text-white shadow-md uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Card Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0086C9]/10 text-[#0086C9] flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <h4 className="font-heading font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed pl-10 line-clamp-2">
                    {item.address || 'Desa Suka Banjar, Kec. Sidomulyo'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>Lihat di Maps</span>
                  </a>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0086C9] hover:bg-[#006ca3] text-white text-xs font-extrabold transition-colors shadow-md"
                  >
                    <Navigation size={13} />
                    <span>Petunjuk Arah</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
