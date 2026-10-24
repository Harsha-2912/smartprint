import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AIAnalysisCard({
  category = 'rotation',
  title = 'Page Rotation Check',
  status = 'correction_available', // 'looks_good' | 'needs_attention' | 'correction_available' | 'action_required'
  description = 'Orientation analysis on all uploaded sheets.',
  details = 'Page 2: Inverted 180° detected',
  suggestedAction = 'Auto-rotate 180° to upright',
  isFixed = false,
  onApplySingleFix
}) {
  // Determine colors based on status
  let statusBadgeColor = '#2563EB';
  let statusBadgeBg = '#EFF6FF';
  let statusBorder = '#BFDBFE';
  let statusLabel = 'Correction Available';
  let icon = <AutoFixNormalIcon style={{ fontSize: 20 }} />;

  if (isFixed || status === 'looks_good') {
    statusBadgeColor = '#10B981';
    statusBadgeBg = '#ECFDF5';
    statusBorder = '#A7F3D0';
    statusLabel = isFixed ? 'Correction Applied' : 'Looks Good';
    icon = <CheckCircleIcon style={{ fontSize: 20 }} />;
  } else if (status === 'action_required') {
    statusBadgeColor = '#F43F5E';
    statusBadgeBg = '#FFF1F2';
    statusBorder = '#FECDD3';
    statusLabel = 'Action Required';
    icon = <ErrorIcon style={{ fontSize: 20 }} />;
  } else if (status === 'needs_attention') {
    statusBadgeColor = '#F59E0B';
    statusBadgeBg = '#FFFBEB';
    statusBorder = '#FDE68A';
    statusLabel = 'Needs Attention';
    icon = <WarningAmberIcon style={{ fontSize: 20 }} />;
  }

  return (
    <div 
      className="kiosk-card p-3 h-100 d-flex flex-column justify-content-between position-relative"
      style={{
        borderLeft: `5px solid ${statusBadgeColor}`,
        boxShadow: 'var(--sp-shadow-sm)'
      }}
    >
      <div>
        {/* Header with Title and Status Pill */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
            {title}
          </h6>
          <span 
            className="badge rounded-pill d-flex align-items-center gap-1"
            style={{
              backgroundColor: statusBadgeBg,
              color: statusBadgeColor,
              border: `1px solid ${statusBorder}`,
              fontWeight: 600,
              fontSize: '0.75rem',
              padding: '4px 10px'
            }}
          >
            {icon}
            <span>{statusLabel}</span>
          </span>
        </div>

        {/* Description & Detected Detail */}
        <p className="text-secondary small mb-2" style={{ lineHeight: 1.5 }}>
          {description}
        </p>

        <div className="p-2 rounded-2 bg-light border small text-dark mb-2">
          <strong>Detail:</strong> {details}
        </div>
      </div>

      {/* Suggested Action Bar */}
      <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
        <span className="small text-muted" style={{ fontSize: '0.78rem' }}>
          💡 {suggestedAction}
        </span>

        {!isFixed && status !== 'looks_good' && onApplySingleFix && (
          <button 
            type="button"
            className="btn btn-outline-primary btn-sm py-1 px-2"
            onClick={onApplySingleFix}
            style={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px' }}
          >
            Apply Fix
          </button>
        )}
      </div>
    </div>
  );
}
