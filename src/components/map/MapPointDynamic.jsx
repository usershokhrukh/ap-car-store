import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./map.modules.scss";

const ProductMap = dynamic(() => import("./MapPoint"), {
  ssr: false,
  loading: () => <div className="map__loading"></div>,
});

export default function MapViewLocate({ data, setMapData, mapData, mapClass}) {

  const handleLocationChange = (lat, lng) => {
    setMapData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  return (
    <div className="map__container">      
      <ProductMap mapClass={mapClass} data={data} onLocationChange={handleLocationChange} mapData={mapData} />
    </div>
  );
}
