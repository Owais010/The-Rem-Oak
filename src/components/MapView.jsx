import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in leaflet + webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createIcon = (color) =>
  new L.DivIcon({
    className: 'custom-marker',
    html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });

const mainIcon = createIcon('#0EA5E9');
const transportIcon = createIcon('#10B981');
const shopIcon = createIcon('#8B5CF6');
const foodIcon = createIcon('#F97316');

// Nearby POIs (simulated — in production these would come from an API)
const generateNearbyPOIs = (lat, lng) => [
  { name: 'Bus Stop', type: 'transport', lat: lat + 0.003, lng: lng + 0.002, icon: transportIcon },
  { name: 'Railway Station', type: 'transport', lat: lat - 0.005, lng: lng + 0.008, icon: transportIcon },
  { name: 'Auto Stand', type: 'transport', lat: lat + 0.002, lng: lng - 0.003, icon: transportIcon },
  { name: 'Local Market', type: 'shopping', lat: lat - 0.002, lng: lng + 0.004, icon: shopIcon },
  { name: 'Souvenir Shop', type: 'shopping', lat: lat + 0.004, lng: lng - 0.002, icon: shopIcon },
  { name: 'Restaurant', type: 'food', lat: lat - 0.003, lng: lng - 0.004, icon: foodIcon },
  { name: 'Street Food Lane', type: 'food', lat: lat + 0.001, lng: lng + 0.006, icon: foodIcon },
];

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

export default function MapView({ latitude, longitude, name }) {
  if (!latitude || !longitude) return null;

  const nearbyPOIs = generateNearbyPOIs(latitude, longitude);

  return (
    <div>
      <div className="map-container">
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={latitude} lng={longitude} />

          {/* Main location marker */}
          <Marker position={[latitude, longitude]} icon={mainIcon}>
            <Popup>
              <strong>{name}</strong>
              <br />
              <small>Main Location</small>
            </Popup>
          </Marker>

          {/* Nearby POIs */}
          {nearbyPOIs.map((poi, i) => (
            <Marker key={i} position={[poi.lat, poi.lng]} icon={poi.icon}>
              <Popup>
                <strong>{poi.name}</strong>
                <br />
                <small style={{ textTransform: 'capitalize' }}>{poi.type}</small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#0EA5E9' }} />
          Location
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#10B981' }} />
          Transport
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#8B5CF6' }} />
          Shopping
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#F97316' }} />
          Food & Dining
        </div>
      </div>
    </div>
  );
}
