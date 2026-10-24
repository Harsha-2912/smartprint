import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import PrinterStatusBadge from './PrinterStatusBadge';
import ConfirmationDialog from './ConfirmationDialog';
import HelpModal from './HelpModal';
import { usePrintSession } from '../../context/PrintSessionContext';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { document, resetSession } = usePrintSession();

  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [isFullscreen, setIsFullscreen] = useState(!!window.document.fullscreenElement);

  const toggleFullscreen = () => {
    if (!window.document.fullscreenElement) {
      window.document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (window.document.exitFullscreen) {
        window.document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isHome = location.pathname === '/';

  const handleLogoClick = () => {
    if (document && !isHome) {
      setOpenCancelDialog(true);
    } else {
      navigate('/');
    }
  };

  const handleConfirmCancel = () => {
    resetSession();
    setOpenCancelDialog(false);
    navigate('/');
  };

  return (
    <>
      <header 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0.75rem 2rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          {/* Logo Area */}
          <BrandLogo size="medium" onClick={handleLogoClick} />

          {/* Right Controls: Clock, Printer Status, Language, Help & Cancel */}
          <div className="d-flex align-items-center gap-3">
            {/* Live Kiosk Clock */}
            <div className="d-none d-md-flex align-items-center px-3 py-1 bg-light rounded-pill border">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', letterSpacing: '0.04em' }}>
                {time}
              </span>
            </div>

            {/* Hardware Status Badge */}
            <PrinterStatusBadge />

            {/* Language Selector */}
            <div className="dropdown">
              <button 
                className="btn btn-light btn-sm d-flex align-items-center gap-1 border rounded-pill px-3 py-1"
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}
              >
                <TranslateIcon style={{ fontSize: 16, color: '#2563EB' }} />
                <span>{currentLang}</span>
              </button>
              <ul className="dropdown-menu shadow-sm" style={{ borderRadius: '12px' }}>
                {['English', 'हिन्दी (Hindi)', 'Español', 'Français', 'Deutsch'].map(lang => (
                  <li key={lang}>
                    <button 
                      className={`dropdown-item ${currentLang === lang ? 'active' : ''}`}
                      onClick={() => setCurrentLang(lang.split(' ')[0])}
                    >
                      {lang}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fullscreen Kiosk Mode Toggle */}
            <button 
              onClick={toggleFullscreen}
              className="btn btn-light btn-sm d-flex align-items-center gap-1 rounded-pill px-3 py-1 border"
              style={{ fontWeight: 600, height: 38, color: '#475569' }}
              title={isFullscreen ? "Exit Fullscreen Kiosk" : "Enter Fullscreen Kiosk"}
            >
              {isFullscreen ? <FullscreenExitIcon style={{ fontSize: 18 }} /> : <FullscreenIcon style={{ fontSize: 18 }} />}
              <span className="d-none d-lg-inline">{isFullscreen ? 'Window' : 'Fullscreen'}</span>
            </button>

            {/* Help Button */}
            <button 
              onClick={() => setOpenHelpModal(true)}
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 rounded-pill px-3 py-1"
              style={{ fontWeight: 600, height: 38 }}
              title="Help & Guides"
            >
              <HelpIcon style={{ fontSize: 18 }} />
              <span className="d-none d-sm-inline">Help</span>
            </button>


            {/* Cancel Session Button (visible when document or non-home) */}
            {!isHome && (
              <button 
                onClick={() => setOpenCancelDialog(true)}
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                style={{ fontWeight: 600, height: 38 }}
                title="Cancel Session & Clean Up"
              >
                <CloseIcon style={{ fontSize: 18 }} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation & Help Modals */}
      <ConfirmationDialog 
        open={openCancelDialog}
        title="Cancel Print Session?"
        message="Are you sure you want to cancel? All uploaded documents and chosen print settings will be securely erased for customer privacy."
        confirmLabel="Yes, Cancel Session"
        cancelLabel="Continue Printing"
        severity="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setOpenCancelDialog(false)}
      />

      <HelpModal 
        open={openHelpModal} 
        onClose={() => setOpenHelpModal(false)} 
      />
    </>
  );
}
