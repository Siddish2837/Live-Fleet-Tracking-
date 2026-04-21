import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Bell
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import CitizenPanel from './components/CitizenPanel';
import WorkerPanel from './components/WorkerPanel';
import SuperAdminPanel from './components/SuperAdminPanel';
import ZoneAdminPanel from './components/ZoneAdminPanel';
import LandfillManagerPanel from './components/LandfillManagerPanel';
import FacilityOperatorPanel from './components/FacilityOperatorPanel';

import LiveFleetTracking from './components/LiveFleetTracking';

const App = () => {
  const [role, setRole] = useState('citizen');
  const [toasts, setToasts] = useState([]);
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('cleancity_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const cleanlinessScore = complaints.length === 0 ? 100 : 
    Math.round((complaints.filter(c => c.status === 'Completed').length / complaints.length) * 100);

  useEffect(() => {
    localStorage.setItem('cleancity_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
    triggerToast("Report submitted successfully!", "success");
  };

  const updateComplaint = (id, updates) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, ...updates } : c));
    if (updates.status === 'Completed') {
      triggerToast("Task marked as resolved!", "success");
    } else if (updates.assignedTo) {
      triggerToast(`Task assigned to ${updates.assignedTo.split(' ')[0]}`, "info");
    }
  };

  return (
    <div className="app-container">
      {/* Role Switcher Nav */}
      <nav className="role-nav glass-card">
        <div className="container flex-between">
          <div className="logo flex-center" onClick={() => setRole('citizen')} style={{cursor: 'pointer'}}>
            <Building2 className="primary-icon" />
            <span className="logo-text">CleanCity <span className="ai-tag">DT</span></span>
            <div className="clean-score" title="City Cleanliness Score">
              <TrendingUp size={14} color="var(--success)" />
              {cleanlinessScore}%
            </div>
          </div>
          <div className="role-buttons flex-center">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)'}}>Persona:</span>
            <select 
              className="role-selector glass-card"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="superadmin">Super Admin (City)</option>
              <option value="zoneadmin">Zone Admin (Ward)</option>
              <option value="fleet_dispatcher">Fleet Dispatcher</option>
              <option value="landfill">Landfill Manager</option>
              <option value="worker">Truck Driver</option>
              <option value="facility">Facility Operator</option>

              <option value="citizen">Public Citizen</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="container main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {role === 'citizen' && (
              <div className="panel-container">
                <header className="panel-header">
                  <h1>Citizen Portal</h1>
                  <p>Report garbage issues, earn green credits, track city rank.</p>
                </header>
                <CitizenPanel addComplaint={addComplaint} />
              </div>
            )}

            {role === 'superadmin' && (
              <div className="panel-container">
                <header className="panel-header">
                  <h1>City Command Center</h1>
                  <p>Digital Twin Simulator and Global Infrastructure view.</p>
                </header>
                <SuperAdminPanel complaints={complaints} cleanlinessScore={cleanlinessScore} />
              </div>
            )}

            {role === 'zoneadmin' && (
              <div className="panel-container">
                <header className="panel-header">
                  <h1>Zone Admin Dashboard</h1>
                  <p>Manage District 4 sanitation and override truck dispatches.</p>
                </header>
                <ZoneAdminPanel complaints={complaints} updateComplaint={updateComplaint} />
              </div>
            )}

            {role === 'landfill' && (
              <div className="panel-container">
                <header className="panel-header">
                  <h1>Landfill Health Passport</h1>
                  <p>Live metrics from Landfill B & Incoming Trackers.</p>
                </header>
                <LandfillManagerPanel />
              </div>
            )}

            {role === 'worker' && (
              <div className="panel-container">
                <header className="panel-header">
                  <h1>Driver App: TK-047</h1>
                  <p>Smart navigation and assigned collections.</p>
                </header>
                <WorkerPanel complaints={complaints} updateComplaint={updateComplaint} />
              </div>
            )}

            {role === 'facility' && (
              <div className="panel-container">
                <header className="panel-header">
                  <h1>Green Valley Facility</h1>
                  <p>Recycling plant metrics, sorting efficiency, and revenue.</p>
                </header>
                <FacilityOperatorPanel />
              </div>
            )}


            {role === 'fleet_dispatcher' && (
              <div className="panel-container">
                <header className="panel-header" style={{marginBottom: '0'}}>
                </header>
                <LiveFleetTracking />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast System Rendering */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              className={`toast glass-card ${t.type}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Bell size={18} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          z-index: 3000;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem !important;
          border-left: 4px solid var(--primary) !important;
          min-width: 250px;
        }
        .toast.success { border-left-color: var(--success) !important; }
        .toast.info { border-left-color: var(--secondary) !important; }
        
        .clean-score {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(74, 222, 128, 0.1);
          color: var(--success);
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          margin-left: 0.5rem;
        }
      `}</style>

      <style jsx>{`
        .app-container {
          padding-top: 5rem;
          min-height: 100vh;
        }
        .role-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4.5rem;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-right: none;
          z-index: 1000;
          display: flex;
          align-items: center;
        }
        .container.flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          gap: 0.75rem;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .ai-tag {
          font-size: 0.75rem;
          background: var(--primary);
          color: var(--bg-deep);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          vertical-align: middle;
        }
        .role-buttons {
          padding: 0.25rem;
          border-radius: var(--radius-md);
          gap: 0.5rem;
        }
        .role-selector {
          background: rgba(0,0,0,0.5);
          color: white;
          border: 1px solid var(--border-glass);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          outline: none;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
        }
        .role-selector option {
          background: var(--bg-deep);
          color: white;
        }
        .panel-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        .panel-header h1 {
          font-size: 2.5rem;
          background: linear-gradient(to right, #fff, var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .panel-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        .primary-icon {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default App;
