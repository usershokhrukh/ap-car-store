import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./map.modules.scss";

const ProductMap = dynamic(() => import("./MapPoint"), {
  ssr: false,
  loading: () => <div className="map__loading"></div>,
});

export default function MapViewLocate({ data, setMapData, mapData, mapClass}) {

  const CITIES_PRESETS = {
    tashkent: [41.311081, 69.240562],
    samarkand: [39.654167, 66.959722],
    bukhara: [39.774722, 64.428611],
  };

  const handleLocationChange = (lat, lng) => {
    setMapData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleCitySelect = (e) => {
    const selectedCity = e.target.value;
    const coords = CITIES_PRESETS[selectedCity];
    
    if (coords) {
      setMapState(prev => ({
        ...prev,
        city: selectedCity,
        latitude: coords[0],
        longitude: coords[1]
      }));
    } else {
      setMapState(prev => ({ ...prev, city: selectedCity }));
    }
  };

  return (
    <div className="map__container">      
      <ProductMap mapClass={mapClass} data={data} onLocationChange={handleLocationChange} mapData={mapData} />
    </div>
  );
}
