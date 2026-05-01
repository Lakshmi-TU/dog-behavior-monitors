// src/components/LiveMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, memo } from "react";
import { useApp } from "../context/AppContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon   from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const RISK_PIN = {
  high:   { border: "#ff3d3d", bg: "rgba(255,61,61,0.25)",  shadow: "rgba(255,61,61,0.4)"  },
  medium: { border: "#ffd740", bg: "rgba(255,215,64,0.20)", shadow: "rgba(255,215,64,0.3)" },
  low:    { border: "#00e676", bg: "rgba(0,230,118,0.15)",  shadow: "rgba(0,230,118,0.25)" },
};

function FocusHandler() {
  const map = useMap();
  const { focusDog } = useApp();
  useEffect(() => {
    if (focusDog?.lat && focusDog?.lng) {
      map.flyTo([focusDog.lat, focusDog.lng], 19, { duration: 1.2 });
    }
  }, [focusDog, map]);
  return null;
}

// ✅ Auto-follow tracked dog
function TrackHandler({ trackedDog, dogs }) {
  const map = useMap();
  useEffect(() => {
    if (!trackedDog) return;
    const live = dogs.find((d) => d.id === trackedDog.id);
    if (live?.lat && live?.lng) {
      map.panTo([live.lat, live.lng], { animate: true, duration: 0.8 });
    }
  }, [dogs, trackedDog, map]);
  return null;
}

function LiveMap({ dogs }) {
  const { shockActive, trackedDog, pathHistory } = useApp();

  const trackedPath = trackedDog ? (pathHistory[trackedDog.id] ?? []) : [];

  if (!dogs || dogs.length === 0) {
    return <div className="rounded-xl p-4 text-gray-400">Loading map...</div>;
  }

  return (
    <div className="rounded-xl p-4 animate-fadeUp" style={{ background: "#111820", border: "1px solid #1e2d3d" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">
          📍 Live Location
          {trackedDog && (
            <span style={{ color: '#00e676', marginLeft: 8, fontWeight: 400, fontSize: 10 }}>
              · tracking {trackedDog.name}
            </span>
          )}
        </h3>
        <span
          className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
          style={{ background: "rgba(255,61,61,0.12)", border: "1px solid rgba(255,61,61,0.3)", color: "#ff3d3d" }}
        >
          ● LIVE
        </span>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ height: 260, border: "1px solid #1e2d3d" }}>
        <MapContainer center={[10.0704, 76.3680]} zoom={17} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FocusHandler />
          <TrackHandler trackedDog={trackedDog} dogs={dogs} />

          {/* ✅ Path polyline */}
          {trackedPath.length > 1 && (
            <Polyline
              positions={trackedPath}
              pathOptions={{
                color:     '#00b8d9',
                weight:    3,
                opacity:   0.85,
                dashArray: '6 4',
              }}
            />
          )}

          {/* Markers */}
          {dogs.map((dog) => {
            if (!dog?.lat || !dog?.lng) return null;
            const rp      = RISK_PIN[dog.risk] || RISK_PIN.low;
            const isShock = shockActive === dog.id;
            const isReal  = dog.source === "real";
            const isTracked = trackedDog?.id === dog.id;

            return (
              <Marker
                key={dog.id}
                position={[dog.lat, dog.lng]}
                icon={L.divIcon({
                  className: "",
                  html: `
                    <div style="
                      width:30px; height:30px; border-radius:50%;
                      display:flex; align-items:center; justify-content:center;
                      font-size:15px;
                      background:${rp.bg};
                      border:${isTracked ? '3px solid #00b8d9' : `2px solid ${rp.border}`};
                      box-shadow:${
                        isShock   ? '0 0 20px red, 0 0 40px red' :
                        isTracked ? '0 0 14px #00b8d9, 0 0 28px #00b8d9':
                        isReal    ? '0 0 20px cyan' :
                                    `0 0 10px ${rp.shadow}`
                      };
                      transition:0.3s;
                    ">
                      ${dog.emoji || "🐕"}
                    </div>
                  `,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                })}
              >
                <Popup>
                  <b>{dog.name}</b><br />
                  ID: {dog.id}<br />
                  Risk: {dog.risk}<br />
                  R: {dog.r}<br />
                  Activity: {dog.activity}<br />
                  Battery: {dog.batt}%<br />
                  {isReal    && <span style={{ color: 'blue'    }}>● REAL DATA</span>}<br/>
                  {isTracked && <span style={{ color: '#00b8d9', }}>📡 TRACKING</span>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default memo(LiveMap);