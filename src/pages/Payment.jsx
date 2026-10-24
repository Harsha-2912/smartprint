import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import UPIQRCodeDisplay from '../components/payment/UPIQRCodeDisplay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Payment() {
  const navigate = useNavigate();
  const { 
    document, 
    pricing, 
    order, 
    printSettings, 
    startPrintExecution 
  } = usePrintSession();

  if (!document) {
    return (
      <div className="p-5 text-center bg-white rounded-4 border shadow-sm my-4">
        <h5 className="fw-bold text-dark mb-2">No Active Order</h5>
        <button className="btn btn-kiosk-primary" onClick={() => navigate('/upload')}>
          Return to Upload
        </button>
      </div>
    );
  }

  const isSuccess = order.status === 'payment_success';

  const handleProceedToPrinting = async () => {
    if (!isSuccess) return;
    await startPrintExecution();
    navigate('/printing');
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <LockIcon style={{ color: 'var(--sp-primary)', fontSize: 24 }} />
            <h3 className="fw-extrabold text-dark mb-0" style={{ fontWeight: 800 }}>
              Order Checkout & UPI Payment
            </h3>
          </div>
          <p className="text-secondary small mb-0 mt-1">
            Review your order itemization and scan the QR code to authorize printing.
          </p>
        </div>

        <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
          🔒 256-Bit Encrypted Kiosk Checkout
        </span>
      </div>

      {/* Grid: Left Order Summary (Col-6), Right UPI QR Card (Col-6) */}
      <div className="row g-4 align-items-stretch">
        {/* Left: Detailed Itemized Order Summary */}
        <div className="col-lg-6">
          <div className="kiosk-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <ReceiptIcon style={{ color: 'var(--sp-primary)' }} />
                <h5 className="fw-bold mb-0 text-dark">Order Itemization</h5>
              </div>

              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">File:</span>
                  <strong className="text-dark small text-truncate" style={{ maxWidth: '240px' }}>
                    {document.displayName || document.name}
                  </strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">Pages & Copies:</span>
                  <span className="small text-dark fw-semibold">
                    {pricing.effectivePagesCount} pages × {pricing.copies} copies = {pricing.totalImpressions} impressions
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Paper Required:</span>
                  <span className="small text-primary fw-bold">
                    {pricing.totalSheets} sheets ({pricing.paperSizeLabel}, {pricing.printSidesLabel})
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="table-responsive">
                <table className="table table-sm table-borderless small mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted">Print Cost ({pricing.colorModeLabel}):</td>
                      <td className="text-end fw-semibold">
                        ₹{pricing.printCostSubtotal.toFixed(2)}
                      </td>
                    </tr>
                    {pricing.paperSurchargeTotal > 0 && (
                      <tr>
                        <td className="text-muted">Paper Size Surcharge ({pricing.paperSizeLabel}):</td>
                        <td className="text-end fw-semibold">
                          +₹{pricing.paperSurchargeTotal.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {pricing.isDuplexDiscountApplied && (
                      <tr className="text-success">
                        <td>Double-Sided Paper Eco Discount:</td>
                        <td className="text-end fw-semibold">
                          -₹{pricing.duplexSavings.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-muted">AI Pre-Flight Diagnostics:</td>
                      <td className="text-end text-success fw-semibold">₹0.00 (Free)</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Kiosk Terminal Fee:</td>
                      <td className="text-end text-success fw-semibold">₹0.00 (Zero Fee)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <hr className="my-2" />

              <div className="d-flex justify-content-between align-items-baseline p-2 bg-primary-subtle rounded-3">
                <strong className="text-dark">Total Amount Due:</strong>
                <span className="fw-extrabold text-primary" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {pricing.currencySymbol}{pricing.grandTotal}
                </span>
              </div>
            </div>

            {/* Payment Confirmation State Banner */}
            {isSuccess && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-0 mt-3 p-3 rounded-3 animate__animated animate__fadeIn">
                <CheckCircleIcon style={{ fontSize: 24 }} />
                <div>
                  <strong className="d-block small">Payment Verified & Settled</strong>
                  <span className="small text-muted">Ref: {order.transactionRef}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: UPI QR Code Interactive Display */}
        <div className="col-lg-6">
          <div className="kiosk-card p-4 h-100">
            <UPIQRCodeDisplay onPaymentComplete={() => {}} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
        <button 
          type="button" 
          className="btn btn-kiosk-secondary"
          onClick={() => navigate('/settings')}
        >
          <ArrowBackIcon />
          <span>Back to Settings</span>
        </button>

        <button 
          type="button" 
          className={`btn ${isSuccess ? 'btn-kiosk-success btn-lg' : 'btn-kiosk-primary'}`}
          onClick={handleProceedToPrinting}
          disabled={!isSuccess}
          style={{ opacity: isSuccess ? 1 : 0.5, height: '56px', padding: '0 2rem' }}
          title={isSuccess ? 'Click to initiate Xerox engine' : 'Awaiting payment confirmation before printing'}
        >
          {isSuccess ? (
            <>
              <CheckCircleIcon />
              <span>Payment Confirmed — Start Printing Now</span>
              <ArrowForwardIcon />
            </>
          ) : (
            <>
              <span>Awaiting UPI Payment Confirmation...</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
