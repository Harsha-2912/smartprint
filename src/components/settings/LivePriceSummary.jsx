import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../../context/PrintSessionContext';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function LivePriceSummary() {
  const navigate = useNavigate();
  const { pricing, document, printSettings } = usePrintSession();

  return (
    <div className="kiosk-card p-3 d-flex flex-column justify-content-between h-100">
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div 
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sp-primary)'
            }}
          >
            <ReceiptLongIcon style={{ fontSize: 22 }} />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Live Print Estimate</h6>
            <small className="text-muted">Itemized calculation</small>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="d-flex flex-column gap-2 mb-3 small">
          <div className="d-flex justify-content-between text-secondary">
            <span>Document:</span>
            <strong className="text-dark text-truncate" style={{ maxWidth: '160px' }}>
              {document?.displayName || document?.name || 'Document'}
            </strong>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Selected Pages:</span>
            <span className="fw-semibold text-dark">{pricing.effectivePagesCount} pages</span>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Copies:</span>
            <span className="fw-semibold text-dark">× {pricing.copies}</span>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Print Impressions:</span>
            <span className="fw-semibold text-dark">{pricing.totalImpressions} total</span>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Colour Mode:</span>
            <span className="badge bg-light text-dark border">{pricing.colorModeLabel}</span>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Paper & Format:</span>
            <span className="badge bg-light text-dark border">{pricing.paperSizeLabel}</span>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Print Sides:</span>
            <span className="badge bg-light text-dark border">{pricing.printSidesLabel}</span>
          </div>

          <div className="d-flex justify-content-between text-secondary">
            <span>Physical Sheets Required:</span>
            <strong className="text-primary">{pricing.totalSheets} sheets</strong>
          </div>

          {pricing.isDuplexDiscountApplied && (
            <div className="d-flex justify-content-between text-success fw-semibold">
              <span>Duplex Paper Discount:</span>
              <span>-₹{pricing.duplexSavings.toFixed(2)}</span>
            </div>
          )}

          <div className="d-flex justify-content-between text-muted">
            <span>AI Optimization Fee:</span>
            <span className="badge bg-success-subtle text-success">FREE Included</span>
          </div>
        </div>

        <hr className="my-2" />

        {/* Grand Total Highlight */}
        <div className="d-flex align-items-baseline justify-content-between mb-3">
          <div>
            <span className="text-muted small d-block">Total Payable:</span>
            <span className="badge bg-light text-secondary border">Inclusive of all taxes</span>
          </div>
          <div className="text-end">
            <span className="fw-extrabold text-primary" style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              {pricing.currencySymbol}{pricing.grandTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button 
        type="button"
        className="btn btn-kiosk-primary btn-lg w-100"
        onClick={() => navigate('/payment')}
      >
        <span>Proceed to Payment</span>
        <ArrowForwardIcon />
      </button>
    </div>
  );
}
