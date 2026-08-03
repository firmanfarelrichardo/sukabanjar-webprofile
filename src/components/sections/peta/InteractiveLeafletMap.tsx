'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Building2, School, HeartPulse, HeartHandshake, ShoppingBag } from 'lucide-react';

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  imageUrl?: string | null;
}

interface LeafletMapProps {
  facilities: FacilityItem[];
  center?: [number, number];
  zoom?: number;
}

// Map center default Desa Suka Banjar (Sidomulyo, Lampung Selatan)
const DEFAULT_CENTER: [number, number] = [-5.5562, 105.4718];

// Helper function untuk generate custom HTML DivIcon Leaflet dengan SVG Vektor Profesional (Bebas Emoticon)
function createCustomIcon(category: string) {
  let bgColor = 'bg-slate-800';
  let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

  switch (category) {
    case 'Pemerintahan':
      bgColor = 'bg-emerald-600';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
      break;
    case 'Pendidikan':
      bgColor = 'bg-blue-600';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4-8 4z"/><path d="m18 10 4 2v6"/><path d="M6 11.5v6.5c0 1 2.5 3 6 3s6-2 6-3v-6.5"/></svg>`;
      break;
    case 'Kesehatan':
      bgColor = 'bg-rose-600';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z"/></svg>`;
      break;
    case 'Ibadah':
      bgColor = 'bg-amber-600';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
      break;
    case 'Ekonomi':
      bgColor = 'bg-purple-600';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
      break;
    default:
      bgColor = 'bg-slate-700';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center shadow-xl border-2 border-white transform hover:scale-115 transition-transform duration-200">
        ${svgIcon}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

export default function InteractiveLeafletMap({
  facilities,
  center = DEFAULT_CENTER,
  zoom = 14,
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[450px] bg-slate-900 animate-pulse flex flex-col items-center justify-center text-slate-500 rounded-3xl">
        <MapPin size={32} className="text-primary-500 animate-bounce mb-2" />
        <span className="text-xs font-semibold">Memuat Peta Interaktif Desa...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[450px] z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {facilities.map((fac) => (
          <Marker
            key={fac.id}
            position={[fac.latitude, fac.longitude]}
            icon={createCustomIcon(fac.category)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 max-w-xs space-y-2 text-slate-900">
                {fac.imageUrl && (
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-100 text-primary-800 uppercase tracking-wider mb-1">
                    {fac.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 font-heading leading-tight">
                    {fac.name}
                  </h4>
                  {fac.address && (
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                      {fac.address}
                    </p>
                  )}
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${fac.latitude},${fac.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white font-bold text-xs hover:bg-primary-500 transition-colors w-full justify-center mt-2 shadow-sm"
                >
                  <Navigation size={13} />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
