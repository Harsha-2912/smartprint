import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Tabs, 
  Tab, 
  Box 
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { KIOSK_CONFIG } from '../../config/printerConfig';

export default function HelpModal({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { borderRadius: '24px', padding: '0.5rem' }
      }}
    >
      <DialogTitle className="d-flex align-items-center justify-content-between pb-2">
        <div className="d-flex align-items-center gap-2">
          <div 
            style={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <HelpIcon />
          </div>
          <div>
            <h5 className="mb-0 fw-bold" style={{ color: '#172033' }}>SmartPrint AI Kiosk Help Center</h5>
            <small className="text-muted">Touch-friendly assistance & troubleshooting</small>
          </div>
        </div>
        <span className="badge bg-light text-primary border px-3 py-2">
          {KIOSK_CONFIG.kioskId}
        </span>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(_, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' }
          }}
        >
          <Tab icon={<PhoneIphoneIcon />} iconPosition="start" label="1. Mobile & QR Upload" />
          <Tab icon={<AutoFixHighIcon />} iconPosition="start" label="2. AI Corrections" />
          <Tab icon={<PaymentIcon />} iconPosition="start" label="3. Payment Help" />
          <Tab icon={<BuildIcon />} iconPosition="start" label="4. Jam & Hardware" />
          <Tab icon={<SupportAgentIcon />} iconPosition="start" label="5. Hotline & Support" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, minHeight: '320px' }}>
        {tabIndex === 0 && (
          <div className="animate__animated animate__fadeIn">
            <h6 className="fw-bold text-primary mb-2">How to upload from your smartphone using QR Code:</h6>
            <ol className="text-secondary ps-3" style={{ lineHeight: 1.8 }}>
              <li>Select <strong>Upload using QR code</strong> on the upload page.</li>
              <li>Open your phone's camera app or any QR scanner and scan the displayed QR code.</li>
              <li>Tap the opened link on your phone and select your document (PDF, PNG, or JPG up to 25MB).</li>
              <li>Your document will securely transfer to this kiosk screen within 2–3 seconds.</li>
            </ol>
            <div className="alert alert-info py-2 px-3 small rounded-3 mt-3">
              💡 <strong>Privacy Guarantee:</strong> All uploaded files are processed in a secure temporary sandbox and permanently purged immediately after printing or upon session reset.
            </div>
          </div>
        )}

        {tabIndex === 1 && (
          <div className="animate__animated animate__fadeIn">
            <h6 className="fw-bold text-primary mb-2">Understanding SmartPrint AI Document Intelligence:</h6>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>
              Our AI engine automatically scans your document before printing to prevent wasted paper and poor print quality.
            </p>
            <div className="row g-2 mt-1">
              <div className="col-md-6">
                <div className="p-2 border rounded-3 bg-light">
                  <strong className="text-dark d-block">🔄 Auto-Orientation & Deskew</strong>
                  <span className="small text-muted">Detects upside-down or tilted scanned pages and rights them.</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-2 border rounded-3 bg-light">
                  <strong className="text-dark d-block">☀️ Low Contrast Enhancement</strong>
                  <span className="small text-muted">Binarizes faded handwriting and pencil strokes for sharp laser output.</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-2 border rounded-3 bg-light">
                  <strong className="text-dark d-block">✂️ Content Edge Clipping</strong>
                  <span className="small text-muted">Warns if tables or signatures fall outside physical printer printable margins.</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-2 border rounded-3 bg-light">
                  <strong className="text-dark d-block">📄 Blank Page Detection</strong>
                  <span className="small text-muted">Identifies accidental blank divider sheets and suggests excluding them to save money.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabIndex === 2 && (
          <div className="animate__animated animate__fadeIn">
            <h6 className="fw-bold text-primary mb-2">Payment & Digital UPI Checkout:</h6>
            <ul className="text-secondary ps-3" style={{ lineHeight: 1.8 }}>
              <li><strong>UPI QR:</strong> Open Google Pay, PhonePe, Paytm, BHIM, or any banking app to scan the checkout QR.</li>
              <li><strong>Zero Convenience Fee:</strong> All self-service kiosk prints have transparent per-page rates.</li>
              <li><strong>Automatic Refund:</strong> If a paper jam or print failure occurs, the kiosk prints an instant refund QR slip and logs your transaction.</li>
            </ul>
          </div>
        )}

        {tabIndex === 3 && (
          <div className="animate__animated animate__fadeIn">
            <h6 className="fw-bold text-primary mb-2">Printer Jam or Paper Status Help:</h6>
            <p className="text-secondary" style={{ lineHeight: 1.6 }}>
              The Xerox AltaLink system has automated self-clearing sensors. In case of a rare paper jam:
            </p>
            <ol className="text-secondary ps-3" style={{ lineHeight: 1.7 }}>
              <li>Do not yank trapped paper forcibly.</li>
              <li>Follow the animated screen prompt showing which door latch (A, B, or C) to open.</li>
              <li>The kiosk attendant is automatically alerted via IoT telemetry.</li>
            </ol>
          </div>
        )}

        {tabIndex === 4 && (
          <div className="animate__animated animate__fadeIn">
            <h6 className="fw-bold text-primary mb-2">Kiosk Facility Support:</h6>
            <div className="p-3 border rounded-3 bg-light">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Kiosk ID:</span>
                <strong>{KIOSK_CONFIG.kioskId} ({KIOSK_CONFIG.terminalName})</strong>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Location:</span>
                <span>{KIOSK_CONFIG.location}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Support Helpline:</span>
                <strong className="text-primary">{KIOSK_CONFIG.supportPhone}</strong>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">Email Support:</span>
                <span>{KIOSK_CONFIG.supportEmail}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions className="p-3">
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            height: 48, 
            px: 4, 
            borderRadius: '12px', 
            bgcolor: 'var(--sp-primary)',
            fontWeight: 700 
          }}
        >
          Got it, Close Help
        </Button>
      </DialogActions>
    </Dialog>
  );
}
