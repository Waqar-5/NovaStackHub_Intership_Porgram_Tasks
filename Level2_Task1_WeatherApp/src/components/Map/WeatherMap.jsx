import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useWeather } from '@/hooks/useWeather';
import { Navigation } from 'lucide-react';
// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// Component to handle map centering when coordinates change
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 10, { duration: 1.5 });
    }, [center, map]);
    return null;
};
export const WeatherMap = () => {
    const { current } = useWeather();
    if (!current.data)
        return null;
    const lat = current.data.coord.lat;
    const lon = current.data.coord.lon;
    const position = [lat, lon];
    return (<div className="mt-8 glass-panel overflow-hidden border border-white/10 relative h-[400px]">
      <div className="absolute top-4 left-4 z-[400] bg-background/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
        <Navigation className="w-4 h-4 text-primary"/>
        <span className="font-semibold tracking-wider text-sm text-foreground">LIVE RADAR</span>
      </div>
      
      <MapContainer center={position} zoom={10} scrollWheelZoom={false} className="w-full h-full z-0">
        <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"/>
        <MapUpdater center={position}/>
        <Marker position={position}>
          <Popup className="custom-popup">
            <div className="font-bold text-lg">{current.data.name}</div>
            <div className="text-sm">{Math.round(current.data.main.temp)}° - {current.data.weather[0].description}</div>
          </Popup>
        </Marker>
      </MapContainer>

      <style>{`
        .leaflet-container {
          background: transparent;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.9);
        }
      `}</style>
    </div>);
};
