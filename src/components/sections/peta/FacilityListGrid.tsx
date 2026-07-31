import { Navigation, MapPin } from 'lucide-react';
import { FacilityItem } from './InteractiveLeafletMap';
import { CATEGORY_ICONS, MapCategory } from './MapFilterBar';

interface FacilityListGridProps {
  facilities: FacilityItem[];
}

export default function FacilityListGrid({ facilities }: FacilityListGridProps) {
  if (!facilities || facilities.length === 0) return null;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="font-heading font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
          <MapPin size={22} className="text-primary-600" />
          Daftar Tempat & Fasilitas Terdaftar
        </h3>
        <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
          {facilities.length} Lokasi
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {facilities.map((item) => {
          const Icon = CATEGORY_ICONS[item.category as MapCategory] || MapPin;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-base mb-1">
                    {item.name}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {item.address || 'Desa Sukabanjar, Kec. Sidomulyo'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-primary-600 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Navigation size={13} />
                  Petunjuk Arah (Google Maps)
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
