import { Palmtree, MapPin, Navigation, Compass, Sparkles } from 'lucide-react';

export interface TourismItem {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
}

interface TourismCardGridProps {
  places: TourismItem[];
}

export default function TourismCardGrid({ places }: TourismCardGridProps) {
  if (!places || places.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {places.map((item) => {
        const mapsQuery = encodeURIComponent(`${item.title}, ${item.location}`);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

        return (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              {/* Image / Landscape Decorative Cover */}
              <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-primary-950 to-slate-800 flex flex-col items-center justify-center text-white/30 p-6 text-center">
                    <Palmtree size={56} className="text-emerald-400/40 mb-2" />
                    <span className="text-xs text-slate-400 font-medium">Pemandangan Alam Suka Banjar</span>
                  </div>
                )}

                {/* Location Badge Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-950/80 text-white backdrop-blur-md border border-white/10 shadow-md">
                    <MapPin size={13} className="text-emerald-400" />
                    {item.location}
                  </span>
                </div>

                {/* Tag Overlay */}
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500 text-slate-950 shadow-md">
                    <Sparkles size={12} />
                    Gratis / Terbuka Publik
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors font-heading">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Access Info */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Compass size={14} className="text-primary-500" />
                    Akses Kendaraan Motor & Mobil
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Route Button */}
            <div className="p-6 sm:p-7 pt-0">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md"
              >
                <Navigation size={16} />
                Petunjuk Rute Lokasi (Google Maps)
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
