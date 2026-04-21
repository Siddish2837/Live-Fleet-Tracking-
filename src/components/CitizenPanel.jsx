import React, { useState } from 'react';
import { Camera, MapPin, Send, CheckCircle, Globe } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from './MapComponent';

const CitizenPanel = ({ addComplaint }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'General Waste',
    location: '',
    coords: { lat: 28.6139, lng: 77.2090 }, // Default Delhi
    description: '',
    image: null
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleMapClick = (coords) => {
    setFormData(prev => ({ ...prev, coords, location: `Point: ${coords.lat}, ${coords.lng}` }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: Date.now(),
      ...formData,
      status: 'Pending',
      assignedTo: null,
      reportDate: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };
    addComplaint(newComplaint);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ 
      type: 'General Waste', 
      location: '', 
      coords: { lat: 28.6139, lng: 77.2090 }, 
      description: '',
      image: null
    });
  };

  return (
    <div className="citizen-view animate-fade">
      <div className="grid-layout">
        {/* Form Column */}
        <div className="glass-card form-card">
          <h2 className="section-title">New Report</h2>
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="input-group">
              <label>Issue Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>General Waste</option>
                <option>Plastic Overflow</option>
                <option>Electronic Waste</option>
                <option>Hazardous Material</option>
                <option>Construction Debris</option>
              </select>
            </div>

            <div className="input-group">
              <label>Precise Location (Click Map to Pin)</label>
              <div className="location-info-small">
                 <Globe size={14} color="var(--primary)" /> 
                 <span>{formData.coords.lat}, {formData.coords.lng}</span>
              </div>
              <MapComponent onMapClick={handleMapClick} complaints={[]} interactive={true} />
            </div>

            <div className="input-group">
              <label>Location Details</label>
              <div className="location-input">
                <input 
                  type="text" 
                  placeholder="Street name or landmark..."
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                placeholder="Describe the issue..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>Evidence Photo (Mandatory)</label>
              <div className="upload-section">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="waste-image-upload" 
                  onChange={handleImageChange} 
                  required 
                  style={{ display: 'none' }}
                />
                <label htmlFor="waste-image-upload" className="upload-label">
                  {formData.image ? (
                    <img src={formData.image} alt="Waste evidence preview" className="preview-img" />
                  ) : (
                    <div className="upload-placeholder">
                      <Camera size={32} style={{ margin: '0 auto 0.5rem auto', color: 'var(--text-muted)' }} />
                      <p>Click to upload photo</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full submit-btn" disabled={!formData.image}>
              <Send size={18} /> Submit Complaint
            </button>
          </form>
        </div>

        {/* Stats/Info Column */}
        <div className="info-column">
          <div className="glass-card info-card">
            <h3 className="flex-center" style={{gap: '0.5rem'}}>
              <CheckCircle size={20} color="var(--success)" /> Verified Reports
            </h3>
            <p className="big-stat">12,482</p>
            <p className="stat-label">Issues resolved this month</p>
          </div>
          
          <div className="glass-card status-card">
            <h3>Guidelines</h3>
            <ul className="guideline-list">
              <li>Clear photos help workers locate waste.</li>
              <li>Specify exact landmarks if possible.</li>
              <li>Hazardous waste requires special equipment.</li>
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            className="success-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="success-content glass-card">
              <CheckCircle size={64} color="var(--success)" />
              <h2>Report Submitted!</h2>
              <p>The city council has been notified. Track your status in the dashboard.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }
        .section-title {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .complaint-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .input-group input, 
        .input-group select, 
        .input-group textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: white;
          outline: none;
        }
        .location-input {
          display: flex;
          gap: 0.5rem;
        }
        .loc-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          color: var(--primary);
          padding: 0.5rem;
          border-radius: var(--radius-md);
        }
        .upload-section {
          height: 200px;
          border: 2px dashed var(--border-glass);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upload-label {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .upload-placeholder {
          text-align: center;
          color: var(--text-muted);
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .submit-btn {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 1rem;
        }
        .w-full { width: 100%; }
        .info-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .big-stat {
          font-size: 3rem;
          font-weight: 700;
          color: var(--success);
          text-align: center;
          margin: 0.5rem 0;
        }
        .stat-label {
          text-align: center;
          color: var(--text-muted);
        }
        .guideline-list {
          margin-top: 1rem;
          padding-left: 1.25rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .guideline-list li { margin-bottom: 0.5rem; }
        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .success-content {
          text-align: center;
          padding: 3rem !important;
          max-width: 400px;
        }
      `}</style>
    </div>
  );
};

export default CitizenPanel;
