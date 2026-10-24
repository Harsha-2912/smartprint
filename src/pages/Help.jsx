import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { KIOSK_CONFIG } from '../config/printerConfig';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column gap-4 py-2">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h3 className="fw-extrabold text-dark mb-1" style={{ fontWeight: 800 }}>
            SmartPrint AI Help & Kiosk Guide
          </h3>
          <p className="text-secondary small mb-0">
            Frequently asked questions, scanner instructions, and hardware support.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-kiosk-secondary"
          onClick={() => navigate('/')}
        >
          <ArrowBackIcon />
          <span>Return to Home</span>
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="kiosk-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <PhoneIphoneIcon />
              <h5 className="fw-bold mb-0 text-dark">Mobile & QR Upload</h5>
            </div>
            <p className="text-secondary small mb-2" style={{ lineHeight: 1.6 }}>
              Scan the displayed QR code with your smartphone camera. You can upload any PDF or photo up to 25 MB directly without needing any custom app.
            </p>
            <span className="badge bg-light text-primary border small">Encrypted wireless link</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="kiosk-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
              <AutoFixHighIcon />
              <h5 className="fw-bold mb-0 text-dark">AI Quality Enhancements</h5>
            </div>
            <p className="text-secondary small mb-2" style={{ lineHeight: 1.6 }}>
              SmartPrint AI automatically checks for upside-down pages, faint pencil marks, blank dividers, and content that might get cut off by printer borders.
            </p>
            <span className="badge bg-light text-secondary border small">Complimentary feature</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="kiosk-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-success">
              <PaymentIcon />
              <h5 className="fw-bold mb-0 text-dark">UPI Payments & Refunds</h5>
            </div>
            <p className="text-secondary small mb-2" style={{ lineHeight: 1.6 }}>
              Pay instantly using Google Pay, PhonePe, Paytm, or BHIM. In the event of any hardware interruption, the system generates an immediate QR refund token.
            </p>
            <span className="badge bg-light text-success border small">Zero transaction surcharge</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="kiosk-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-danger">
              <BuildIcon />
              <h5 className="fw-bold mb-0 text-dark">Hardware Support</h5>
            </div>
            <p className="text-secondary small mb-2" style={{ lineHeight: 1.6 }}>
              Connected to <strong>{KIOSK_CONFIG.printer.model}</strong>. If a paper jam occurs, follow the on-screen animation to open Door B.
            </p>
            <span className="badge bg-light text-danger border small">Attendant hotline: {KIOSK_CONFIG.supportPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
