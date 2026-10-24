import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePrintSession } from '../../context/PrintSessionContext';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';

export default function UPIQRCodeDisplay({ onPaymentComplete }) {
  const { 
    order, 
    pricing, 
    simulatePaymentSuccess, 
    simulatePaymentFailure, 
    initPaymentOrder 
  } = usePrintSession();

  const [secondsRemaining, setSecondsRemaining] = useState(300);

  useEffect(() => {
    if (!order.orderId) {
      initPaymentOrder();
    }
  }, []);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isVerifying = order.status === 'verifying';
  const isSuccess = order.status === 'payment_success';
  const isFailed = order.status === 'payment_failed';

  const upiPayload = order.upiString || `upi://pay?pa=smartprint.kiosk@icici&pn=SmartPrintAI&am=${pricing.grandTotal}&cu=INR`;

  return (
    <div className="d-flex flex-column align-items-center text-center p-3 h-100 justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
          <QrCode2Icon style={{ color: 'var(--sp-primary)', fontSize: 26 }} />
          <h5 className="fw-bold mb-0 text-dark">
            Scan UPI QR Code to Pay
          </h5>
        </div>
        <p className="text-secondary small mb-2">
          Open Google Pay, PhonePe, Paytm, BHIM, or any banking app
        </p>
      </div>

      {/* QR Code Container */}
      <div 
        className="p-3 bg-white rounded-4 shadow-sm border position-relative my-2 d-flex flex-column align-items-center justify-content-center"
        style={{ width: '240px', minHeight: '240px' }}
      >
        {isVerifying ? (
          <div className="p-4 text-center">
            <CircularProgress size={48} sx={{ color: 'var(--sp-primary)' }} />
            <h6 className="fw-bold mt-3 mb-1 text-dark">Verifying Transaction...</h6>
            <small className="text-muted">Awaiting bank confirmation hook</small>
          </div>
        ) : isSuccess ? (
          <div className="p-3 text-center animate__animated animate__zoomIn">
            <div 
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                color: '#10B981'
              }}
            >
              <CheckCircleIcon style={{ fontSize: 44 }} />
            </div>
            <h6 className="fw-bold text-success mt-2 mb-1">Payment Received!</h6>
            <small className="text-muted d-block">Ref: {order.transactionRef?.slice(0, 16)}</small>
          </div>
        ) : isFailed ? (
          <div className="p-3 text-center animate__animated animate__shakeX">
            <div 
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: '#FFF1F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                color: '#F43F5E'
              }}
            >
              <ErrorIcon style={{ fontSize: 44 }} />
            </div>
            <h6 className="fw-bold text-danger mt-2 mb-1">Payment Failed</h6>
            <small className="text-muted d-block">{order.errorMessage || 'Transaction cancelled or timeout'}</small>
          </div>
        ) : (
          <>
            <QRCodeSVG 
              value={upiPayload}
              size={195}
              level="H"
              includeMargin={true}
            />
            <div className="small fw-bold text-primary mt-1">
              {pricing.currencySymbol}{pricing.grandTotal}
            </div>
          </>
        )}
      </div>

      {/* Timer & Supported UPI Badges */}
      <div className="w-100">
        {!isSuccess && !isFailed && (
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span className="anim-pulse-glow" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span className="small text-muted fw-semibold">
              QR Code valid for: <strong className="text-dark">{formatTimer(secondsRemaining)}</strong>
            </span>
          </div>
        )}

        {/* Supported Apps Logos Pill */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          <span className="badge bg-light text-secondary border px-2 py-1">GPay</span>
          <span className="badge bg-light text-secondary border px-2 py-1">PhonePe</span>
          <span className="badge bg-light text-secondary border px-2 py-1">Paytm</span>
          <span className="badge bg-light text-secondary border px-2 py-1">BHIM UPI</span>
        </div>

        {/* Tester Simulation Controls (Clearly Identified Demo Flow) */}
        <div className="p-3 rounded-3 bg-light border text-start">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small fw-bold text-dark">
              🧪 Tester Simulated Payment Flow
            </span>
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning small">
              Demo Mode
            </span>
          </div>
          <div className="d-flex gap-2">
            <button 
              type="button" 
              className="btn btn-success btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={async () => {
                const res = await simulatePaymentSuccess();
                if (onPaymentComplete) onPaymentComplete(res);
              }}
              disabled={isVerifying || isSuccess}
              style={{ height: '42px', fontWeight: 600, borderRadius: '10px' }}
            >
              <CheckCircleIcon style={{ fontSize: 18 }} />
              <span>Simulate Pay ₹{pricing.grandTotal}</span>
            </button>

            <button 
              type="button" 
              className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-1"
              onClick={simulatePaymentFailure}
              disabled={isVerifying || isSuccess}
              style={{ height: '42px', fontWeight: 600, borderRadius: '10px', px: 3 }}
            >
              <ErrorIcon style={{ fontSize: 18 }} />
              <span>Simulate Fail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
