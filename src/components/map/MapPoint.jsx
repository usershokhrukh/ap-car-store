"use client";

import {useEffect, useMemo, useRef} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "./map.modules.scss";
import {useNotify} from "@/hooks/useNotify";

const svgIcon = L.divIcon({
  html: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path></svg>
  `,
  className: "map__svg-container",
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -35],
});

function MapController({center}) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map?.invalidateSize();
      map?.closePopup();

      setTimeout(() => {
        map?.setView(center, map.getZoom(), {animate: true});
        map?.panTo(center, {animate: true});
      }, 50);
    }
  }, [center, map]);

  return null;
}

function MapInteractionHandlers({onLocationSelect}) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function ProductMapLocate({data, onLocationChange, mapData, mapClass}) {
  const markerRef = useRef(null);
  const position = [mapData?.latitude, mapData?.longitude];

  const {notice} = useNotify();
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker && onLocationChange) {
          const latLng = marker.getLatLng();
          onLocationChange(latLng.lat, latLng.lng);
        }
      },
    }),
    [onLocationChange],
  );

  const locateUser = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      notice({
        text: "Geolocation is not supported by your browser environment.",
        status: "error",
        time: 5000,
      });
      return;
    }

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      notice({
        text: "Browser blocked location lookup: Geolocation requires an HTTPS network connection or local development server.",
        status: "error",
        time: 5000,
      });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (onLocationChange) {
          onLocationChange(pos.coords.latitude, pos.coords.longitude);
        }
      },
      (err) => {
        notice({
          text: `Could not get position: ${err.message}. Please click manually on the map.`,
          status: "error",
          time: 5000,
        });
      },
      {enableHighAccuracy: true, timeout: 8000},
    );
  };

  return (
    <div className={`map__wrapper ${mapClass ? mapClass : ""}`}>
      <button type="button" onClick={locateUser} className="map__geo-btn">
        <span className="map__span">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11 5.07089C7.93431 5.5094 5.5094 7.93431 5.07089 11H7V13H5.07089C5.5094 16.0657 7.93431 18.4906 11 18.9291V17H13V18.9291C16.0657 18.4906 18.4906 16.0657 18.9291 13H17V11H18.9291C18.4906 7.93431 16.0657 5.5094 13 5.07089V7H11V5.07089ZM3.05493 11C3.51608 6.82838 6.82838 3.51608 11 3.05493V1H13V3.05493C17.1716 3.51608 20.4839 6.82838 20.9451 11H23V13H20.9451C20.4839 17.1716 17.1716 20.4839 13 20.9451V23H11V20.9451C6.82838 20.4839 3.51608 17.1716 3.05493 13H1V11H3.05493ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"></path>
          </svg>
        </span>
      </button>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          maxZoom={20}
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
          {data ? (
            <Popup disableAutoPan={true}>
              <div className="map__pop-box">
                <strong>{data?.city}</strong>
                {data?.address ? <p>Address: {data?.address}</p> : null}
                {data?.suggestedName ? <p>Suggested name: {data?.suggestedName}</p> : null}
                {data?.displayName ? <p>Name: {data?.displayName}</p> : null}
                {data?.pickupPointsCount ? <p>Pickup point count: {data?.pickupPointsCount}</p> : null}
                {data?.latitude ? <p>latitude: {data?.latitude}</p> : null}
                {data?.longitude ? <p>longitude: {data?.longitude}</p> : null}
              </div>
            </Popup>
          ) : null}
        </Marker>
      </MapContainer>
    </div>
  );
}
