import dynamic from "next/dynamic";
import "./map.modules.scss";

const ProductMap = dynamic(() => import("../map/Map"), {
  ssr: false,
  loading: () => <div className="map__loading"></div>,
});

export default function MapView({data}) {
  return <ProductMap data={data} />;
}
