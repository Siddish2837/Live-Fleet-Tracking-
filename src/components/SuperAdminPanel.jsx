import React, { useState } from 'react';
import { Activity, Users, AlertTriangle, TrendingDown, TrendingUp, Cpu, Server } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const SuperAdminPanel = ({ cleanlinessScore }) => {
  const [simulationActive, setSimulationActive] = useState(false);

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
              <select>
                <option>New IT Park (+10k Workers) - Zone 7</option>
                <option>Diwali Festival Surge - Citywide</option>
                <option>Monsoon Season - Wet Waste Spike</option>
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
              <h4>Predicted Impact: Zone 7 IT Park</h4>
              <ul>
                <li><AlertTriangle size={14} color="var(--warning)" /> Daily waste increased by <strong>8 tons/day</strong></li>
                <li><Server size={14} color="var(--primary)" /> <strong>45</strong> new smart bins required</li>
                <li><Activity size={14} color="var(--secondary)" /> Recommend opening new <strong>Recycling Facility in Zone 7</strong></li>
              </ul>
            </motion.div>
          )}
        </div>

        <div className="glass-card alerts-card">
          <h2 style={{marginBottom: '1rem'}}>Predictive Alerts</h2>
          <div className="alert-item danger">
            <div className="alert-icon"><AlertTriangle size={18} /></div>
            <div>
              <strong>Landfill B at risk</strong>
              <p>Will reach 90% capacity in 12 days based on current routing.</p>
            </div>
          </div>
          <div className="alert-item warning">
            <div className="alert-icon"><Activity size={18} /></div>
            <div>
              <strong>Festival Surge Expected</strong>
              <p>Zone 3 history shows 40% spike next weekend. Routing 4 extra trucks.</p>
            </div>
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
