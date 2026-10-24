import React from 'react';
import { KIOSK_CONFIG } from '../../config/printerConfig';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function AppFooter() {
  return (
    <footer 
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '0.75rem 2rem',
        fontSize: '0.82rem',
        color: '#64748B'
      }}
    >
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border">
            {KIOSK_CONFIG.kioskId}
          </span>
          <span className="d-none d-md-inline text-muted">•</span>
          <span className="d-none d-md-inline">{KIOSK_CONFIG.location}</span>
        </div>

        <div className="d-flex align-items-center gap-2 text-success">
          <LockOutlinedIcon style={{ fontSize: 16 }} />
          <span>Privacy Assured: Files automatically purged upon session completion</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <SupportAgentIcon style={{ fontSize: 16, color: 'var(--sp-primary)' }} />
          <span>Kiosk Hotline: <strong>{KIOSK_CONFIG.supportPhone}</strong></span>
        </div>
      </div>
    </footer>
  );
}
