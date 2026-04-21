import React from 'react';
import { MapPin, AlertCircle, Truck, Trash2, CheckCircle } from 'lucide-react';
import AdminPanel from './AdminPanel';

// ZoneAdminPanel conceptually extends the old AdminPanel 
// by providing specific ward metrics, and then displaying the classic map/bins admin view.

const ZoneAdminPanel = ({ complaints, updateComplaint }) => {
  const criticalBins = complaints.filter(c => c.status === 'Pending').length;

  return (
    <div className="zone-admin-view animate-fade">
      <div className="zone-header glass-card">
        <div className="zone-info">
          <h2>ZONE 4 — HITECH CITY WARD</h2>
          <div className="zone-stats">
            <span className="stat"><Trash2 size={16}/> Total Bins: 247</span>
            <span className="stat warning"><AlertCircle size={16}/> Critical: {criticalBins}</span>
            <span className="stat success"><Truck size={16}/> Trucks Active: 8</span>
            <span className="stat"><CheckCircle size={16}/> Compliance: 78%</span>
          </div>
        </div>
      </div>

      {/* Reuse the previously built AdminPanel structure for the map / bin management */}
      <h3 style={{margin: '2rem 0 1rem 0'}}>Zone 4 Infrastructure & Dispatch</h3>
      <div className="admin-wrapper">
        <AdminPanel complaints={complaints} updateComplaint={updateComplaint} cleanlinessScore={78} />
      </div>

      <style jsx>{`
        .zone-header {
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
          border-left: 4px solid var(--primary);
        }
        .zone-header h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }
        .zone-stats {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0,0,0,0.2);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .stat.warning { color: var(--warning); border: 1px solid rgba(251, 191, 36, 0.3); }
        .stat.success { color: var(--success); border: 1px solid rgba(74, 222, 128, 0.3); }
        
        .admin-wrapper {
          /* Scale down the admin panel slightly if needed, or just contain it */
        }
      `}</style>
    </div>
  );
};

export default ZoneAdminPanel;
