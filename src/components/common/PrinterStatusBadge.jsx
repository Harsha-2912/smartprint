import React, { useState } from 'react';
import { usePrintSession } from '../../context/PrintSessionContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  LinearProgress,
  Chip 
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function PrinterStatusBadge() {
  const { printerTelemetry, setHardwareDiagnostic } = usePrintSession();
  const [openDiagnostics, setOpenDiagnostics] = useState(false);

  const isReady = printerTelemetry.hardwareStatus === 'READY';
  const isJam = printerTelemetry.hardwareStatus === 'PAPER_JAM';
  const isPaperOut = printerTelemetry.hardwareStatus === 'PAPER_OUT';
  const isOffline = printerTelemetry.hardwareStatus === 'OFFLINE';

  const badgeColor = isReady ? 'var(--sp-success)' : isOffline ? 'var(--sp-error)' : 'var(--sp-warning)';
  const badgeBg = isReady ? 'var(--sp-success-light)' : isOffline ? 'var(--sp-error-light)' : 'var(--sp-warning-light)';
  const badgeBorder = isReady ? 'rgba(16, 185, 129, 0.3)' : isOffline ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)';

  return (
    <>
      <div 
        onClick={() => setOpenDiagnostics(true)}
        className="d-flex align-items-center gap-2 px-3 py-1"
        style={{
          background: badgeBg,
          border: `1.5px solid ${badgeBorder}`,
          borderRadius: '30px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--sp-shadow-sm)'
        }}
        title="Click to view Xerox hardware telemetry & simulate diagnostics"
      >
        <span 
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            backgroundColor: badgeColor,
            boxShadow: `0 0 6px ${badgeColor}`
          }}
          className={isReady ? 'anim-pulse-success' : 'anim-pulse-glow'}
        />
        <PrintIcon style={{ fontSize: 18, color: badgeColor }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#172033' }}>
          {isReady ? 'Printer Online' : isJam ? 'Paper Jam' : isPaperOut ? 'Paper Empty' : 'Offline'}
        </span>
        <span className="badge bg-light text-secondary border ms-1" style={{ fontSize: '0.7rem' }}>
          Tray: 92%
        </span>
      </div>

      {/* Hardware Diagnostics Modal */}
      <Dialog 
        open={openDiagnostics} 
        onClose={() => setOpenDiagnostics(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { borderRadius: '20px', padding: '0.5rem' }
        }}
      >
        <DialogTitle className="d-flex align-items-center justify-content-between pb-2">
          <div className="d-flex align-items-center gap-2">
            <SettingsSuggestIcon style={{ color: 'var(--sp-primary)', fontSize: 28 }} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Xerox Hardware Telemetry</span>
          </div>
          <Chip 
            label={printerTelemetry.connectionStatus} 
            color={isReady ? 'success' : 'error'} 
            size="small" 
            variant="filled"
          />
        </DialogTitle>

        <DialogContent dividers>
          <div className="mb-3 p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small">Connected Model:</span>
              <strong className="text-dark small">{printerTelemetry.model}</strong>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small">Status Message:</span>
              <span className="badge bg-white text-dark border small">{printerTelemetry.statusMessage}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">Resolution / Engine:</span>
              <span className="small text-secondary">{printerTelemetry.dpi}</span>
            </div>
          </div>

          <h6 className="fw-bold mb-2 text-dark small text-uppercase">Toner Levels</h6>
          <div className="row g-2 mb-3">
            <div className="col-3 text-center">
              <div className="p-2 border rounded-3 bg-light">
                <span className="small d-block fw-bold mb-1">Black</span>
                <LinearProgress variant="determinate" value={94} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#172033' } }} />
                <span className="small text-muted mt-1 d-block">94%</span>
              </div>
            </div>
            <div className="col-3 text-center">
              <div className="p-2 border rounded-3 bg-light">
                <span className="small d-block fw-bold mb-1">Cyan</span>
                <LinearProgress variant="determinate" value={88} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#06B6D4' } }} />
                <span className="small text-muted mt-1 d-block">88%</span>
              </div>
            </div>
            <div className="col-3 text-center">
              <div className="p-2 border rounded-3 bg-light">
                <span className="small d-block fw-bold mb-1">Magenta</span>
                <LinearProgress variant="determinate" value={91} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#EC4899' } }} />
                <span className="small text-muted mt-1 d-block">91%</span>
              </div>
            </div>
            <div className="col-3 text-center">
              <div className="p-2 border rounded-3 bg-light">
                <span className="small d-block fw-bold mb-1">Yellow</span>
                <LinearProgress variant="determinate" value={89} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#FACC15' } }} />
                <span className="small text-muted mt-1 d-block">89%</span>
              </div>
            </div>
          </div>

          <h6 className="fw-bold mb-2 text-dark small text-uppercase">Paper Feed Trays</h6>
          <div className="row g-2 mb-3">
            <div className="col-4">
              <div className="p-2 border rounded-3 bg-white">
                <div className="small fw-bold">Tray 1 (A4)</div>
                <div className="text-success small fw-semibold">92% (460 shts)</div>
              </div>
            </div>
            <div className="col-4">
              <div className="p-2 border rounded-3 bg-white">
                <div className="small fw-bold">Tray 2 (A3)</div>
                <div className="text-success small fw-semibold">78% (390 shts)</div>
              </div>
            </div>
            <div className="col-4">
              <div className="p-2 border rounded-3 bg-white">
                <div className="small fw-bold">Tray 3 (Letter)</div>
                <div className="text-success small fw-semibold">100% (500 shts)</div>
              </div>
            </div>
          </div>

          {/* Test Simulation Controls */}
          <div className="p-3 rounded-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <span className="d-block fw-bold text-dark small mb-2">
              🧪 Tester Simulation Controls (Simulate Hardware State):
            </span>
            <div className="d-flex flex-wrap gap-2">
              <Button 
                size="small" 
                variant={isReady ? 'contained' : 'outlined'} 
                color="success" 
                onClick={() => setHardwareDiagnostic('READY')}
                startIcon={<CheckCircleIcon />}
              >
                Simulate Ready
              </Button>
              <Button 
                size="small" 
                variant={isJam ? 'contained' : 'outlined'} 
                color="warning" 
                onClick={() => setHardwareDiagnostic('PAPER_JAM')}
                startIcon={<WarningAmberIcon />}
              >
                Simulate Paper Jam
              </Button>
              <Button 
                size="small" 
                variant={isPaperOut ? 'contained' : 'outlined'} 
                color="warning" 
                onClick={() => setHardwareDiagnostic('PAPER_OUT')}
              >
                Simulate Paper Out
              </Button>
              <Button 
                size="small" 
                variant={isOffline ? 'contained' : 'outlined'} 
                color="error" 
                onClick={() => setHardwareDiagnostic('OFFLINE')}
                startIcon={<ErrorIcon />}
              >
                Simulate Offline
              </Button>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="px-3 py-2">
          <Button 
            onClick={() => setOpenDiagnostics(false)} 
            variant="contained" 
            sx={{ bgcolor: 'var(--sp-primary)', borderRadius: '10px' }}
          >
            Close Telemetry
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
