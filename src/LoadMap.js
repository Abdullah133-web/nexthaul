import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function LoadMap({ loads }) {
  // Center the map on USA
  const center = [39.8283, -98.5795];

  return (
    <MapContainer center={center} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {loads.map(load => (
        load.latitude && load.longitude && (
          <Marker key={load.id} position={[load.latitude, load.longitude]}>
            <Popup>
              <strong>{load.pickup_location} → {load.dropoff_location}</strong><br />
              Status: {load.status}<br />
              Rate: ${load.rate}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

export default LoadMap;
