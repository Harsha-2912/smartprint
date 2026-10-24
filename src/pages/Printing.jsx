import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import KioskPrinterVisualizer from '../components/printing/KioskPrinterVisualizer';
import PrintJobProgressTracker from '../components/printing/PrintJobProgressTracker';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Printing() {
  const navigate = useNavigate();
  const { job, order } = usePrintSession();

  // Safety guard: If no payment confirmed, redirect to payment
  useEffect(() => {
    if (order.status !== 'payment_success') {
      navigate('/payment');
    }
  }, [order.status, navigate]);

  const handleJobFinished = () => {
    navigate('/success');
  };

  const isPrinting = job.status === 'printing' || job.status === 'sending_job' || job.status === 'preparing';
  const hasHardwareError = job.status === 'paper_jam' || job.status === 'paper_out';

  return (
    <div className="d-flex flex-column gap-3 py-2">
      {/* Title */}
      <div className="text-center">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-primary-subtle text-primary rounded-pill mb-2">
          <PrintIcon style={{ fontSize: 18 }} />
          <span className="small fw-bold">AUTONOMOUS PRINT ENGINE ACTIVE</span>
        </div>
        <h3 className="fw-extrabold text-dark mb-1" style={{ fontWeight: 800 }}>
          Printing in Progress
        </h3>
        <p className="text-secondary small mb-0">
          Your document is being rendered and laser printed. Please stand by the output collection tray.
        </p>
      </div>

      {/* Grid: Left Visualizer SVG (Col-5), Right Progress Tracker & Diagnostics (Col-7) */}
      <div className="row g-4 align-items-center my-1">
        <div className="col-lg-5">
          <div className="kiosk-card p-4 text-center">
            <KioskPrinterVisualizer isPrinting={isPrinting} hasError={hasHardwareError} />
          </div>
        </div>

        <div className="col-lg-7">
          <PrintJobProgressTracker onJobCompleted={handleJobFinished} />
        </div>
      </div>

      {/* Action if already completed */}
      {job.status === 'completed' && (
        <div className="text-center mt-3 animate__animated animate__fadeIn">
          <button 
            type="button" 
            className="btn btn-kiosk-success btn-lg px-5"
            onClick={handleJobFinished}
            style={{ height: '58px', fontSize: '1.2rem' }}
          >
            <CheckCircleIcon style={{ fontSize: 24 }} />
            <span>View Receipt & Complete Session</span>
          </button>
        </div>
      )}
    </div>
  );
}
