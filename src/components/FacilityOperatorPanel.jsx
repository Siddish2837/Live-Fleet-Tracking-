import React from 'react';
import { Factory, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';

const FacilityOperatorPanel = () => {
  return (
    <div className="facility-view animate-fade">
      <div className="facilities-grid">
        {/* Jawaharnagar Dumpyard Card */}
        <div className="glass-card facility-card">
          <div className="card-header flex-between" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)'}}>
                <Trash2 color="#ef4444" size={24} />
              </div>
              <div>
                <h2 style={{fontSize: '1.25rem', margin: 0}}>Jawaharnagar Dumpyard</h2>
                <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Type: General / Wet Waste Hub</div>
              </div>
            </div>
            <div className="status-badge status-inprogress">Active</div>
          </div>

          <div className="data-grid">
            <div className="data-item">
              <span className="label">Total Waste Dumped Today</span>
              <span className="val text-danger">340 <span>Tons</span></span>
            </div>
            <div className="data-item">
              <span className="label">Incoming Fleet (Live)</span>
              <span className="val">8 <span>Trucks arriving</span></span>
            </div>
            <div className="data-item">
              <span className="label">Remaining Capacity</span>
              <span className="val text-warning">14% <span>Critical</span></span>
            </div>
            <div className="data-item">
              <span className="label">Processing Rate</span>
              <span className="val">20 <span>Tons/Hour</span></span>
            </div>
          </div>
          
          <button className="btn-secondary w-full" style={{marginTop: '1.5rem', borderColor: '#ef4444', color: '#ef4444'}}>
             <AlertTriangle size={16} style={{marginRight: '0.5rem'}}/> Request Expansion Authorization
          </button>
        </div>

        {/* Bholakpur Recycling Unit Card */}
        <div className="glass-card facility-card">
          <div className="card-header flex-between" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <div style={{padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-md)'}}>
                <Factory color="#8b5cf6" size={24} />
              </div>
              <div>
                <h2 style={{fontSize: '1.25rem', margin: 0}}>Bholakpur Recycling Unit</h2>
                <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Type: Dry Plastics & Metal Processing</div>
              </div>
            </div>
            <div className="status-badge status-completed">Optimal</div>
          </div>

          <div className="data-grid">
            <div className="data-item">
              <span className="label">Target Materials Dumped Today</span>
              <span className="val text-primary">125 <span>Tons</span></span>
            </div>
            <div className="data-item">
              <span className="label">Incoming Fleet (Live)</span>
              <span className="val">3 <span>Trucks arriving</span></span>
            </div>
            <div className="data-item">
              <span className="label">Remaining Storage Capacity</span>
              <span className="val text-success">68% <span>Available</span></span>
            </div>
            <div className="data-item">
              <span className="label">Recycled Output</span>
              <span className="val text-success">90 <span>Tons/Day</span></span>
            </div>
          </div>

          <button className="btn-primary w-full" style={{marginTop: '1.5rem'}}>
            <TrendingUp size={16} style={{marginRight: '0.5rem'}}/> View Market Sales Inventory
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .facilities-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 2rem; 
        }
        
        .facility-card { 
          display: flex; 
          flex-direction: column; 
          padding: 2rem;
        }

        .data-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          flex: 1;
        }

        .data-item {
          background: rgba(0,0,0,0.2);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .label {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .val { 
          font-size: 2rem; 
          font-weight: 700; 
          color: white;
        }
        
        .val span { 
          font-size: 0.85rem; 
          font-weight: 500; 
          color: var(--text-muted); 
          margin-left: 0.2rem;
        }
        
        .text-primary { color: var(--primary); }
        .text-warning { color: var(--warning); }
        .text-success { color: var(--success); }
        .text-danger { color: #ef4444; }

        .w-full { width: 100%; display: flex; align-items: center; justify-content: center; }
        
        /* Ensure responsiveness */
        @media (max-width: 1024px) {
          .facilities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FacilityOperatorPanel;
