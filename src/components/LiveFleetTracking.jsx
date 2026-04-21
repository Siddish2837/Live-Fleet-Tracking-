import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Truck, AlertTriangle, Battery, Navigation, CheckCircle2, Factory } from 'lucide-react';
import FleetMap from './FleetMap';

// Hyderabad region base coords
const BASE_LAT = 17.3850;
const BASE_LNG = 78.4867;

const generateMockBins = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `B${i + 100}`,
    lat: BASE_LAT + (Math.random() - 0.5) * 0.08, // Wider spread for Hyderabad
    lng: BASE_LNG + (Math.random() - 0.5) * 0.08,
    type: ['wet', 'dry', 'metal'][Math.floor(Math.random() * 3)],
    priority: Math.random() > 0.7 ? 'high' : (Math.random() > 0.4 ? 'medium' : 'low')
  }));
};

const FACILITIES = [
  { id: 'D-01', name: 'Jawaharnagar Dumpyard', type: 'dumpyard', lat: 17.4880, lng: 78.5830, accept: ['wet'] },
  { id: 'R-01', name: 'Bholakpur Recycling Unit', type: 'recycling', lat: 17.4100, lng: 78.4900, accept: ['dry', 'metal'] },
];

const generateMockTrucks = () => {
  return [
    { id: 'T-01', type: 'wet', lat: BASE_LAT + 0.02, lng: BASE_LNG + 0.02, capacity: 45, currentPath: [], targetId: null, status: 'idle', speed: 0.0006 },
    { id: 'T-02', type: 'dry', lat: BASE_LAT - 0.02, lng: BASE_LNG - 0.01, capacity: 80, currentPath: [], targetId: null, status: 'idle', speed: 0.0006 },
    { id: 'T-03', type: 'metal', lat: BASE_LAT + 0.01, lng: BASE_LNG - 0.02, capacity: 20, currentPath: [], targetId: null, status: 'idle', speed: 0.0006 }
  ];
};

// Euclidean distance
const getDistance = (lat1, lng1, lat2, lng2) => {
  const dx = lat1 - lat2;
  const dy = lng1 - lng2;
  return Math.sqrt(dx * dx + dy * dy);
};

