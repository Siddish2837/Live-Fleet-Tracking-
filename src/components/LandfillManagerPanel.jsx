import React from 'react';
import { ShieldAlert, Droplets, Wind, Activity, Truck } from 'lucide-react';

const LandfillManagerPanel = () => {
  return (
    <div className="landfill-view animate-fade">
      <div className="health-passport glass-card">
        <div className="passport-header">
          <h2>LANDFILL B — HEALTH PASSPORT</h2>
          <span className="status-badge status-warning">Warning: 67% Load</span>
        </div>
        
        <div className="passport-metrics">
          <div className="p-metric">
            <span className="label">Total Area</span>
            <span className="val">5 acres</span>
          </div>
          <div className="p-metric">
            <span className="label">Active Area</span>
            <span className="val">3.2 acres</span>
          </div>
          <div className="p-metric">
            <span className="label">Days to Limit</span>
            <span className="val danger-text">23 days</span>
          </div>
          <div className="p-metric">
            <span className="label">Accepting</span>
            <span className="val success-text">Residential, Industrial</span>
          </div>
        </div>
      </div>

      <div className="landfill-grid">
        <div className="glass-card env-sensors">
          <h3 className="flex-center" style={{gap: '0.5rem'}}><Activity size={18} color="var(--primary)"/> Environmental Sensors</h3>
          
          <div className="sensor-list">
            <div className="sensor-item">
              <div className="s-icon"><Wind size={18} color="var(--warning)"/></div>
              <div className="s-info">
                <strong>Methane Concentration</strong>
                <div className="bar-bg"><div className="bar-fill" style={{width: '78%', background: 'var(--warning)'}}></div></div>
              </div>
              <div className="s-val">78 ppm</div>
            </div>

            <div className="sensor-item">
              <div className="s-icon"><Droplets size={18} color="var(--primary)"/></div>
              <div className="s-info">
                <strong>Leachate Levels</strong>
                <div className="bar-bg"><div className="bar-fill" style={{width: '45%'}}></div></div>
              </div>
              <div className="s-val">Safe</div>
            </div>
            
            <div className="sensor-item">
              <div className="s-icon"><ShieldAlert size={18} color="var(--success)"/></div>
              <div className="s-info">
                <strong>Soil pH Index</strong>
                <div className="bar-bg"><div className="bar-fill" style={{width: '65%', background: 'var(--success)'}}></div></div>
              </div>
              <div className="s-val">6.8 pH</div>
            </div>
          </div>
        </div>

        <div className="glass-card section-map">
          <h3>Landfill Sections</h3>
          <div className="sections">
            <div className="l-section">
              <div className="sec-header flex-between">
                <strong>Section A (Residential)</strong>
                <span className="text-warning">67% Full</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: '67%', background: 'var(--warning)'}}></div></div>
            </div>
            <div className="l-section">
              <div className="sec-header flex-between">
                <strong>Section B (Industrial)</strong>
                <span>45% Full</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: '45%'}}></div></div>
            </div>
            <div className="l-section">
              <div className="sec-header flex-between">
                <strong>Section D (Closed)</strong>
                <span className="text-success">Remediation...</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: '100%', background: 'var(--success)'}}></div></div>
            </div>
          </div>

          <h3 style={{marginTop: '2rem', display: 'flex', alignItems:'center', gap: '0.5rem'}}><Truck size={18}/> Incoming Queue</h3>
          <ul className="truck-queue">
            <li><strong>TK-047</strong> — ETA 12 mins (Residential) → Route to Sec A</li>
            <li><strong>TK-082</strong> — ETA 24 mins (Industrial) → Route to Sec B</li>
            <li><strong>TK-011</strong> — ETA 38 mins (Residential) → Route to Sec A</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .health-passport {
          margin-bottom: 2rem;
          background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9));
          border-left: 4px solid var(--warning);
        }
        .passport-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .passport-header h2 { font-size: 1.5rem; letter-spacing: -0.5px; }
        
        .passport-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .p-metric { display: flex; flex-direction: column; gap: 0.25rem; }
        .p-metric .label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .p-metric .val { font-size: 1.25rem; font-weight: 700; color: white; }
        .danger-text { color: #f87171 !important; }
        .success-text { color: var(--success) !important; font-size: 1rem !important; }

        .landfill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        .sensor-list { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }
        .sensor-item { display: flex; align-items: center; gap: 1rem; }
        .s-icon { padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); }
        .s-info { flex: 1; }
        .s-info strong { display: block; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .bar-bg { height: 6px; background: rgba(0,0,0,0.3); border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--primary); }
        .s-val { font-weight: 600; font-size: 0.9rem; min-width: 60px; text-align: right; }

        .sections { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .l-section { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-md); }
        .sec-header { margin-bottom: 0.5rem; font-size: 0.9rem; }
        .text-warning { color: var(--warning); }
        .text-success { color: var(--success); }
        
        .truck-queue { list-style: none; padding: 0; margin-top: 1rem; }
        .truck-queue li { padding: 0.75rem 0; border-bottom: 1px solid var(--border-glass); font-size: 0.9rem; color: var(--text-muted); }
        .truck-queue li:last-child { border-bottom: none; }
        .truck-queue li strong { color: white; }
      `}</style>
    </div>
  );
};

export default LandfillManagerPanel;
