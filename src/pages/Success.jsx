import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import confetti from 'canvas-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { KIOSK_CONFIG } from '../config/printerConfig';

export default function Success() {
  const navigate = useNavigate();
  const { 
    job, 
    order, 
    document, 
    pricing, 
    printSettings, 
    resetSession 
  } = usePrintSession();

  const [autoClearSeconds, setAutoClearSeconds] = useState(60);
  const [receiptPrinted, setReceiptPrinted] = useState(false);

  // Trigger confetti burst on load
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  }, []);

  // Auto-clear countdown for public kiosk security
  useEffect(() => {
    if (autoClearSeconds <= 0) {
      resetSession();
      navigate('/');
      return;
    }
    const timer = setInterval(() => {
      setAutoClearSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [autoClearSeconds, navigate, resetSession]);

  const handleFinishAndHome = () => {
    resetSession();
    navigate('/');
  };

  const handleStartNew = () => {
    resetSession();
    navigate('/upload');
  };

  const handlePrintReceiptSlip = () => {
    setReceiptPrinted(true);
    setTimeout(() => setReceiptPrinted(false), 4000);
  };

  const formattedDate = new Date().toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="d-flex flex-column gap-4 py-2">
      {/* Top Success Banner */}
      <div className="text-center">
        <div 
          className="mx-auto mb-3"
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}
        >
          <CheckCircleIcon style={{ fontSize: 54 }} />
        </div>

        <h2 className="fw-extrabold text-dark mb-1" style={{ fontWeight: 800 }}>
          Your Document Has Been Printed Successfully!
        </h2>
        <p className="lead text-secondary mb-0" style={{ fontSize: '1.1rem' }}>
          Please collect your fresh printed sheets from the lower output tray.
        </p>

        {/* Security Auto-Reset Pill */}
        <div className="d-inline-flex align-items-center gap-2 mt-2 px-3 py-1 bg-light border rounded-pill small text-muted">
          <LockOutlinedIcon style={{ fontSize: 14 }} />
          <span>Session auto-clears in <strong>{autoClearSeconds}s</strong> for privacy</span>
        </div>
      </div>

      {/* Main Grid: Left Printable Digital Receipt (Col-7), Right Actions & Support (Col-5) */}
      <div className="row g-4 align-items-start justify-content-center">
        {/* Printable Digital Receipt Card */}
        <div className="col-lg-6">
          <div 
            className="kiosk-card p-4 position-relative"
            style={{
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: 'var(--sp-shadow-lg)'
            }}
          >
            {/* Receipt Header */}
            <div className="text-center pb-3 border-bottom border-dashed mb-3">
              <h5 className="fw-bold mb-0 text-dark">SMARTPRINT AI KIOSK</h5>
              <small className="text-muted d-block">{KIOSK_CONFIG.terminalName}</small>
              <small className="text-muted">{KIOSK_CONFIG.facility}</small>
            </div>

            {/* Receipt Details */}
            <div className="d-flex flex-column gap-2 small mb-3">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Job ID:</span>
                <strong className="text-dark">{job.jobId || 'SP-JOB-894210'}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Transaction Ref:</span>
                <strong className="text-dark">{order.transactionRef || 'UPI-TXN-889123019283'}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Date & Time:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Document:</span>
                <span className="text-truncate" style={{ maxWidth: '200px' }}>
                  {document?.displayName || document?.name || 'Document.pdf'}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Format & Mode:</span>
                <span>{pricing.paperSizeLabel} • {pricing.colorModeLabel}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Sides:</span>
                <span>{pricing.printSidesLabel}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Sheets Printed:</span>
                <strong>{pricing.totalSheets} sheets ({pricing.totalImpressions} impressions)</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Payment Status:</span>
                <span className="badge bg-success-subtle text-success">PAID (UPI)</span>
              </div>
            </div>

            <hr className="my-2 border-dashed" />

            <div className="d-flex justify-content-between align-items-center pt-2">
              <strong className="text-dark" style={{ fontSize: '1.1rem' }}>Total Amount Paid:</strong>
              <strong className="text-primary" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {pricing.currencySymbol}{pricing.grandTotal}
              </strong>
            </div>

            <div className="text-center pt-3 mt-3 border-top small text-muted">
              <span>Thank you for printing with SmartPrint AI!</span>
              <br />
              <small>Need support? Call {KIOSK_CONFIG.supportPhone}</small>
            </div>
          </div>
        </div>

        {/* Right: Actions & Options */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3">
            {/* Receipt Actions */}
            <div className="kiosk-card p-3">
              <h6 className="fw-bold text-dark mb-2">Receipt Actions</h6>
              
              <div className="d-flex flex-column gap-2">
                <button 
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                  style={{ height: '48px', fontWeight: 600 }}
                  onClick={handlePrintReceiptSlip}
                  disabled={receiptPrinted}
                >
                  <PrintIcon style={{ fontSize: 20 }} />
                  <span>{receiptPrinted ? 'Receipt Slip Dispensing...' : 'Print Paper Receipt Slip'}</span>
                </button>

                <button 
                  type="button"
                  className="btn btn-light border d-flex align-items-center justify-content-center gap-2 text-secondary"
                  style={{ height: '48px', fontWeight: 600 }}
                  onClick={() => alert('Digital e-receipt sent to your linked UPI mobile number!')}
                >
                  <DownloadIcon style={{ fontSize: 20 }} />
                  <span>Send SMS / Email E-Receipt</span>
                </button>
              </div>

              {receiptPrinted && (
                <div className="alert alert-success mt-2 py-2 px-3 small rounded-3 mb-0">
                  🖨️ Receipt printed at the receipt thermal dispenser!
                </div>
              )}
            </div>

            {/* Next Customer Actions */}
            <div className="kiosk-card p-4">
              <h6 className="fw-bold text-dark mb-3">Finished Printing?</h6>

              <div className="d-flex flex-column gap-2">
                <button 
                  type="button"
                  className="btn btn-kiosk-primary btn-lg w-100"
                  onClick={handleStartNew}
                >
                  <AddCircleIcon />
                  <span>Start New Print Job</span>
                </button>

                <button 
                  type="button"
                  className="btn btn-kiosk-secondary w-100"
                  onClick={handleFinishAndHome}
                  style={{ height: '52px' }}
                >
                  <HomeIcon />
                  <span>Finish & Return Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
