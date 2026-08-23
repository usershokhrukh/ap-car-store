import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./map.modules.scss";

const ProductMap = dynamic(() => import("../map/MapPoint"), {
  ssr: false,
  loading: () => <div className="map__loading"></div>,
});

export default function MapViewLocate({ data }) {
  const [mapState, setMapState] = useState({
    latitude: data?.latitude || 41.311081,
    longitude: data?.longitude || 69.240562,
    city: data?.city || "",
    name: data?.name || "New Pickup Point",
    address: data?.address || "",
    opensAt: data?.opensAt || "09:00",
    closesAt: data?.closesAt || "20:00",
    phone: data?.phone || ""
  });

  useEffect(() => {
    if (data) {
      setMapState(prev => ({
        ...prev,
        latitude: data.latitude || prev.latitude,
        longitude: data.longitude || prev.longitude,
        city: data.city || prev.city,
        name: data.name || prev.name,
        address: data.address || prev.address,
        opensAt: data.opensAt || prev.opensAt,
        closesAt: data.closesAt || prev.closesAt,
        phone: data.phone || prev.phone
      }));
    }
  }, [data]);

  const CITIES_PRESETS = {
    tashkent: [41.311081, 69.240562],
    samarkand: [39.654167, 66.959722],
    bukhara: [39.774722, 64.428611],
  };

  const handleLocationChange = (lat, lng) => {
    setMapState(prev => ({
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
      <div className="map__controls">
        <select 
          onChange={handleCitySelect} 
          className="map__city-select" 
          value={mapState.city?.toLowerCase() || ""}
        >
          <option value="">-- Choose Target City --</option>
          <option value="tashkent">Tashkent</option>
          <option value="samarkand">Samarkand</option>
          <option value="bukhara">Bukhara</option>
        </select>
      </div>
      
      <ProductMap data={mapState} onLocationChange={handleLocationChange} />
    </div>
  );
}
