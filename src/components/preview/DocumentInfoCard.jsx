import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../../context/PrintSessionContext';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SettingsIcon from '@mui/icons-material/Settings';

export default function DocumentInfoCard() {
  const navigate = useNavigate();
  const { document, aiAnalysis } = usePrintSession();

  if (!document) return null;

  return (
    <div className="kiosk-card p-3 d-flex flex-column justify-content-between h-100">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
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
            <PictureAsPdfIcon style={{ fontSize: 22 }} />
          </div>
          <div className="overflow-hidden">
            <h6 className="fw-bold text-dark mb-0 text-truncate" title={document.displayName || document.name}>
              {document.displayName || document.name}
            </h6>
            <span className="small text-muted">{document.fileSizeFormatted} • {document.pageCount} Pages</span>
          </div>
        </div>

        <hr className="my-2 text-secondary opacity-25" />

        <div className="d-flex flex-column gap-2 mb-3">
          <div className="d-flex justify-content-between align-items-center small">
            <span className="text-muted">Document Type:</span>
            <span className="fw-semibold text-dark">High-Res PDF</span>
          </div>
          <div className="d-flex justify-content-between align-items-center small">
            <span className="text-muted">Target Paper:</span>
            <span className="fw-semibold text-dark">A4 (Auto-detect)</span>
          </div>
          <div className="d-flex justify-content-between align-items-center small">
            <span className="text-muted">AI Quality Check:</span>
            {aiAnalysis.isAnalysed ? (
              <span className="badge bg-success-subtle text-success border border-success d-flex align-items-center gap-1">
                <CheckCircleIcon style={{ fontSize: 13 }} />
                <span>Score: {aiAnalysis.qualityScore}%</span>
              </span>
            ) : (
              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning">
                Pending Scan
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        <button 
          type="button"
          className="btn btn-kiosk-primary w-100"
          onClick={() => navigate('/ai-analysis')}
          style={{ height: '48px', fontSize: '0.98rem' }}
        >
          <AutoFixHighIcon style={{ fontSize: 20 }} />
          <span>Analyse with AI</span>
        </button>

        <button 
          type="button"
          className="btn btn-kiosk-secondary w-100"
          onClick={() => navigate('/settings')}
          style={{ height: '44px', fontSize: '0.9rem' }}
        >
          <SettingsIcon style={{ fontSize: 18 }} />
          <span>Skip to Print Settings</span>
        </button>
      </div>
    </div>
  );
}
