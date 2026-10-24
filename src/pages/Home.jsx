import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import PrintIcon from '@mui/icons-material/Print';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CameraScanModal from '../components/common/CameraScanModal';

export default function Home() {
  const navigate = useNavigate();
  const { loadSampleDocument, resetSession, setDocument } = usePrintSession();

  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const handleStartPrint = () => {
    navigate('/upload');
  };

  const handleQuickDemoStart = () => {
    loadSampleDocument(0);
    navigate('/upload');
  };

  const handleScanCaptured = (capturedDoc, targetRoute = '/preview') => {
    setScanModalOpen(false);
    setCopyModalOpen(false);
    setDocument(capturedDoc);
    navigate(targetRoute);
  };


  return (
    <div className="d-flex flex-column gap-4 py-2">
      {/* Hero Banner Area */}
      <div 
        className="p-4 p-lg-5 rounded-4 position-relative overflow-hidden shadow-md"
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E1B4B 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Subtle decorative glow circles */}
        <div 
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '30%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <AutoAwesomeIcon style={{ color: '#06B6D4', fontSize: 18 }} />
              <span className="small fw-semibold" style={{ letterSpacing: '0.04em' }}>
                AI-ENHANCED AUTONOMOUS KIOSK ENGINE
              </span>
            </div>

            <h1 className="fw-extrabold display-5 mb-2" style={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Smart Printing. <br />
              <span style={{ background: 'linear-gradient(135deg, #38BDF8, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Perfect Results.
              </span>
            </h1>

            <p className="lead mb-4" style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '620px' }}>
              Self-service autonomous printing kiosk. Upload wirelessly via QR code or flash drive, let our AI fix skewed and upside-down pages, and pay instantly with UPI.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <button 
                type="button" 
                className="btn btn-kiosk-primary btn-lg"
                onClick={handleStartPrint}
                style={{ fontSize: '1.25rem', height: '62px', padding: '0 2.5rem' }}
              >
                <TouchAppIcon style={{ fontSize: 28 }} />
                <span>Start Printing Now</span>
                <ArrowForwardIcon />
              </button>

              <button 
                type="button" 
                className="btn btn-outline-light d-inline-flex align-items-center gap-2 px-4 rounded-3"
                onClick={handleQuickDemoStart}
                style={{ height: '62px', fontWeight: 600, borderWidth: '1.5px', background: 'rgba(255,255,255,0.06)' }}
              >
                <AutoAwesomeIcon style={{ color: '#FACC15' }} />
                <span>1-Tap Demo Walkthrough</span>
              </button>
            </div>
          </div>

          {/* Hero Kiosk Hardware Graphic */}
          <div className="col-lg-4 text-center d-none d-lg-block">
            <div 
              className="p-3 rounded-4 shadow-lg anim-float"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <svg viewBox="0 0 200 160" width="100%" height="160" fill="none">
                <rect x="30" y="40" width="140" height="90" rx="10" fill="#334155" />
                <rect x="40" y="50" width="120" height="70" rx="6" fill="#1E293B" />
                <rect x="50" y="30" width="100" height="15" rx="4" fill="#64748B" />
                <line x1="60" y1="75" x2="140" y2="75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="145" cy="60" r="4" fill="#10B981" />
                <rect x="70" y="100" width="60" height="25" rx="3" fill="#FFFFFF" fillOpacity="0.9" />
              </svg>
              <div className="mt-2 text-center">
                <span className="badge bg-success-subtle text-success border border-success small">
                  ● Kiosk Online & Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Prominent Primary Action Cards */}
      <div>
        <h4 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
          <span>Choose Your Service:</span>
        </h4>

        <div className="row g-4">
          {/* Action 1: Print Document */}
          <div className="col-md-4">
            <div 
              className="kiosk-card interactive h-100 d-flex flex-column justify-content-between p-4"
              onClick={handleStartPrint}
              style={{ borderTop: '5px solid var(--sp-primary)' }}
            >
              <div>
                <div 
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                    color: 'var(--sp-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <PrintIcon style={{ fontSize: 32 }} />
                </div>
                <h5 className="fw-bold text-dark mb-2">1. Print a Document</h5>
                <p className="text-secondary small mb-3" style={{ lineHeight: 1.6 }}>
                  Upload PDF, Word, or image files from your smartphone or USB drive. Configure color, duplex, and copies.
                </p>
              </div>
              <button type="button" className="btn btn-kiosk-primary w-100">
                <span>Upload & Print</span>
                <ArrowForwardIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>

          {/* Action 2: Scan Document */}
          <div className="col-md-4">
            <div 
              className="kiosk-card interactive h-100 d-flex flex-column justify-content-between p-4"
              onClick={() => setScanModalOpen(true)}
              style={{ borderTop: '5px solid var(--sp-secondary)' }}
            >
              <div>
                <div 
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
                    color: 'var(--sp-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <DocumentScannerIcon style={{ fontSize: 32 }} />
                </div>
                <h5 className="fw-bold text-dark mb-2">2. Scan a Document</h5>
                <p className="text-secondary small mb-3" style={{ lineHeight: 1.6 }}>
                  Place physical ID cards, bills, or certificates on the high-speed scanner glass and save as crisp PDF.
                </p>
              </div>
              <button type="button" className="btn btn-kiosk-secondary w-100 text-primary border-primary">
                <span>Place Document on Glass</span>
                <ArrowForwardIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>

          {/* Action 3: Photocopy Document */}
          <div className="col-md-4">
            <div 
              className="kiosk-card interactive h-100 d-flex flex-column justify-content-between p-4"
              onClick={() => setCopyModalOpen(true)}
              style={{ borderTop: '5px solid var(--sp-accent)' }}
            >
              <div>
                <div 
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #ECFEFF, #CFFAFE)',
                    color: '#0891B2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <ContentCopyIcon style={{ fontSize: 32 }} />
                </div>
                <h5 className="fw-bold text-dark mb-2">3. Photocopy Document</h5>
                <p className="text-secondary small mb-3" style={{ lineHeight: 1.6 }}>
                  Instant 1-touch copy with auto-contrast and darkening for official government forms & marksheets.
                </p>
              </div>
              <button type="button" className="btn btn-kiosk-secondary w-100 text-primary border-primary">
                <span>Quick Photocopy</span>
                <ArrowForwardIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* "How it Works" in 4 Simple Steps */}
      <div className="p-4 bg-white rounded-4 border shadow-sm mt-2">
        <h5 className="fw-bold text-dark mb-4 text-center">
          How SmartPrint AI Works in 4 Simple Steps
        </h5>

        <div className="row g-3">
          <div className="col-6 col-md-3 text-center">
            <div className="d-flex flex-column align-items-center">
              <div 
                className="rounded-circle bg-light border d-flex align-items-center justify-content-center mb-2"
                style={{ width: 50, height: 50, color: 'var(--sp-primary)', fontWeight: 800 }}
              >
                1
              </div>
              <strong className="text-dark small d-block">Upload File</strong>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Scan QR on phone or browse USB</span>
            </div>
          </div>

          <div className="col-6 col-md-3 text-center">
            <div className="d-flex flex-column align-items-center">
              <div 
                className="rounded-circle bg-light border d-flex align-items-center justify-content-center mb-2"
                style={{ width: 50, height: 50, color: 'var(--sp-secondary)', fontWeight: 800 }}
              >
                2
              </div>
              <strong className="text-dark small d-block">AI Auto-Fix</strong>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Deskew, rotate & contrast enhancement</span>
            </div>
          </div>

          <div className="col-6 col-md-3 text-center">
            <div className="d-flex flex-column align-items-center">
              <div 
                className="rounded-circle bg-light border d-flex align-items-center justify-content-center mb-2"
                style={{ width: 50, height: 50, color: 'var(--sp-accent)', fontWeight: 800 }}
              >
                3
              </div>
              <strong className="text-dark small d-block">Choose Settings</strong>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>A4/A3, B&W or Color, duplex savings</span>
            </div>
          </div>

          <div className="col-6 col-md-3 text-center">
            <div className="d-flex flex-column align-items-center">
              <div 
                className="rounded-circle bg-light border d-flex align-items-center justify-content-center mb-2"
                style={{ width: 50, height: 50, color: 'var(--sp-success)', fontWeight: 800 }}
              >
                4
              </div>
              <strong className="text-dark small d-block">Scan UPI & Print</strong>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Pay via UPI QR and pick up fresh sheets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Document Scanner Modal */}
      <CameraScanModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScanCaptured={(doc) => handleScanCaptured(doc, '/preview')}
        mode="scan"
      />

      {/* Instant Photocopy Platen Modal */}
      <CameraScanModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        onScanCaptured={(doc) => handleScanCaptured(doc, '/settings')}
        mode="photocopy"
      />
    </div>
  );
}

