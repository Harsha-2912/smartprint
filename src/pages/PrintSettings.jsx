import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import SettingSelectorCard from '../components/settings/SettingSelectorCard';
import LivePriceSummary from '../components/settings/LivePriceSummary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TuneIcon from '@mui/icons-material/Tune';

export default function PrintSettings() {
  const navigate = useNavigate();
  const { document } = usePrintSession();

  if (!document) {
    return (
      <div className="p-5 text-center bg-white rounded-4 border shadow-sm my-4">
        <h5 className="fw-bold text-dark mb-2">No Document Selected</h5>
        <button className="btn btn-kiosk-primary" onClick={() => navigate('/upload')}>
          Go to Upload Screen
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <TuneIcon style={{ color: 'var(--sp-primary)', fontSize: 26 }} />
            <h3 className="fw-extrabold text-dark mb-0" style={{ fontWeight: 800 }}>
              Select Print Settings
            </h3>
          </div>
          <p className="text-secondary small mb-0 mt-1">
            Configure paper, colour mode, double-sided duplexing, and number of copies.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Settings Cards (Col-8), Right Live Price Panel (Col-4) */}
      <div className="row g-4 align-items-start">
        <div className="col-lg-8">
          <SettingSelectorCard />
        </div>

        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: '80px' }}>
            <LivePriceSummary />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
        <button 
          type="button" 
          className="btn btn-kiosk-secondary"
          onClick={() => navigate('/ai-analysis')}
        >
          <ArrowBackIcon />
          <span>Back to AI Analysis</span>
        </button>

        <button 
          type="button" 
          className="btn btn-kiosk-primary"
          onClick={() => navigate('/payment')}
        >
          <span>Continue to Payment</span>
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
}
