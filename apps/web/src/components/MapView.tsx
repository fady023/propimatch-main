import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-cluster';

// Fix default icon URLs in bundlers
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export interface MapPoint {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

interface Props {
  points: MapPoint[];
  clustering?: boolean;
}

export function MapView({ points, clustering = true }: Props) {
  const center = points[0] ? [points[0].lat, points[0].lng] as [number, number] : [25.2048, 55.2708];
  const Markers = (
    <>
      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng] as [number, number]}>
          <Popup>{p.title}</Popup>
        </Marker>
      ))}
    </>
  );
  return (
    <div className="h-full w-full overflow-hidden">
      <MapContainer center={center} zoom={11} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {clustering ? <MarkerClusterGroup>{Markers}</MarkerClusterGroup> : Markers}
      </MapContainer>
    </div>
  );
}

