import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const createCustomIcon = (color, type = 'bin') => {
  let html = '';
  
  if (type === 'truck') {
    html = `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5); border: 2px solid white; z-index: 1000;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-9h-4v-3H10v12h3"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/></svg></div>`;
  } else if (type === 'facility') {
    html = `<div style="background-color: ${color}; width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(0,0,0,0.7); border: 2px solid white; z-index: 500;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-6h6v6"/></svg></div>`;
  } else {
    // defaults to 'bin'
    html = `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); z-index: 100;"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></div>`;
  }
  
  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: type === 'facility' ? [35, 35] : (type === 'truck' ? [30, 30] : [20, 20]),
    iconAnchor: type === 'facility' ? [17, 17] : (type === 'truck' ? [15, 15] : [10, 10]),
  });
};

const getColorForWasteType = (type) => {
  switch(type) {
    case 'wet': return '#10b981'; // green
    case 'dry': return '#3b82f6'; // blue
    case 'metal': return '#f59e0b'; // amber
    default: return '#6b7280';
  }
};

const FleetMap = ({ bins, trucks, facilities = [] }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      // Initialize view to Hyderabad
      mapInstance.current = L.map(mapRef.current).setView([17.3850, 78.4867], 13);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(mapInstance.current);
      layerGroupRef.current = L.layerGroup().addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !layerGroupRef.current) return;
    
    // Clear old layers
    layerGroupRef.current.clearLayers();

    // 1. Draw Routes (OSRM Paths)
    trucks.forEach(truck => {
      if (truck.currentPath && truck.currentPath.length > 0) {
        const polylineCoords = [
          [truck.lat, truck.lng], // Start exactly where truck is right now
          ...truck.currentPath.map(p => [p.lat, p.lng])
        ];

        L.polyline(polylineCoords, {
          color: getColorForWasteType(truck.type),
          weight: 4,
          opacity: 0.8,
          // Removed dashes to look like solid road navigation paths
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(layerGroupRef.current);
      }
    });

    // 2. Draw Facilities (Dumpyards / Recycling)
    facilities.forEach(fac => {
      const isDump = fac.type === 'dumpyard';
      const marker = L.marker([fac.lat, fac.lng], {
        icon: createCustomIcon(isDump ? '#ef4444' : '#8b5cf6', 'facility')
      }).addTo(layerGroupRef.current);
      
      marker.bindPopup(`
        <div style="text-align: center;">
          <strong style="color: ${isDump ? '#ef4444' : '#8b5cf6'}">${fac.name}</strong><br/>
          Type: ${fac.type.toUpperCase()}<br/>
          Accepts: ${fac.accept.join(', ').toUpperCase()}
        </div>
      `);
    });

    // 3. Draw Bins
    bins.forEach(bin => {
      const color = getColorForWasteType(bin.type);
      const isCritical = bin.priority === 'high';
      
      const marker = L.marker([bin.lat, bin.lng], {
        icon: createCustomIcon(isCritical ? '#ef4444' : color, 'bin')
      }).addTo(layerGroupRef.current);
      
      marker.bindPopup(`
        <div style="text-align: center;">
          <strong style="color: ${color}">Bin #${bin.id}</strong><br/>
          Type: ${bin.type.toUpperCase()}<br/>
          Priority: <span style="color: ${isCritical ? '#ef4444' : '#10b981'}">${bin.priority.toUpperCase()}</span>
        </div>
      `);
    });

    // 4. Draw Trucks
    trucks.forEach(truck => {
      const color = getColorForWasteType(truck.type);
      const marker = L.marker([truck.lat, truck.lng], {
        icon: createCustomIcon(color, 'truck'),
        zIndexOffset: 1000 // Ensure trucks are on top
      }).addTo(layerGroupRef.current);
      
      marker.bindTooltip(`
        <strong>Truck ${truck.id}</strong><br/>
        Type: ${truck.type.toUpperCase()}<br/>
        Capacity: ${Math.round(truck.capacity)}%<br/>
        Status: ${truck.status}
      `, { permanent: false, direction: 'top' });
    });

  }, [bins, trucks, facilities]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }} />
      <style jsx="true">{`
        .custom-leaflet-icon { background: none; border: none; }
      `}</style>
    </div>
  );
};

export default FleetMap;
