'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for broken default marker icons in Leaflet when used with Next.js/Webpack
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cloudflare.com',
  shadowUrl: 'https://cloudflare.com',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to dynamically pan/zoom the map view when coordinates change
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function Map({ city, latitude, longitude }) {
  const [coordinates, setCoordinates] = useState([48.8667, 2.3333]); // Default: Paris
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scenario A: If direct coordinates are passed
    if (latitude && longitude) {
      setCoordinates([latitude, longitude]);
    } 
    // Scenario B: If a city name is passed, convert it to coordinates (Geocoding)
    else if (city) {
      setLoading(true);
      fetch(`https://openstreetmap.org{encodeURIComponent(city)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch((err) => console.error("Geocoding failed:", err))
        .finally(() => setLoading(false));
    }
  }, [city, latitude, longitude]);

  if (loading) return <div className="p-4 text-center">Loading map coordinates...</div>;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 relative">
      <MapContainer 
        center={coordinates} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates} icon={customIcon}>
          <Popup>
            {city ? `City: ${city}` : `Coordinates: ${coordinates[0]}, ${coordinates[1]}`}
          </Popup>
        </Marker>
        <ChangeMapView center={coordinates} />
      </MapContainer>
    </div>
  );
}
