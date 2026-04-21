import React, { useState } from 'react';
import { ShieldCheck, Leaf, Calendar, FileText, Download } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const GeneratorPortal = ({ addComplaint }) => {
  const [showPickup, setShowPickup] = useState(false);
  const [pickupForm, setPickupForm] = useState({ type: 'Biomedical Waste', amount: '' });

  const handlePickup = (e) => {
    e.preventDefault();
    addComplaint({
      id: Date.now(),
      type: pickupForm.type,
      location: 'City Hospital - Block B',
      status: 'Pending',
      description: `Special scheduled pickup: ${pickupForm.amount} kg`,
      reportDate: new Date().toLocaleDateString(),
      image: null
    });
    setShowPickup(false);
  };

  return (
    <div className="generator-view animate-fade">
      <div className="gen-header">
        <div className="glass-card stat-box">
          <div className="stat-header">Compliance Score</div>
          <div className="val text-success flex-center" style={{gap: '0.5rem'}}><ShieldCheck size={28}/> 94%</div>
        </div>
        <div className="glass-card stat-box">
          <div className="stat-header">Green Credits</div>
          <div className="val text-primary flex-center" style={{gap: '0.5rem'}}><Leaf size={28}/> 2,450</div>
        </div>
        <div className="glass-card stat-box">
          <div className="stat-header">Waste This Month</div>
          <div className="val">4.2 <span>Tons</span></div>
        </div>
        <div className="glass-card stat-box">
          <button className="btn-primary w-full h-full" onClick={() => setShowPickup(true)}>
            <Calendar size={18}/> Schedule Pickup
          </button>
        </div>
      </div>

      <div className="doc-section glass-card">
        <h3 className="flex-center" style={{gap: '0.5rem', marginBottom: '1.5rem'}}><FileText size={18}/> My Waste DNA (Audit Logs)</h3>
        <table className="audit-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Waste Type</th>
              <th>Volume</th>
              <th>Disposal Facility</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>21-Apr-2026</td>
              <td>Biomedical (Red Bag)</td>
              <td>120 kg</td>
              <td>Landfill B (Incinerator)</td>
              <td><button className="btn-icon"><Download size={14}/></button></td>
            </tr>
            <tr>
              <td>20-Apr-2026</td>
              <td>General Wet Waste</td>
              <td>85 kg</td>
              <td>Green Valley Compost</td>
              <td><button className="btn-icon"><Download size={14}/></button></td>
            </tr>
            <tr>
              <td>18-Apr-2026</td>
              <td>Biomedical (Yellow Bag)</td>
              <td>210 kg</td>
              <td>Landfill B (Incinerator)</td>
              <td><button className="btn-icon"><Download size={14}/></button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showPickup && (
          <div className="modal-overlay">
            <motion.div 
              className="glass-card modal-content"
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
            >
              <h3>Schedule Special Pickup</h3>
              <form onSubmit={handlePickup} style={{marginTop: '1.5rem'}}>
                <div className="input-group">
                  <label>Waste Type</label>
                  <select value={pickupForm.type} onChange={e => setPickupForm({...pickupForm, type: e.target.value})}>
                    <option>Biomedical Waste</option>
                    <option>Chemical Waste</option>
                    <option>Bulk General Waste</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Estimated Volume (kg)</label>
                  <input type="number" required value={pickupForm.amount} onChange={e => setPickupForm({...pickupForm, amount: e.target.value})} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowPickup(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Confirm Slot</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .gen-header { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-box { padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center; }
        .stat-header { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; }
        .val { font-size: 2rem; font-weight: 700; }
        .val span { font-size: 0.9rem; font-weight: 500; color: var(--text-muted); }
        .text-primary { color: var(--primary); }
        .text-warning { color: var(--warning); }
        .text-success { color: var(--success); }
        
        .h-full { height: 100%; min-height: 80px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.1rem; }
        .w-full { width: 100%; }

        .audit-table { width: 100%; border-collapse: collapse; text-align: left; }
        .audit-table th { padding: 1rem; color: var(--text-muted); font-size: 0.85rem; border-bottom: 1px solid var(--border-glass); }
        .audit-table td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.95rem; }
        .btn-icon { background: rgba(255,255,255,0.1); color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer; transition: 0.2s; }
        .btn-icon:hover { background: var(--primary); }

        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
        }
        .modal-content { width: 100%; max-width: 450px; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem; }
        .input-group select, .input-group input {
          width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2);
          border: 1px solid var(--border-glass); border-radius: var(--radius-md);
          color: white; outline: none; box-sizing: border-box;
        }
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .modal-actions button { flex: 1; padding: 0.75rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default GeneratorPortal;
