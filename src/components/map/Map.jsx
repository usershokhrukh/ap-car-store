"use client";

import {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet";
import "./map.modules.scss";
import {useGetGeoSearch} from "@/hooks/pickup/GET/GetGeoWithSearch";
import {useNotify} from "@/hooks/useNotify";

const svgIcon = L.divIcon({
  html: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path></svg>
  `,
  className: "map__svg-container",
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -35],
});

function ChangeMapView({center}) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map?.invalidateSize();
      map?.closePopup();

      setTimeout(() => {
        if (map) {
          map?.setView(center, map.getZoom(), {animate: true});
          map?.panTo(center, {animate: true});
        }
      }, 50);
    }
  }, [center, map]);
  return null;
}

export default function ProductMap({data: mapData}) {
  const [data, setData] = useState(null);

  const position = [data?.latitude || 0, data?.longitude || 0];

  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState(null);
  const {notice} = useNotify();
  const {
    data: location,
    error,
    isPending,
  } = useGetGeoSearch(`${search ? `?q=${search}` : ""}`);

  useEffect(() => {
    if (!mapData?.longitude || !mapData?.latitude) {
      if (mapData?.address) {
        setSearch(mapData?.address);
      } else if (mapData?.city) {
        setSearch(mapData?.city);
      } else {
        setIsError(true);
      }
    }
  }, [data]);

  useEffect(() => {
    if (location) {
      setData({
        ...mapData,
        ...location?.data,
      });
    }
  }, [location]);

  useEffect(() => {
    setData(mapData);
  }, [mapData]);
  useEffect(() => {
    if (error?.message) {
      notice({
        text: `While trying to get properties of the map data: ${error?.message}`,
        time: 5000,
        status: "error",
      });
    }
  }, [error]);
  const openGoogleMapsDirections = () => {
    const queryTarget =
      data?.latitude && data?.longitude
        ? `${data?.latitude || 0},${data?.longitude || 0}`
        : encodeURIComponent(`${data.city || ""}, ${data.address || ""}`);

    const url = `https://google.com/maps/place/${queryTarget}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (isError) {
      notice({
        text: "The location has not any properties to identify, could not get map! Please change location!",
        status: "error",
        time: 5000,
      });
    }
  }, [isError]);

  return (
    <div className="map__wrapper">
      {!isError && data && mapData ? (
        <>
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
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
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
        </>
      ) : isPending ? (
        <>Loading...</>
      ) : (
        <>The location has not any properties to identify, could not get map!</>
      )}
    </div>
  );
}
