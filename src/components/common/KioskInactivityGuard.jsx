import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePrintSession } from '../../context/PrintSessionContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import LockClockIcon from '@mui/icons-material/LockClock';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const INACTIVITY_TIMEOUT_MS = 90 * 1000; // 90 seconds before warning
const WARNING_COUNTDOWN_SECONDS = 15;   // 15 seconds to respond

export default function KioskInactivityGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetSession } = usePrintSession();

  const [warningOpen, setWarningOpen] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN_SECONDS);
  const timerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Disable browser right-click context menu across kiosk touch display
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const resetInactivityTimer = () => {
    if (warningOpen) return; // Don't reset if warning modal is already showing

    if (timerRef.current) clearTimeout(timerRef.current);

    // Only monitor on active session pages (not Welcome home and not Printing in progress)
    if (location.pathname !== '/' && location.pathname !== '/printing') {
      timerRef.current = setTimeout(() => {
        setCountdown(WARNING_COUNTDOWN_SECONDS);
        setWarningOpen(true);
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  // Activity event listeners
  useEffect(() => {
    const activityEvents = ['pointerdown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach(evt => window.addEventListener(evt, handleActivity));
    resetInactivityTimer();

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname, warningOpen]);

  // Handle warning countdown tick
  useEffect(() => {
    if (warningOpen) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            handleTimeoutReset();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [warningOpen]);

  const handleTimeoutReset = () => {
    setWarningOpen(false);
    resetSession();
    navigate('/');
  };

  const handleStayActive = () => {
    setWarningOpen(false);
    resetInactivityTimer();
  };

  return (
    <Dialog 
      open={warningOpen} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '24px',
          padding: '16px',
          border: '2px solid #F59E0B',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
        }
      }}
    >
      <DialogTitle className="text-center pt-2">
        <div 
          className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: 64, height: 64, background: '#FEF3C7', color: '#D97706' }}
        >
          <LockClockIcon style={{ fontSize: 36 }} />
        </div>
        <h5 className="fw-bold text-dark mb-0">Are You Still There?</h5>
      </DialogTitle>

      <DialogContent className="text-center py-2">
        <p className="text-secondary small mb-3">
          This kiosk is unattended. For privacy, your session will automatically reset and delete uploaded files in:
        </p>
        <div className="display-4 fw-extrabold text-danger mb-2">
          {countdown}s
        </div>
      </DialogContent>

      <DialogActions className="p-2 d-flex justify-content-between gap-2">
        <Button 
          onClick={handleTimeoutReset} 
          color="inherit" 
          className="fw-bold"
          style={{ borderRadius: '12px' }}
        >
          Reset Now
        </Button>
        <button 
          type="button" 
          className="btn btn-kiosk-primary px-4 py-2 flex-grow-1"
          onClick={handleStayActive}
          style={{ height: '48px', fontSize: '1.05rem' }}
        >
          Continue Session
        </button>
      </DialogActions>
    </Dialog>
  );
}
