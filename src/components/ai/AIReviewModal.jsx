import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function AIReviewModal({ open, onClose, onApplyAll }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { borderRadius: '24px', padding: '0.75rem' }
      }}
    >
      <DialogTitle className="d-flex align-items-center gap-2 pb-2">
        <div 
          style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}
        >
          <CompareArrowsIcon />
        </div>
        <div>
          <h5 className="mb-0 fw-bold" style={{ color: '#172033' }}>
            Review AI Changes: Before vs After
          </h5>
          <small className="text-muted">Inspect each proposed automated enhancement before applying</small>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <div className="row g-3">
          {/* Comparison 1: Page 2 Rotation */}
          <div className="col-12">
            <div className="p-3 border rounded-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-dark">1. Page 2: Inverted Page Orientation (180°)</strong>
                <span className="badge bg-primary">Auto-Rotation Fix</span>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-6">
                  <div className="p-2 border bg-white rounded-2 text-center">
                    <span className="badge bg-danger-subtle text-danger mb-2">Before</span>
                    <div 
                      className="p-3 border rounded-1 bg-light text-muted small mx-auto"
                      style={{ width: '100px', height: '130px', transform: 'rotate(180deg)' }}
                    >
                      Upside Down
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 border bg-white rounded-2 text-center">
                    <span className="badge bg-success-subtle text-success mb-2">After AI Enhancement</span>
                    <div 
                      className="p-3 border rounded-1 bg-light text-primary small mx-auto fw-bold"
                      style={{ width: '100px', height: '130px', transform: 'rotate(0deg)' }}
                    >
                      Upright 0°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison 2: Page 1 Skew */}
          <div className="col-12">
            <div className="p-3 border rounded-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-dark">2. Page 1: 3.4° Skew Alignment</strong>
                <span className="badge bg-primary">Auto-Deskew</span>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-6">
                  <div className="p-2 border bg-white rounded-2 text-center">
                    <span className="badge bg-warning-subtle text-warning mb-2">Before (Tilted 3.4°)</span>
                    <div 
                      className="p-3 border rounded-1 bg-light text-muted small mx-auto"
                      style={{ width: '100px', height: '130px', transform: 'rotate(3.4deg)' }}
                    >
                      Tilted Scan
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 border bg-white rounded-2 text-center">
                    <span className="badge bg-success-subtle text-success mb-2">After (Aligned 0.0°)</span>
                    <div 
                      className="p-3 border rounded-1 bg-light text-primary small mx-auto fw-bold"
                      style={{ width: '100px', height: '130px', transform: 'rotate(0deg)' }}
                    >
                      Square & True
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison 3: Page 5 Blank Page */}
          <div className="col-12">
            <div className="p-3 border rounded-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-dark">3. Page 5: 99.4% Blank Divider Sheet</strong>
                <span className="badge bg-secondary">Paper Saving Exclude</span>
              </div>
              <p className="text-secondary small mb-0">
                AI recommends excluding Page 5 from printing queue. This saves 1 physical sheet and ₹2.00 print fee.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-3 gap-2">
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ height: 48, borderRadius: '12px', fontWeight: 600, color: '#64748B', borderColor: '#CBD5E1' }}
        >
          Close Review
        </Button>
        <Button 
          onClick={() => {
            onApplyAll();
            onClose();
          }}
          variant="contained"
          sx={{ height: 48, px: 3, borderRadius: '12px', fontWeight: 700, bgcolor: 'var(--sp-primary)' }}
          startIcon={<CheckCircleIcon />}
        >
          Apply All 4 Corrections
        </Button>
      </DialogActions>
    </Dialog>
  );
}
