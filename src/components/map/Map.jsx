"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "./map.modules.scss"

const svgIcon = L.divIcon({
  html: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path></svg>
  `,
  className: "map-svg",
  // iconSize:,
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.invalidateSize();
      map.closePopup();
      
      setTimeout(() => {
        map.setView(center, map.getZoom(), { animate: true });
        map.panTo(center, { animate: true });
      }, 50);
    }
  }, [center, map]);
  return null;
}

export default function ProductMap({data}) {
  const position = [data.latitude, data.longitude];

  // Fixed Google Maps string parameters construction
  const openGoogleMapsDirections = () => {
    const queryTarget = data.latitude && data.longitude 
      ? `${data.latitude},${data.longitude}` 
      : encodeURIComponent(`${data.city || ""}, ${data.address || ""}`);
    
    const url = `https://google.com/maps/place/${queryTarget}`;
    window.open(url, "_blank");
  };

  return (
    <div className="map__wrapper">
      {/* Floating Action Buttons overlaid on top of the Map Layer */}
      <div className="map__floating-actions">
        <button 
          type="button" 
          onClick={openGoogleMapsDirections} 
          className="map__nav-btn map__nav-btn--google"
        >
          Google Route
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{width: "100%", height: "100%"}}
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />

        <ChangeMapView center={position} />

        <Marker position={position} icon={svgIcon}>
          <Popup disableAutoPan={true}>
            <div className="map__pop-box">
              <strong>{data.name}</strong>
              <br />
              {data.address}, {data.city}
              <br />
              Work schedule: {data.opensAt} - {data.closesAt}
              <br />
              Tel: {data.phone}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
