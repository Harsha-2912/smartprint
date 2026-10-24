import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { documentService } from '../../services/documentService';
import { usePrintSession } from '../../context/PrintSessionContext';
import { CircularProgress } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function QRCodeUploadCard({ onUploadSuccess }) {
  const { setDocument } = usePrintSession();

  const [sessionData, setSessionData] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('WAITING_FOR_UPLOAD'); // 'WAITING_FOR_UPLOAD' | 'FILE_RECEIVED' | 'EXPIRED'
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isSimulatingPhone, setIsSimulatingPhone] = useState(false);

  // Initialize or refresh session
  const initSession = async () => {
    const res = await documentService.getQRCodeSession();
    setSessionData(res);
    setSessionStatus('WAITING_FOR_UPLOAD');
    setSecondsRemaining(res.expiresInSeconds || 300);
  };

  useEffect(() => {
    initSession();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setSessionStatus('EXPIRED');
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Real-time polling for mobile phone uploads
  useEffect(() => {
    if (!sessionData?.sessionToken || sessionStatus !== 'WAITING_FOR_UPLOAD') {
      return;
    }

    const pollTimer = setInterval(async () => {
      try {
        const res = await documentService.checkQRSessionStatus(sessionData.sessionToken);
        if (res && res.status === 'FILE_RECEIVED' && res.document) {
          setSessionStatus('FILE_RECEIVED');
          setDocument(res.document);
          setTimeout(() => {
            if (onUploadSuccess) onUploadSuccess(res.document);
          }, 1200);
        }
      } catch (err) {
        // Ignore transient network errors during polling
      }
    }, 2000);

    return () => clearInterval(pollTimer);
  }, [sessionData, sessionStatus, onUploadSuccess, setDocument]);

  // Demo: Simulate mobile phone upload
  const handleSimulatePhoneUpload = async () => {
    setIsSimulatingPhone(true);
    try {
      const res = await documentService.simulatePhoneUpload();
      if (res && res.success) {
        setSessionStatus('FILE_RECEIVED');
        setDocument(res.document);
        setTimeout(() => {
          if (onUploadSuccess) onUploadSuccess(res.document);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulatingPhone(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="d-flex flex-column align-items-center text-center p-3 h-100 justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <SmartphoneIcon style={{ color: 'var(--sp-primary)', fontSize: 24 }} />
          <h5 className="fw-bold mb-0" style={{ color: '#172033' }}>
            Upload from your Phone
          </h5>
        </div>
        <p className="text-secondary small mb-3">
          Scan the QR code with your camera or QR reader to upload wirelessly
        </p>
      </div>

      {/* QR Code Container */}
      <div 
        className="p-3 bg-white rounded-4 shadow-sm border position-relative"
        style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {sessionStatus === 'EXPIRED' ? (
          <div className="text-center p-2">
            <span className="text-danger small fw-bold d-block mb-2">QR Code Expired</span>
            <button className="btn btn-outline-primary btn-sm" onClick={initSession}>
              <RefreshIcon style={{ fontSize: 18 }} /> Refresh Code
            </button>
          </div>
        ) : sessionStatus === 'FILE_RECEIVED' ? (
          <div className="text-center p-2 animate__animated animate__zoomIn">
            <CloudDoneIcon style={{ fontSize: 64, color: 'var(--sp-success)' }} />
            <h6 className="fw-bold text-success mt-2 mb-0">File Received!</h6>
            <small className="text-muted">Loading preview...</small>
          </div>
        ) : sessionData ? (
          <QRCodeSVG 
            value={sessionData.qrPayload}
            size={188}
            level="H"
            includeMargin={true}
          />
        ) : (
          <CircularProgress size={36} />
        )}
      </div>

      {/* Session Status & Timer */}
      <div className="mt-3 w-100">
        {sessionStatus === 'WAITING_FOR_UPLOAD' && (
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <span 
              className="anim-pulse-glow" 
              style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#06B6D4' }} 
            />
            <span className="small fw-semibold text-secondary">
              Waiting for mobile upload... (Expires in {formatTimer(secondsRemaining)})
            </span>
          </div>
        )}

        {/* Demo Action Button for testing */}
        <div className="p-2 rounded-3 bg-light border">
          <span className="d-block small text-muted mb-1" style={{ fontSize: '0.78rem' }}>
            📱 Testing without a phone? Click below to simulate:
          </span>
          <button 
            type="button" 
            className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleSimulatePhoneUpload}
            disabled={isSimulatingPhone || sessionStatus === 'FILE_RECEIVED'}
            style={{ height: '42px', fontWeight: 600, borderRadius: '10px' }}
          >
            {isSimulatingPhone ? (
              <>
                <CircularProgress size={18} color="inherit" />
                <span>Simulating Phone Upload...</span>
              </>
            ) : sessionStatus === 'FILE_RECEIVED' ? (
              <>
                <CheckCircleIcon style={{ fontSize: 18 }} />
                <span>Document Transferred!</span>
              </>
            ) : (
              <>
                <QrCodeScannerIcon style={{ fontSize: 18 }} />
                <span>Simulate Phone Upload (Demo)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
