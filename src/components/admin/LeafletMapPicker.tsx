'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface LeafletMapPickerProps {
  latitude: number;
  longitude: number;
  onSelectLocation: (lat: number, lng: number) => void;
}

// Custom Leaflet pin marker
const customPinIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div class="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white transform hover:scale-115 transition-transform duration-200 animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Click handler sub-component inside MapContainer
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LeafletMapPicker({
  latitude,
  longitude,
  onSelectLocation,
}: LeafletMapPickerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-xs font-medium">
        Memuat Peta Pemilih Titik Lokasi...
      </div>
    );
  }

  const validLat = isNaN(latitude) || latitude === 0 ? -5.5864 : latitude;
  const validLng = isNaN(longitude) || longitude === 0 ? 105.5074 : longitude;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
        <span className="flex items-center gap-1 text-[#0086C9]">
          <MapPin size={14} /> Klik pada peta untuk memilih titik lokasi secara presisi
        </span>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {validLat.toFixed(5)}, {validLng.toFixed(5)}
        </span>
      </div>

      <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-300 shadow-inner relative">
        <MapContainer
          center={[validLat, validLng]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[validLat, validLng]} icon={customPinIcon} />
          <MapClickHandler onSelect={onSelectLocation} />
        </MapContainer>
      </div>
    </div>
  );
}
