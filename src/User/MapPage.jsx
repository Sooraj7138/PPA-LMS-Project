import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

/* 🔹 Reusable WMS Layer Component */
function WMSLayer({ layerName, opacity = 0.8, zIndex = 1000 }) {
  const map = useMap();

  useEffect(() => {
    const baseUrl = "/geoserver/wms"; // Using Vite proxy

    const layer = L.tileLayer.wms(baseUrl, {
      layers: layerName,
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "PPA GeoServer",
      opacity,
      zIndex,
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, layerName, opacity, zIndex]);

  return null;
}

function ClickHandler({ setFeatureInfo }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = async (e) => {
      const { lat, lng } = e.latlng;
      const point = map.latLngToContainerPoint(e.latlng);
      const size = map.getSize();
      const bbox = map.getBounds().toBBoxString();
      const zoom = map.getZoom();

      const url = `/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS=Paradip:boundary&LAYERS=Paradip:boundary&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.floor(point.x)}&Y=${Math.floor(point.y)}&SRS=EPSG:4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setFeatureInfo(data.features[0].properties);
        } else {
          setFeatureInfo(null);
        }
      } catch (error) {
        console.error("Error fetching feature info:", error);
      }
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, setFeatureInfo]);

  return null;
}

export default function MapPage() {
  const [featureInfo, setFeatureInfo] = useState(null);
  const paradipBounds = [
    [20.2, 86.65],
    [20.3, 86.75],
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">EOI Map</h3>

      <div style={{ height: "80vh", width: "100%" }}>
        <MapContainer
          key="paradip-map"
          center={[20.2649, 88.6935]}
          zoom={10}
          minZoom={14}
          maxZoom={19}
          maxBounds={paradipBounds}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Base OSM */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🔹 Add Layers Separately Below */}

          <WMSLayer layerName="Paradip:traffic_plots" />

          {/* You can safely add more one by one */}
          {<WMSLayer layerName="Paradip:boundary" /> }
          { <WMSLayer layerName="Paradip:green_belt" /> }
          { <WMSLayer layerName="Paradip:lease" /> }
          {<WMSLayer layerName="Paradip:license" /> }
          {<WMSLayer layerName="Paradip:market" />}
          {<WMSLayer layerName="Paradip:market_location" /> }
          {<WMSLayer layerName="Paradip:nala" /> }
          {<WMSLayer layerName="Paradip:quarters" /> }
          {<WMSLayer layerName="Paradip:rev_boundary" /> }
          {<WMSLayer  layerName="Paradip:traffic_busstop" /> }
          {<WMSLayer  layerName="Paradip:traffic_coastline" /> }
          {<WMSLayer  layerName="Paradip:traffic_road" /> }
          {<WMSLayer  layerName="Paradip:traffic_railway" /> }
          {<WMSLayer  layerName="Paradip:traffic_drain" /> }
          {<WMSLayer  layerName="Paradip:traffic_htline" /> }
          {<WMSLayer  layerName="Paradip:traffic_pipeline" /> }
          {<WMSLayer  layerName="Paradip:traffic_htline" /> }
          {<WMSLayer  layerName="Paradip:traffic_row" /> }
          {<WMSLayer  layerName="Paradip:vacant_land" /> }
          {<WMSLayer  layerName="Paradip:village" /> }
          {<WMSLayer  layerName="Paradip:water_area" /> }
          
          <ClickHandler setFeatureInfo={setFeatureInfo} />
        </MapContainer>
      </div>
      
      {/* Feature info for clicked location */}
      {featureInfo && (
        <div className="mt-4 p-4 bg-white border rounded shadow">
          <h4 className="font-bold mb-2">Boundary Info:</h4>
          {Object.entries(featureInfo).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-semibold">{key}:</span> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}