'use client';

import { useState } from 'react';
import { Navigation, MapPin, ExternalLink } from 'lucide-react';

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  imageUrl?: string | null;
}

interface GoogleMapProps {
  facilities: FacilityItem[];
}

const DEFAULT_CENTER = { lat: -5.5864, lng: 105.5074 };

export default function InteractiveGoogleMap({ facilities }: GoogleMapProps) {
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);

  const getMapEmbedUrl = () => {
    if (selectedFacility) {
      return `https://www.google.com/maps?q=${selectedFacility.latitude},${selectedFacility.longitude}&z=17&output=embed`;
    }
    return `https://www.google.com/maps?q=${DEFAULT_CENTER.lat},${DEFAULT_CENTER.lng}&z=15&output=embed`;
  };

  const getGoogleMapsDirectionUrl = (fac: FacilityItem) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`;
  };

  const getGoogleMapsSearchUrl = (fac: FacilityItem) => {
    return `https://www.google.com/maps/search/?api=1&query=${fac.latitude},${fac.longitude}`;
  };

  return (
    <div className="space-y-6">
      {/* Google Maps Embed iframe */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
        <iframe
          className="w-full aspect-[16/9] md:aspect-[21/9] z-10 block"
          src={getMapEmbedUrl()}
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Google Maps Desa Suka Banjar"
        />

        {/* Selected Facility Info Bar Overlay */}
        {selectedFacility && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedFacility.imageUrl && (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                  <img
                    src={selectedFacility.imageUrl}
                    alt={selectedFacility.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#0086C9] bg-[#0086C9]/10 px-2 py-0.5 rounded-md mb-1">
                  {selectedFacility.category}
                </span>
                <h4 className="font-heading font-extrabold text-sm text-slate-900 truncate leading-tight">
                  {selectedFacility.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {selectedFacility.address || 'Desa Suka Banjar, Kec. Sidomulyo'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={getGoogleMapsSearchUrl(selectedFacility)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <ExternalLink size={13} />
                <span>Lihat di Maps</span>
              </a>
              <a
                href={getGoogleMapsDirectionUrl(selectedFacility)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0086C9] hover:bg-[#006ca3] text-white font-bold text-xs transition-colors shadow-md"
              >
                <Navigation size={13} />
                <span>Petunjuk Arah</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Quick Facility Pin Selector Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedFacility(null)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !selectedFacility
              ? 'bg-[#0086C9] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MapPin size={13} />
          <span>Semua Lokasi</span>
        </button>
        {facilities.map((fac) => (
          <button
            key={fac.id}
            onClick={() => setSelectedFacility(fac)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
              selectedFacility?.id === fac.id
                ? 'bg-[#0086C9] text-white shadow-md scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#0086C9]/30'
            }`}
          >
            <MapPin size={11} />
            <span className="truncate max-w-[140px]">{fac.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
