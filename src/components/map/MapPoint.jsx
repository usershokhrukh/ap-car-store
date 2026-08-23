"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./map.modules.scss";

const svgIcon = L.divIcon({
  html: `
    <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor"><path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15ZM12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13Z"></path></svg>
  `,
  className: "map__svg-container",
  iconSize: [45, 45],
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -40],
});

function MapController({ center }) {
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

function MapInteractionHandlers({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function ProductMapLocate({ data, onLocationChange }) {
  const markerRef = useRef(null);
  const position = [data.latitude, data.longitude];

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker && onLocationChange) {
        const latLng = marker.getLatLng();
        onLocationChange(latLng.lat, latLng.lng);
      }
    },
  }), [onLocationChange]);

  const locateUser = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser environment.");
      return;
    }

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      alert("Browser blocked location lookup: Geolocation requires an HTTPS network connection or local development server.");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (onLocationChange) {
          onLocationChange(pos.coords.latitude, pos.coords.longitude);
        }
      },
      (err) => {
        console.error("Geolocation tracking failed:", err);
        alert(`Could not get position: ${err.message}. Please click manually on the map.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="map__wrapper">
      <button
        type="button"
        onClick={locateUser}
        className="map__geo-btn"
      >
        📍 Locate Me
      </button>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={position} />
        <MapInteractionHandlers onLocationSelect={onLocationChange} />

        <Marker 
          position={position} 
          icon={svgIcon}
          draggable={true}
          eventHandlers={eventHandlers}
          ref={markerRef}
        >
          <Popup disableAutoPan={true}>
            <div className="map__pop-box">
              <strong>{data.name}</strong>
              <br />
              {data.address}
              {data.city ? `, ${data.city}` : ""}
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