const LiveFleetTracking = () => {
  const [bins, setBins] = useState(generateMockBins(20));
  const [trucks, setTrucks] = useState(generateMockTrucks());
  const [alerts, setAlerts] = useState([
    { id: 1, text: "OSRM Routing Engine Initialized. Loc: Hyderabad.", type: "info" }
  ]);
  
  // Refs to avoid stale closures in setTimeout/listeners
  const binsRef = useRef(bins);
  useEffect(() => { binsRef.current = bins; }, [bins]);

  const addAlert = useCallback((text, type = "info") => {
    setAlerts(prev => [{ id: Date.now(), text, type }, ...prev].slice(0, 5));
  }, []);

  // Fetch real road coordinates from OSRM
  const fetchOSRMRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      // OSRM expects Lng,Lat
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        // Return array of {lat, lng} points along the road
        return data.routes[0].geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }));
      }
    } catch (err) {
      console.error("OSRM Error", err);
    }
    // Fallback: straight line
    return [{ lat: endLat, lng: endLng }];
  };

  // Re-evaluate routes for idle trucks
  const assignRoutes = useCallback(async () => {
    setTrucks(currentTrucks => {
      const pendingUpdates = currentTrucks.map(async truck => {
        // Only assign if idle or has reached destination
        if (truck.currentPath.length > 0 || truck.status === 'moving') return truck;

        // If almost full, route to facility
        if (truck.capacity >= 90) {
          const facility = FACILITIES.find(f => f.accept.includes(truck.type));
          if (facility) {
             const path = await fetchOSRMRoute(truck.lat, truck.lng, facility.lat, facility.lng);
             addAlert(`Truck ${truck.id} full. Routing to ${facility.name}.`, "warning");
             return { ...truck, currentPath: path, targetId: facility.id, status: 'moving to facility' };
          }
           return truck;
        }

        // Find nearest matching bin
        const currentBins = binsRef.current;
        let matchingBins = currentBins.filter(b => b.type === truck.type);
        if (matchingBins.length === 0) return { ...truck, status: 'idle' };

        // Simple sorting: closer is better, high priority is better
        matchingBins.sort((a, b) => {
          const pA = a.priority === 'high' ? -0.05 : (a.priority === 'medium' ? -0.02 : 0);
          const pB = b.priority === 'high' ? -0.05 : (b.priority === 'medium' ? -0.02 : 0);
          const dA = getDistance(truck.lat, truck.lng, a.lat, a.lng) + pA;
          const dB = getDistance(truck.lat, truck.lng, b.lat, b.lng) + pB;
          return dA - dB;
        });

        const targetBin = matchingBins[0];
        const path = await fetchOSRMRoute(truck.lat, truck.lng, targetBin.lat, targetBin.lng);
        
        return { ...truck, currentPath: path, targetId: targetBin.id, status: 'moving to bin' };
      });

      Promise.all(pendingUpdates).then(resolvedTrucks => {
        // Only update state if something changed to avoid rapid looping
        const changed = resolvedTrucks.some((t, i) => t.targetId !== currentTrucks[i].targetId);
        if (changed) {
          setTrucks(resolvedTrucks);
        }
      });
      return currentTrucks;
    });
  }, [addAlert]);

  // Initial Check
  useEffect(() => {
    assignRoutes();
  }, [assignRoutes]);

  // Animation Loop: Move trucks along currentPath road segments
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(currentTrucks => {
        let triggerAssign = false;

        const updatedTrucks = currentTrucks.map(truck => {
          if (!truck.currentPath || truck.currentPath.length === 0) return truck;

          const nextPoint = truck.currentPath[0];
          const dist = getDistance(truck.lat, truck.lng, nextPoint.lat, nextPoint.lng);

          if (dist < truck.speed) {
            // Reached this road point segment
            const remainingPath = truck.currentPath.slice(1);
            
            if (remainingPath.length === 0) {
              // Reached FINAL destination (Bin or Facility)
              triggerAssign = true;
              
              if (truck.status === 'moving to bin') {
                // Collect internal state Bin
                setBins(prev => prev.filter(b => b.id !== truck.targetId));
                return {
                  ...truck,
                  lat: nextPoint.lat,
                  lng: nextPoint.lng,
                  currentPath: [],
                  targetId: null,
                  status: 'idle',
                  capacity: Math.min(100, truck.capacity + 20)
                };
              } else if (truck.status === 'moving to facility') {
                addAlert(`Truck ${truck.id} emptied at Facility.`, "info");
                return {
                  ...truck,
                  lat: nextPoint.lat,
                  lng: nextPoint.lng,
                  currentPath: [],
                  targetId: null,
                  status: 'idle',
                  capacity: 0 // Emptied
                };
              }
            }
            
            // Just move to the waypoint for now and continue next tick
            return {
              ...truck,
              lat: nextPoint.lat,
              lng: nextPoint.lng,
              currentPath: remainingPath
            };
          }

          // Interpolate position along the road segment
          const ratio = truck.speed / dist;
          const dx = nextPoint.lat - truck.lat;
          const dy = nextPoint.lng - truck.lng;

          return {
            ...truck,
            lat: truck.lat + dx * ratio,
            lng: truck.lng + dy * ratio
          };
        });

        if (triggerAssign) {
          setTimeout(assignRoutes, 100);
        }

        return updatedTrucks;
      });
    }, 1000); // 1 tick/second
    return () => clearInterval(interval);
  }, [assignRoutes, addAlert]);

  return (
    <div className="fleet-tracking-container animate-fade">
      <div className="fleet-sidebar glass-card">
        <div className="sidebar-header">
          <h2><Navigation size={20} className="primary-icon" /> Live Fleet Tracking</h2>
          <p>OSRM Real-Road Telemetry • Hyderabad</p>
        </div>

        <div className="fleet-list">
          <h3>Active Fleet</h3>
          {trucks.map(truck => (
            <div key={truck.id} className="fleet-card glass-card">
              <div className="fleet-card-header flex-between">
                <strong><Truck size={16} /> {truck.id}</strong>
                <span className={`badge type-${truck.type}`}>{truck.type.toUpperCase()}</span>
              </div>
              <div className="fleet-card-body">
                <div className="progress-group">
                  <div className="flex-between" style={{fontSize: '0.8rem', marginBottom: '4px'}}>
                    <span style={{color: 'var(--text-muted)'}}><Battery size={14} style={{verticalAlign: 'middle'}}/> Capacity</span>
                    <span className={truck.capacity >= 90 ? 'text-danger' : 'text-success'}>
                      {Math.round(truck.capacity)}%
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill ${truck.capacity >= 90 ? 'danger' : 'success'}`}
                      style={{width: `${truck.capacity}%`}}
                    />
                  </div>
                </div>
                
                <div className="route-info">
                  <span className="route-label">OSRM Route:</span> 
                  {truck.targetId ? (
                    <span className="route-destination">
                      {truck.status === 'moving to facility' ? 'Dumping at ' : 'Collecting '}
                      {truck.targetId} ({truck.currentPath?.length} road segments)
                    </span>
                  ) : (
                    <span className="route-idle">Idle / Routing...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="alerts-section">
          <h3><AlertTriangle size={16}/> System Alerts</h3>
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                {alert.type === 'warning' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                <span>{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fleet-map-container glass-card">
        <FleetMap bins={bins} trucks={trucks} facilities={FACILITIES} />
      </div>

      <style jsx="true">{`
        .fleet-tracking-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 1.5rem;
          height: calc(100vh - 8rem);
        }
        
        .fleet-sidebar {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          overflow-y: auto;
          background: rgba(15, 23, 42, 0.7);
        }

        .sidebar-header { margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; }
        .sidebar-header h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.4rem; color: #fff;}
        .sidebar-header p { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }

        .fleet-list h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-muted); font-weight: 500;}
        .fleet-list { flex: 1; }

        .fleet-card {
          padding: 1rem;
          margin-bottom: 1rem;
          background: rgba(255,255,255,0.02);
          border-left: 3px solid var(--success);
        }
        .fleet-card-header { margin-bottom: 1rem; }
        .fleet-card-header strong { display: flex; align-items: center; gap: 0.5rem; color: #fff; }
        .badge { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; letter-spacing: 0.5px;}
        .badge.type-wet { background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16,185,129,0.5); color: #10b981; }
        .badge.type-dry { background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59,130,246,0.5); color: #3b82f6; }
        .badge.type-metal { background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245,158,11,0.5); color: #f59e0b; }

        .progress-bar-bg { width: 100%; height: 6px; background: rgba(0,0,0,0.3); border-radius: 3px; overflow: hidden; }
        .progress-bar-fill { height: 100%; transition: width 0.3s ease; }
        .progress-bar-fill.success { background: var(--success); }
        .progress-bar-fill.danger { background: var(--danger, #ef4444); }
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger, #ef4444); }

        .route-info { margin-top: 1rem; font-size: 0.85rem; border-top: 1px dashed var(--border-glass); padding-top: 0.75rem; }
        .route-label { color: var(--text-muted); margin-right: 0.5rem; }
        .route-destination { color: #fff; font-weight: 500; }
        .route-idle { color: var(--warning); font-style: italic; }

        .alerts-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass); }
        .alerts-section h3 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: var(--text-muted); font-weight: 500; margin-bottom: 1rem; }
        .alert-item { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); margin-bottom: 0.5rem; line-height: 1.4; color: var(--text-muted); }
        .alert-item.info { border-left: 2px solid var(--primary); }
        .alert-item.warning { border-left: 2px solid var(--warning); color: #fff; }
        .alert-item.warning svg { color: var(--warning); min-width: 14px; margin-top: 2px;}
        .alert-item.info svg { color: var(--primary); min-width: 14px; margin-top: 2px;}

        .fleet-map-container {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          padding: 0 !important;
          border: 1px solid var(--border-glass);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LiveFleetTracking;
