import React, { useEffect, useState } from 'react';
import { usePrintSession } from '../../context/PrintSessionContext';
import { LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import FastForwardIcon from '@mui/icons-material/FastForward';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function PrintJobProgressTracker({ onJobCompleted }) {
  const { 
    job, 
    updateJobStatus, 
    document, 
    pricing, 
    printerTelemetry, 
    setHardwareDiagnostic 
  } = usePrintSession();

  const [simulatedError, setSimulatedError] = useState(null); // 'JAM' | 'PAPER_OUT' | null

  const totalImpressions = pricing.totalImpressions || 1;


  // Auto-progress simulation effect
  useEffect(() => {
    if (job.status === 'completed' || simulatedError) return;

    const interval = setInterval(() => {
      // If paper jam or error was triggered in hardware telemetry, pause job
      if (printerTelemetry.hardwareStatus === 'PAPER_JAM') {
        updateJobStatus('paper_jam', job.progressPercent, job.currentPage, 'Paper jam in Tray 1 feed roller');
        return;
      }
      if (printerTelemetry.hardwareStatus === 'PAPER_OUT') {
        updateJobStatus('paper_out', job.progressPercent, job.currentPage, 'Tray 1 is out of paper');
        return;
      }

      // Progression phases
      let nextPercent = job.progressPercent + 15;
      let nextStatus = job.status;
      let nextCurrentPage = job.currentPage;

      if (nextPercent <= 20) {
        nextStatus = 'preparing';
      } else if (nextPercent <= 40) {
        nextStatus = 'sending_job';
      } else if (nextPercent < 100) {
        nextStatus = 'printing';
        nextCurrentPage = Math.min(totalImpressions, Math.ceil((nextPercent / 100) * totalImpressions));
      } else {
        nextPercent = 100;
        nextStatus = 'completed';
        nextCurrentPage = totalImpressions;
      }

      updateJobStatus(nextStatus, nextPercent, nextCurrentPage);

      if (nextStatus === 'completed') {
        clearInterval(interval);
        setTimeout(() => {
          if (onJobCompleted) onJobCompleted();
        }, 800);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [job.progressPercent, job.status, simulatedError, printerTelemetry.hardwareStatus]);

  // Fast forward test helper
  const handleFastForward = () => {
    updateJobStatus('completed', 100, totalImpressions);
    if (onJobCompleted) onJobCompleted();
  };

  // Simulate error hooks
  const handleTriggerJam = () => {
    setSimulatedError('JAM');
    setHardwareDiagnostic('PAPER_JAM');
    updateJobStatus('paper_jam', job.progressPercent, job.currentPage, 'Paper jam in Tray 1 feed roller. Open door B.');
  };

  const handleClearError = () => {
    setSimulatedError(null);
    setHardwareDiagnostic('READY');
    updateJobStatus('printing', job.progressPercent, job.currentPage);
  };

  // Status Labels
  let statusText = 'Preparing Document...';
  if (job.status === 'sending_job') statusText = 'Sending Print Stream to Xerox Engine...';

  if (job.status === 'printing') statusText = `Printing Page ${job.currentPage} of ${totalImpressions}...`;
  if (job.status === 'completed') statusText = 'Finishing & Stacking in Output Tray!';
  if (job.status === 'paper_jam') statusText = '⚠️ Paper Jam Detected in Tray 1';
  if (job.status === 'paper_out') statusText = '⚠️ Tray 1 Out of Paper';

  const hasHardwareError = job.status === 'paper_jam' || job.status === 'paper_out';

  return (
    <div className="kiosk-card p-4">
      {/* Top Header: Job ID & Status Badge */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <span className="small text-muted d-block">Job Reference ID</span>
          <h5 className="fw-bold mb-0 text-dark">
            {job.jobId || 'SP-JOB-894210'}
          </h5>
        </div>

        <span 
          className={`badge px-3 py-2 ${
            hasHardwareError ? 'bg-danger' : job.status === 'completed' ? 'bg-success' : 'bg-primary'
          }`}
          style={{ fontSize: '0.85rem' }}
        >
          {statusText}
        </span>
      </div>

      {/* Progress Bar & Counter */}
      <div className="my-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="small fw-bold text-dark">
            {document?.displayName || document?.name || 'Document'}
          </span>
          <span className="fw-bold text-primary">
            {job.progressPercent}%
          </span>
        </div>

        <LinearProgress 
          variant="determinate" 
          value={job.progressPercent}
          sx={{
            height: 14,
            borderRadius: 7,
            bgcolor: '#E2E8F0',
            '& .MuiLinearProgress-bar': {
              bgcolor: hasHardwareError ? '#F43F5E' : 'var(--sp-primary)',
              borderRadius: 7
            }
          }}
        />

        <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
          <span>Printed: <strong>{job.currentPage}</strong> / {totalImpressions} impressions</span>
          <span>Estimated wait: <strong>{Math.max(0, Math.ceil((100 - job.progressPercent) / 10))} sec</strong></span>
        </div>
      </div>

      {/* Hardware Error Recovery Prompt */}
      {hasHardwareError && (
        <div className="alert alert-danger p-3 rounded-3 mt-3 animate__animated animate__shakeX">
          <div className="d-flex align-items-center gap-2 mb-1">
            <ErrorIcon />
            <strong className="text-danger">Print Paused: {job.errorMessage}</strong>
          </div>
          <p className="small mb-2 text-dark">
            Recovery Instructions: Please open Side Door B, release the roller lever to clear the paper sheet, and click Resume.
          </p>
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            onClick={handleClearError}
          >
            <RefreshIcon style={{ fontSize: 16 }} />
            <span>Simulate Jam Cleared / Resume Printing</span>
          </button>
        </div>
      )}

      {/* Simulation Controls for testing */}
      <div className="mt-4 p-3 bg-light border rounded-3">
        <span className="small fw-bold text-dark d-block mb-2">
          🧪 Tester Hardware Progress Simulation:
        </span>
        <div className="d-flex flex-wrap gap-2">
          <button 
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={handleFastForward}
          >
            <FastForwardIcon style={{ fontSize: 16 }} />
            <span>Fast-Forward to 100% (Completed)</span>
          </button>

          {!hasHardwareError ? (
            <button 
              type="button"
              className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1 text-dark"
              onClick={handleTriggerJam}
            >
              <WarningAmberIcon style={{ fontSize: 16 }} />
              <span>Simulate Mid-Print Jam</span>
            </button>
          ) : (
            <button 
              type="button"
              className="btn btn-success btn-sm d-flex align-items-center gap-1"
              onClick={handleClearError}
            >
              <CheckCircleIcon style={{ fontSize: 16 }} />
              <span>Resume Printing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
