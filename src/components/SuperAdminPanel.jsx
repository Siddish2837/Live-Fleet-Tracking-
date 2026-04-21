import React, { useState } from 'react';
import { Activity, Users, AlertTriangle, TrendingDown, TrendingUp, Cpu, Server } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const SuperAdminPanel = ({ cleanlinessScore }) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [activeScenario, setActiveScenario] = useState('it_park');

  const scenarios = {
    it_park: {
      title: "Predicted Impact: Zone 7 IT Park (+10k Workers)",
      points: [
        { icon: AlertTriangle, color: "var(--warning)", label: "Daily waste increased by", strong: "8 tons/day" },
        { icon: Server, color: "var(--primary)", strong: "45", label: "new smart bins required" },
        { icon: Activity, color: "var(--secondary)", label: "Recommend opening new", strong: "Recycling Facility in Zone 7" }
      ]
    },
    diwali: {
      title: "Predicted Impact: Diwali Festival Surge",
      points: [
        { icon: AlertTriangle, color: "var(--warning)", label: "Citywide wet waste spiked by", strong: "42%" },
        { icon: Server, color: "var(--primary)", label: "Requires", strong: "12 extra temporary trucks" },
        { icon: Activity, color: "var(--secondary)", label: "Landfill inbound reaching critical threshold", strong: "early" }
      ]
    },
    monsoon: {
      title: "Predicted Impact: Monsoon Season",
      points: [
        { icon: AlertTriangle, color: "var(--warning)", label: "Wet waste decomposition rates", strong: "increased dangerously" },
        { icon: Server, color: "var(--primary)", label: "Route times delayed by avg", strong: "18 mins (waterlogging)" },
        { icon: Activity, color: "var(--secondary)", label: "Increase collection frequency in low-lying", strong: "Zone 4" }
      ]
    }
  };

  const currentScenario = scenarios[activeScenario];

  return (
    <div className="super-admin-view animate-fade">
      <div className="metrics-grid">
        <div className="glass-card metric">
          <h3>Total City Waste</h3>
          <p className="value">4,250 <span>tons/day</span></p>
          <div className="trend success"><TrendingDown size={14}/> 2.4% vs last week</div>
        </div>
        <div className="glass-card metric">
          <h3>Recycled Rate</h3>
          <p className="value text-primary">34 <span>%</span></p>
          <div className="trend success"><TrendingUp size={14}/> +1.2% vs last month</div>
        </div>
        <div className="glass-card metric">
          <h3>Landfill Capacity</h3>
          <p className="value text-warning">86 <span>%</span></p>
          <div className="trend danger"><TrendingUp size={14}/> Critical Level</div>
        </div>
        <div className="glass-card metric">
          <h3>Cleanliness Score</h3>
          <p className="value text-success">{cleanlinessScore} <span>/ 100</span></p>
        </div>
      </div>

      <div className="twin-grid">
        <div className="glass-card simulator-card">
          <div className="card-header flex-between">
            <h2 className="flex-center" style={{gap: '0.5rem'}}><Cpu color="var(--primary)" /> Digital Twin Simulator</h2>
          </div>
          <p className="desc">Run predictive "What-If" scenarios on city infrastructure.</p>
          
          <div className="simulation-controls">
            <div className="input-group">
              <label>Scenario Preset</label>
              <select value={activeScenario} onChange={(e) => setActiveScenario(e.target.value)}>
                <option value="it_park">New IT Park (+10k Workers) - Zone 7</option>
                <option value="diwali">Diwali Festival Surge - Citywide</option>
                <option value="monsoon">Monsoon Season - Wet Waste Spike</option>
              </select>
            </div>
            <button 
              className="btn-primary w-full" 
              onClick={() => { setSimulationActive(false); setTimeout(() => setSimulationActive(true), 500); }}
            >
              Run Simulation
            </button>
          </div>

          {simulationActive && (
            <motion.div className="simulation-results" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
              <h4>{currentScenario.title}</h4>
              <ul>
                {currentScenario.points.map((pt, idx) => {
                  const IconComp = pt.icon;
                  return (
                    <li key={idx}>
                      <IconComp size={14} color={pt.color} />
                      {pt.label.includes('increased by') || pt.label.includes('Requires') || pt.label.includes('Recommend') || pt.label.includes('rates') || pt.label.includes('delayed') || pt.label.includes('threshold') || pt.label.includes('spiked') || pt.label.includes('low-lying') ? (
                        <span>{pt.label} <strong>{pt.strong}</strong></span>
                      ) : (
                        <span><strong>{pt.strong}</strong> {pt.label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </div>

        <div className="glass-card insights-card">
          <div className="flex-between" style={{marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem'}}>
            <h2 className="flex-center" style={{gap: '0.5rem', margin: 0}}><Activity color="var(--primary)" /> AI Insights Panel</h2>
            <span style={{fontSize: '0.75rem', background: 'var(--primary)', color: 'var(--bg-deep)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 'bold'}}>LIVE</span>
          </div>

          <div className="insight-section">
            <h4 style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Insight</h4>
            <p style={{fontSize: '1rem', fontWeight: '500', lineHeight: 1.4}}>
              Fleet imbalance causing landfill bottleneck while recycling unit sits idle.
            </p>
          </div>

          <div className="insight-section" style={{marginTop: '1.25rem'}}>
            <h4 style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Alerts</h4>
            <div className="alert-box critical flex-center" style={{gap: '0.5rem', marginBottom: '0.5rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', borderRadius: '4px'}}>
              <AlertTriangle size={14} color="#ef4444" />
              <span style={{fontSize: '0.85rem', color: '#fff'}}>Zone A bins overflowing in 35 minutes.</span>
            </div>
            <div className="alert-box critical flex-center" style={{gap: '0.5rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', borderRadius: '4px'}}>
              <AlertTriangle size={14} color="#ef4444" />
              <span style={{fontSize: '0.85rem', color: '#fff'}}>Dumpyard inbound critically nearing 90% capacity.</span>
            </div>
          </div>

          <div className="insight-section" style={{marginTop: '1.25rem'}}>
            <h4 style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Actions</h4>
            <button className="btn-secondary w-full" style={{marginBottom: '0.5rem', textAlign: 'left', display: 'flex', gap: '0.5rem'}}>
              <strong style={{color: 'var(--primary)'}}>[ Redirect T-06 ]</strong> Send Truck T-06 instantly to Zone A.
            </button>
            <button className="btn-secondary w-full" style={{textAlign: 'left', display: 'flex', gap: '0.5rem'}}>
              <strong style={{color: 'var(--primary)'}}>[ Divert Load ]</strong> Force dry waste to Bholakpur unit.
            </button>
          </div>

          <div className="insight-section" style={{marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-glass)'}}>
            <h4 style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Fixes</h4>
            <ul style={{fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', margin: 0, lineHeight: 1.6}}>
              <li><strong>[ Execute Reroute ]</strong> Reroute via outer ring road to avoid traffic.</li>
              <li><strong>[ Enable Overflow ]</strong> Dispatch emergency backup truck to Zone A.</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .metric h3 { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.5rem; }
        .metric .value { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .metric .value span { font-size: 1rem; color: var(--text-muted); font-weight: 400; }
        .text-primary { color: var(--primary); }
        .text-warning { color: var(--warning); }
        .text-success { color: var(--success); }
        
        .trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; }
        .trend.success { color: var(--success); background: rgba(74,222,128,0.1); padding: 0.25rem 0.5rem; border-radius: 4px; display: inline-flex; }
        .trend.danger { color: #f87171; background: rgba(248,113,113,0.1); padding: 0.25rem 0.5rem; border-radius: 4px; display: inline-flex; }
        
        .twin-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        .desc { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem; }
        .input-group label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .input-group select { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); border-radius: var(--radius-md); color: white; outline: none; margin-bottom: 1rem; }
        .w-full { width: 100%; }
        
        .simulation-results {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: var(--radius-md);
        }
        .simulation-results h4 { color: var(--primary); margin-bottom: 1rem; }
        .simulation-results ul { list-style: none; padding: 0; }
        .simulation-results li { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.95rem; }
        
        .alert-item {
          display: flex; gap: 1rem; align-items: flex-start;
          padding: 1rem; border-radius: var(--radius-md);
          margin-bottom: 1rem;
          background: rgba(0,0,0,0.2);
        }
        .alert-item.danger { border-left: 4px solid var(--warning); }
        .alert-item.warning { border-left: 4px solid var(--secondary); }
        .alert-icon { padding: 0.5rem; border-radius: 50%; background: rgba(255,255,255,0.05); }
        .alert-item.danger .alert-icon { color: var(--warning); }
        .alert-item.warning .alert-icon { color: var(--secondary); }
        .alert-item p { margin-top: 0.25rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
      `}</style>
    </div>
  );
};

export default SuperAdminPanel;
