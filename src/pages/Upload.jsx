import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import FileUploadZone from '../components/upload/FileUploadZone';
import QRCodeUploadCard from '../components/upload/QRCodeUploadCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DevicesIcon from '@mui/icons-material/Devices';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Upload() {
  const navigate = useNavigate();
  const { document, uploadMethod, setUploadMethod } = usePrintSession();

  const handleDocumentReady = () => {
    navigate('/preview');
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Title & Subtitle */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h3 className="fw-extrabold text-dark mb-1" style={{ fontWeight: 800 }}>
            Upload Your Document
          </h3>
          <p className="text-secondary small mb-0">
            Choose how you would like to provide your document to the kiosk.
          </p>
        </div>

        {/* Method Toggle Buttons for Touchscreen */}
        <div className="btn-group p-1 bg-white border rounded-pill shadow-sm" role="group">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1 ${uploadMethod === 'device' ? 'btn-primary' : 'btn-light text-secondary'}`}
            onClick={() => setUploadMethod('device')}
            style={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            <DevicesIcon style={{ fontSize: 18, marginRight: 6 }} />
            <span>Upload from this Device</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1 ${uploadMethod === 'qr' ? 'btn-primary' : 'btn-light text-secondary'}`}
            onClick={() => setUploadMethod('qr')}
            style={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            <QrCode2Icon style={{ fontSize: 18, marginRight: 6 }} />
            <span>Upload via Phone QR</span>
          </button>
        </div>
      </div>

      {/* Upload Methods Grid */}
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-7">
          <div className="kiosk-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span 
                className="badge rounded-circle p-2 bg-primary-subtle text-primary fw-bold"
                style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                A
              </span>
              <h5 className="fw-bold mb-0 text-dark">Method A: Upload from this Device / USB</h5>
            </div>
            <FileUploadZone onUploadSuccess={handleDocumentReady} />
          </div>
        </div>

        <div className="col-lg-5">
          <div className="kiosk-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span 
                className="badge rounded-circle p-2 bg-secondary-subtle text-secondary fw-bold"
                style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                B
              </span>
              <h5 className="fw-bold mb-0 text-dark">Method B: Wireless Phone Sync</h5>
            </div>
            <QRCodeUploadCard onUploadSuccess={handleDocumentReady} />
          </div>
        </div>
      </div>

      {/* Active Document Status Indicator if already uploaded */}
      {document && (
        <div className="p-3 bg-white rounded-4 border shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <CheckCircleIcon style={{ color: '#10B981', fontSize: 24 }} />
            <div>
              <strong className="text-dark small d-block">Document Loaded: {document.displayName || document.name}</strong>
              <span className="text-muted small">{document.fileSizeFormatted} • {document.pageCount} Pages</span>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-kiosk-primary btn-sm px-4"
            onClick={() => navigate('/preview')}
          >
            <span>Continue to Preview</span>
            <ArrowForwardIcon />
          </button>
        </div>
      )}

      {/* Bottom Navigation Controls */}
      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
        <button 
          type="button" 
          className="btn btn-kiosk-secondary"
          onClick={() => navigate('/')}
        >
          <ArrowBackIcon />
          <span>Back to Home</span>
        </button>

        <button 
          type="button" 
          className="btn btn-kiosk-primary"
          onClick={() => navigate('/preview')}
          disabled={!document}
          style={{ opacity: document ? 1 : 0.6 }}
        >
          <span>Continue to Preview</span>
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
}
