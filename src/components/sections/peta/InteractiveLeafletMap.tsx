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

// Helper function untuk generate custom HTML DivIcon Leaflet
function createCustomIcon(category: string) {
  let bgColor = 'bg-slate-800';
  let iconHtml = '📍';

  switch (category) {
    case 'Pemerintahan':
      bgColor = 'bg-emerald-600';
      iconHtml = '🏛️';
      break;
    case 'Pendidikan':
      bgColor = 'bg-blue-600';
      iconHtml = '🏫';
      break;
    case 'Kesehatan':
      bgColor = 'bg-rose-600';
      iconHtml = '🏥';
      break;
    case 'Ibadah':
      bgColor = 'bg-amber-600';
      iconHtml = '🕌';
      break;
    case 'Ekonomi':
      bgColor = 'bg-purple-600';
      iconHtml = '🛍️';
      break;
    default:
      bgColor = 'bg-slate-700';
      iconHtml = '📍';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center text-sm shadow-xl border-2 border-white transform hover:scale-115 transition-transform duration-200">
        <span>${iconHtml}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function InteractiveLeafletMap({
  facilities,
  center = DEFAULT_CENTER,
  zoom = 15,
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <MapPin size={32} className="text-slate-400 animate-bounce" />
          <span>Memuat Peta Interaktif Desa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] sm:h-[550px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative z-10">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {facilities.map((fac) => {
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`;

          return (
            <Marker
              key={fac.id}
              position={[fac.latitude, fac.longitude]}
              icon={createCustomIcon(fac.category)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-2 max-w-[240px]">
                  {/* Photo if available */}
                  {fac.imageUrl && (
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}

                  {/* Category Badge */}
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                    {fac.category}
                  </span>

                  {/* Name */}
                  <h4 className="font-heading font-bold text-slate-900 text-sm leading-tight">
                    {fac.name}
                  </h4>

                  {/* Address */}
                  {fac.address && (
                    <p className="text-xs text-slate-500 leading-snug">
                      {fac.address}
                    </p>
                  )}

                  {/* Direct Navigation Button */}
                  <div className="pt-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold no-underline transition-colors shadow-sm"
                    >
                      <Navigation size={12} />
                      Petunjuk Arah (Google Maps)
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
