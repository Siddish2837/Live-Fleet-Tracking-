import React, { useState } from 'react';
import { CheckCircle, Camera, MapPin, ExternalLink, Trash2, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import MapComponent from './MapComponent';
const WorkerPanel = ({ complaints, updateComplaint }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [completePhoto, setCompletePhoto] = useState(null);

  // For demo purposes, we'll assume the logged-in worker is "John Doe (Team Alpha)"
  const workerTasks = complaints.filter(c => c.assignedTo === 'John Doe (Team Alpha)');

  const handleComplete = (id) => {
    updateComplaint(id, { 
      status: 'Completed', 
      afterImage: completePhoto 
    });
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#2dd4bf', '#fbbf24']
    });
    setSelectedTask(null);
    setCompletePhoto(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompletePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="worker-view animate-fade">
      <div className="worker-info-bar glass-card">
        <div className="flex-center" style={{gap: '1rem'}}>
          <div className="avatar">JD</div>
          <div>
            <div className="worker-name">John Doe</div>
            <div className="worker-team">Team Alpha • Status: Online</div>
          </div>
        </div>
        <div className="task-count">
          <span className="count-label">Assigned Tasks</span>
          <span className="count-value">{workerTasks.filter(t => t.status !== 'Completed').length}</span>
        </div>
      </div>

      <div className="task-list grid-auto">
        {workerTasks.length === 0 ? (
          <div className="glass-card empty-tasks flex-center flex-column" style={{gridColumn: '1/-1', padding: '4rem'}}>
            <Trash2 size={48} color="var(--text-muted)" style={{marginBottom: '1rem'}} />
            <h3>No assigned tasks</h3>
            <p style={{color: 'var(--text-muted)'}}>Great job! You've cleared all your assignments.</p>
          </div>
        ) : (
          workerTasks.map(t => (
            <div key={t.id} className={`glass-card task-card ${t.status === 'Completed' ? 'completed' : ''}`}>
              <div className="task-status-row">
                <span className={`status-badge status-${t.status.toLowerCase().replace(' ', '')}`}>
                  {t.status}
                </span>
                <span className="task-date">{t.reportDate}</span>
              </div>
              
              <h3 className="task-title">{t.type}</h3>
              <div className="task-loc"><MapPin size={14} /> {t.location}</div>
              
              {t.status !== 'Completed' && (
                <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <MapComponent complaints={[t]} />
                </div>
              )}

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid var(--warning)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '0.25rem' }}>IoT Sensor Alert</strong>
                Bin capacity exceeded 80%. Automated dispatch triggered.
              </div>

              {t.status === 'In Progress' && (
                <button 
                  className="btn-primary w-full" 
                  style={{marginTop: '1.5rem'}}
                  onClick={() => setSelectedTask(t)}
                >
                  <CheckCircle size={18} /> Mark Completed
                </button>
              )}

              {t.status === 'Completed' && (
                <div className="completion-badge">
                  <CheckCircle size={16} /> Resolved
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedTask && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <h3>Complete Task: #{selectedTask.id.toString().slice(-4)}</h3>
            <p className="modal-desc">Upload a photo of the cleaned area to confirm resolution.</p>
            
            <div className="upload-section" style={{height: '180px', marginBottom: '1.5rem'}}>
              <label className="upload-label">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                {completePhoto ? (
                  <img src={completePhoto} alt="After" className="preview-img" />
                ) : (
                  <div className="upload-placeholder">
                    <Camera size={32} />
                    <span>Upload Resolution Photo</span>
                  </div>
                )}
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedTask(null)}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={() => handleComplete(selectedTask.id)}
                disabled={!completePhoto}
              >
                Submit Proof
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .worker-info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem 2rem;
        }
        .avatar {
          width: 45px; height: 45px;
          background: var(--primary);
          color: var(--bg-deep);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
        }
        .worker-name { font-weight: 600; font-size: 1.1rem; }
        .worker-team { color: var(--text-muted); font-size: 0.8rem; }
        .task-count { text-align: right; }
        .count-label { display: block; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
        .count-value { font-size: 1.5rem; font-weight: 700; color: var(--primary); }
        
        .task-card {
          display: flex; flex-direction: column;
          transition: var(--transition);
        }
        .task-card:hover { transform: translateY(-5px); border-color: var(--primary-glow); }
        .task-card.completed { opacity: 0.7; }
        
        .task-status-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .task-date { font-size: 0.75rem; color: var(--text-muted); }
        .task-title { margin-bottom: 0.5rem; font-size: 1.1rem; }
        .task-loc { font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1rem; }
        

        
        .completion-badge {
          margin-top: 1.5rem;
          color: var(--success);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          font-weight: 500;
          background: rgba(74, 222, 128, 0.1);
          padding: 0.5rem;
          border-radius: var(--radius-md);
        }

        /* Reusing Modal Styles from Admin/Citizen */
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
        }
        .modal-content { width: 100%; max-width: 450px; }
        .modal-desc { margin-bottom: 1.5rem; color: var(--text-muted); }
        .upload-section { 
          border: 2px dashed var(--border-glass); 
          border-radius: var(--radius-md); 
          overflow: hidden; 
        }
        .upload-label { 
          width: 100%; height: 100%; 
          display: flex; align-items: center; justify-content: center; cursor: pointer; 
        }
        .preview-img { width: 100%; height: 100%; object-fit: cover; }
        .upload-placeholder { text-align: center; color: var(--text-muted); }
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .modal-actions button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .w-full { width: 100%; }
        .flex-column { flex-direction: column; }
      `}</style>
    </div>
  );
};

export default WorkerPanel;
