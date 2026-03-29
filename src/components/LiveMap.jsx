// ─────────────────────────────────────────────
// REAL MAP VERSION (FINAL CLEAN VERSION)
// ─────────────────────────────────────────────

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 🎯 Risk styles
const RISK_PIN = {
  high:   { border: '#ff3d3d', bg: 'rgba(255,61,61,0.25)',   shadow: 'rgba(255,61,61,0.4)' },
  medium: { border: '#ffd740', bg: 'rgba(255,215,64,0.20)',  shadow: 'rgba(255,215,64,0.3)' },
  low:    { border: '#00e676', bg: 'rgba(0,230,118,0.15)',   shadow: 'rgba(0,230,118,0.25)' },
};

// 🚀 Focus handler (SMOOTH)
function FocusHandler() {
  const map = useMap();
  const { focusDog } = useApp();

  useEffect(() => {
    if (focusDog) {
      map.flyTo([focusDog.lat, focusDog.lng], 19, {
        duration: 1.5,
      });
    }
  }, [focusDog]);

  return null;
}

export default function LiveMap({ dogs }) {
  const { shockActive } = useApp();

  return (
    <div
      className="rounded-xl p-4 animate-fadeUp"
      style={{ background: "#111820", border: "1px solid #1e2d3d" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-heading text-white font-bold text-[13px] uppercase tracking-[1px]">
          📍 Live Location
        </h3>
        <span
          className="font-mono-sg text-[9px] px-2 py-0.5 rounded-sm tracking-[1px]"
          style={{
            background: "rgba(255,61,61,0.12)",
            border: "1px solid rgba(255,61,61,0.3)",
            color: "#ff3d3d",
          }}
        >
          ● LIVE
        </span>
      </div>

      {/* Map */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ height: 260, border: "1px solid #1e2d3d" }}
      >
        <MapContainer
          center={[10.0704, 76.3680]}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🔥 Focus */}
          <FocusHandler />

          {/* 🐕 Markers */}
          {dogs.map((dog) => {
            const rp = RISK_PIN[dog.risk];
            const isShock = shockActive === dog.id;

            return (
              <Marker
                key={dog.id}
                position={[dog.lat, dog.lng]}
                icon={L.divIcon({
                  className: "",
                  html: `
                    <div style="
                      width:28px;
                      height:28px;
                      border-radius:50%;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      font-size:14px;
                      background:${rp.bg};
                      border:2px solid ${rp.border};
                      box-shadow:${isShock 
                        ? "0 0 25px red, 0 0 50px red"
                        : `0 0 12px ${rp.shadow}`};
                      animation:${isShock ? "pulse 1s infinite" : "none"};
                    ">
                      ${dog.emoji}
                    </div>
                  `,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                })}
              >
                {/* ✅ FIXED JSX (IMPORTANT) */}
                <Popup>
                  <b>{dog.name}</b><br />
                  R: {dog.r}<br />
                  Status: {dog.risk}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}