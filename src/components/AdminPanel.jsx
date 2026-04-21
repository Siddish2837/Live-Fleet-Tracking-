import React, { useState } from 'react';
import { Users, Filter, Search, MoreVertical, CheckCircle, Clock, AlertCircle, ExternalLink, MapPin, TrendingUp, Map as MapIcon, Table } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from './MapComponent';

const AdminPanel = ({ complaints, updateComplaint, cleanlinessScore }) => {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignee, setAssignee] = useState('');
  const [autoAssignedTruck, setAutoAssignedTruck] = useState(null);

  // Mock fleet for auto-assignment
  const fleetMock = [
    { id: 'T-01', driver: 'John Doe (Team Alpha)', type: 'General Waste', lat: 28.6139, lng: 77.2090, capacity: 45 },
    { id: 'T-02', driver: 'Sarah Smith (Team Beta)', type: 'Plastic Overflow', lat: 28.6250, lng: 77.2150, capacity: 80 },
    { id: 'T-03', driver: 'Mike Johnson (Metro)', type: 'Electronic Waste', lat: 28.6100, lng: 77.2000, capacity: 20 },
    { id: 'T-04', driver: 'Ahmed Khan (Zone 4)', type: 'Hazardous Material', lat: 28.6300, lng: 77.2200, capacity: 60 },
    { id: 'T-05', driver: 'Priya Sharma (Heavy)', type: 'Construction Debris', lat: 28.6000, lng: 77.1900, capacity: 85 },
    { id: 'T-06', driver: 'Ravi Kumar (Team Alpha)', type: 'General Waste', lat: 28.6500, lng: 77.2500, capacity: 95 } // Almost full
  ];

  const getDistance = (lat1, lng1, lat2, lng2) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    progress: complaints.filter(c => c.status === 'In Progress').length,
    completed: complaints.filter(c => c.status === 'Completed').length,
  };

  const types = ['General Waste', 'Plastic Overflow', 'Electronic Waste', 'Hazardous Material', 'Construction Debris'];
  const typeDistribution = types.map(t => ({
    name: t,
    count: complaints.filter(c => c.type === t).length
  }));

  const maxCount = Math.max(...typeDistribution.map(d => d.count), 1);

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  const handleAssign = (id) => {
    updateComplaint(id, { status: 'In Progress', assignedTo: assignee });
    setSelectedComplaint(null);
    setAssignee('');
    setAutoAssignedTruck(null);
  };

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    
    // Auto assignment logic
    const validTrucks = fleetMock.filter(t => 
      (t.type === complaint.type || t.type === 'General Waste') && 
      t.capacity < 90
    );

    if (validTrucks.length > 0) {
      if (complaint.coords) {
        validTrucks.sort((a, b) => {
          const distA = getDistance(a.lat, a.lng, complaint.coords.lat, complaint.coords.lng);
          const distB = getDistance(b.lat, b.lng, complaint.coords.lat, complaint.coords.lng);
          return distA - distB;
        });
      }
      const bestTruck = validTrucks[0];
      setAutoAssignedTruck(bestTruck);
      setAssignee(bestTruck.driver);
    } else {
      setAutoAssignedTruck(null);
      setAssignee('');
    }
  };

  return (
    <div className="admin-view animate-fade">
      {/* Analytics & Stats Row */}
      <div className="admin-top-grid">
        <div className="stats-col">
          <div className="stats-grid">
            <div className="glass-card stat-item">
              <div className="stat-header">
                <Search className="icon-muted" size={18} />
                <span>Total Reports</span>
              </div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="glass-card stat-item warning">
              <div className="stat-header">
                <Clock className="icon-warning" size={18} />
                <span>Pending</span>
              </div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="glass-card stat-item primary">
              <div className="stat-header">
                <AlertCircle className="icon-primary" size={18} />
                <span>In Progress</span>
              </div>
              <div className="stat-value">{stats.progress}</div>
            </div>
            <div className="glass-card stat-item success">
              <div className="stat-header">
                <TrendingUp className="icon-success" size={18} />
                <span>Cleanliness {cleanlinessScore}%</span>
              </div>
              <div className="stat-value">{stats.completed}</div>
              <p style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>TASKS RESOLVED</p>
            </div>
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="card-header">
            <h3>Issue Distribution</h3>
            <p>Reports by Category</p>
          </div>
          <div className="chart-container">
            {typeDistribution.map((d, i) => (
              <div key={i} className="chart-bar-row">
                <div className="bar-label">{d.name.split(' ')[0]}</div>
                <div className="bar-wrapper">
                  <motion.div 
                    className="bar-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / maxCount) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                </div>
                <div className="bar-count">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="glass-card table-section">
        <div className="table-header">
          <div className="table-filters">
            {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
              <button 
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="view-switcher flex-center">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} 
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <Table size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} 
              onClick={() => setViewMode('map')}
              title="Map View"
            >
              <MapIcon size={18} />
            </button>
          </div>
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Search by location..." />
          </div>
        </div>

        <div className="complaint-list">
          {viewMode === 'table' ? (
            filteredComplaints.length === 0 ? (
              <div className="empty-state">No complaints found for this category.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Report Info</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div className="complaint-id">#{c.id.toString().slice(-4)}</div>
                        <div className="complaint-type">{c.type}</div>
                      </td>
                      <td>
                        <div className="location-text"><MapPin size={12} /> {c.location}</div>
                        <div className="report-date">{c.reportDate}</div>
                      </td>
                      <td>
                        <span className={`status-badge status-${c.status.toLowerCase().replace(' ', '')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {c.assignedTo ? (
                          <div className="assignee-tag"><Users size={12} /> {c.assignedTo}</div>
                        ) : (
                          <span className="unassigned">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn-icon" 
                          onClick={() => openAssignModal(c)}
                          disabled={c.status === 'Completed'}
                        >
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <div className="map-view-container">
              <MapComponent complaints={filteredComplaints} />
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <h3>Assign Worker: #{selectedComplaint.id.toString().slice(-4)}</h3>
            <p className="modal-desc">Type: {selectedComplaint.type}</p>
            
            <div className="modal-input-group">
              <label>Field Worker Assignment</label>
              {autoAssignedTruck ? (
                <div className="auto-assign-card" style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div style={{color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                    <CheckCircle size={16} /> Optimal Allocation Found
                  </div>
                  <div style={{fontSize: '0.9rem', color: 'white'}}>
                    <div><strong>Driver:</strong> {autoAssignedTruck.driver}</div>
                    <div><strong>Truck:</strong> {autoAssignedTruck.id} ({autoAssignedTruck.type})</div>
                    <div><strong>Capacity:</strong> {autoAssignedTruck.capacity}% full</div>
                  </div>
                </div>
              ) : (
                <div className="auto-assign-card" style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div style={{color: '#f59e0b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                    <AlertCircle size={16} /> No Auto-Match Available
                  </div>
                  <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                    Trucks matching this waste type are either fully loaded or unavailable. Please manually dispatch.
                  </div>
                </div>
              )}
              
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">Manual Override / Select Worker...</option>
                {fleetMock.map(t => (
                  <option key={t.id} value={t.driver}>
                    {t.driver} - {t.type} (Cap: {t.capacity}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedComplaint(null)}>Cancel</button>
              <button 
                className="btn-primary" 
                onMouseDown={() => handleAssign(selectedComplaint.id)}
                disabled={!assignee}
              >
                {autoAssignedTruck && autoAssignedTruck.driver === assignee ? "Confirm Auto-Assignment" : "Confirm Manual Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-top-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .stat-item {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .chart-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .card-header { margin-bottom: 1.5rem; }
        .card-header h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
        .card-header p { font-size: 0.8rem; color: var(--text-muted); }
        
        .chart-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
          justify-content: center;
        }
        .chart-bar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .bar-label { width: 80px; font-size: 0.75rem; color: var(--text-muted); }
        .bar-wrapper { flex: 1; height: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
        .bar-count { width: 20px; font-size: 0.8rem; font-weight: 600; text-align: right; }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }
        .table-section {
          padding: 0;
        }
        .table-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
        }
        .table-filters {
          display: flex;
          gap: 0.5rem;
        }
        .filter-btn {
          padding: 0.4rem 1rem;
          font-size: 0.85rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          border: 1px solid var(--border-glass);
        }
        .filter-btn.active {
          background: var(--primary);
          color: var(--bg-deep);
          border-color: var(--primary);
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0,0,0,0.2);
          padding: 0.4rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
        }
        .search-bar input {
          background: none;
          border: none;
          color: white;
          outline: none;
          font-size: 0.9rem;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 1rem 1.5rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-glass);
        }
        .admin-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-glass);
        }
        .complaint-id { font-size: 0.75rem; color: var(--primary); font-family: monospace; }
        .complaint-type { font-weight: 600; margin-top: 0.2rem; }
        .location-text { display: flex; align-items: center; gap: 0.3rem; font-size: 0.9rem; }
        .report-date { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }
        .assignee-tag { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; color: var(--secondary); }
        .unassigned { font-size: 0.85rem; font-style: italic; color: var(--text-muted); }
        .btn-icon { color: var(--primary); padding: 0.5rem; border-radius: var(--radius-md); }
        .btn-icon:hover { background: rgba(255,255,255,0.05); }
        .empty-state { padding: 4rem; text-align: center; color: var(--text-muted); }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          width: 100%;
          max-width: 450px;
        }
        .modal-desc { margin-bottom: 1.5rem; color: var(--text-muted); }
        .modal-input-group label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem; }
        .modal-input-group select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: white;
          outline: none;
        }
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .modal-actions button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .view-switcher {
          background: rgba(0,0,0,0.2);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          gap: 0.25rem;
          margin: 0 1rem;
        }
        .view-btn {
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
        }
        .view-btn.active {
          background: var(--bg-surface);
          color: var(--primary);
        }
        .map-view-container {
          height: 500px;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
