import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ complaints = [], onMapClick, interactive = false }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([28.6139, 77.2090], 13); // Default to Delhi for demo

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      if (interactive && onMapClick) {
        mapInstance.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onMapClick({ lat: lat.toFixed(4), lng: lng.toFixed(4) });
        });
      }

      // Automatically try to get the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstance.current.setView([latitude, longitude], 14);
            
            // Add blue dot for where you are exactly
            L.circleMarker([latitude, longitude], {
              radius: 8,
              fillColor: '#3b82f6', // Blue color
              color: '#ffffff', // White border
              weight: 3,
              opacity: 1,
              fillOpacity: 1
            }).addTo(mapInstance.current).bindPopup("You are here");

            // Optionally update the form's default coords if it's the interactive map
            if (interactive && onMapClick) {
              onMapClick({ lat: latitude.toFixed(4), lng: longitude.toFixed(4) });
            }
          },
          (error) => {
            console.warn("Geolocation not enabled/allowed, falling back to default.", error);
          }
        );
      }
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add markers for complaints
    complaints.forEach(c => {
      if (c.coords) {
        const marker = L.marker([c.coords.lat, c.coords.lng]).addTo(mapInstance.current);
        marker.bindPopup(`
          <strong>${c.type}</strong><br/>
          Status: ${c.status}<br/>
          Location: ${c.location}
        `);
      }
    });

    return () => {
      // Clean up on unmount if needed
    };
  }, [complaints, interactive, onMapClick]);

  return (
    <div className="map-wrapper glass-card">
      <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }} />
      <style jsx>{`
        .map-wrapper {
          height: 300px;
          width: 100%;
          padding: 0 !important;
          overflow: hidden;
          z-index: 1;
        }
        .leaflet-container {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
