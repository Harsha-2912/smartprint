import React from 'react';
import { usePrintSession } from '../../context/PrintSessionContext';
import Checkbox from '@mui/material/Checkbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { BACKEND_SERVER_URL } from '../../services/api';


export default function PageThumbnailStrip({ currentPageNumber, onSelectPage }) {
  const { document, printSettings, togglePageSelection } = usePrintSession();

  if (!document || !document.pages) return null;

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-bold small text-dark">Page Thumbnails</span>
        <span className="small text-muted">
          {printSettings.selectedPages.length} of {document.pageCount} selected
        </span>
      </div>

      <div 
        className="d-flex flex-row flex-md-column gap-2 overflow-auto p-1"
        style={{ maxHeight: '480px' }}
      >
        {document.pages.map((page) => {
          const isCurrent = page.pageNumber === currentPageNumber;
          const isSelected = printSettings.selectedPages.includes(page.pageNumber);
          const hasIssues = page.issues && page.issues.length > 0;
          const previewImgUrl = page.previewUrl
            ? (page.previewUrl.startsWith('http') ? page.previewUrl : `${BACKEND_SERVER_URL}${page.previewUrl}`)
            : null;


          return (
            <div 
              key={page.pageNumber}
              onClick={() => onSelectPage(page.pageNumber)}
              className={`p-2 rounded-3 border position-relative transition-all ${
                isCurrent ? 'border-primary bg-primary-subtle shadow-sm' : 'bg-white'
              }`}
              style={{
                cursor: 'pointer',
                minWidth: '120px',
                borderWidth: isCurrent ? '2px' : '1px',
                borderColor: isCurrent ? 'var(--sp-primary)' : '#E2E8F0'
              }}
            >
              {/* Top Controls: Checkbox and Page Number */}
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold small" style={{ color: isCurrent ? 'var(--sp-primary)' : '#475569' }}>
                  P.{page.pageNumber}
                </span>

                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    size="small"
                    checked={isSelected}
                    onChange={() => togglePageSelection(page.pageNumber)}
                    sx={{ p: 0, '&.Mui-checked': { color: 'var(--sp-primary)' } }}
                    title={isSelected ? 'Included in print' : 'Excluded from print'}
                  />
                </div>
              </div>

              {/* Miniature Thumbnail Preview Canvas */}
              <div 
                className="rounded-1 d-flex flex-column justify-content-center align-items-center p-1 bg-light border overflow-hidden"
                style={{
                  height: '75px',
                  opacity: isSelected ? 1 : 0.45,
                  transform: page.rotation ? `rotate(${page.rotation}deg)` : 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                {previewImgUrl ? (
                  <img 
                    src={previewImgUrl} 
                    alt={`P.${page.pageNumber}`} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="w-100 d-flex flex-column justify-content-between h-100 p-1">
                    <div style={{ height: 4, background: '#CBD5E1', borderRadius: 2, width: '60%' }} />
                    <div style={{ height: 3, background: '#E2E8F0', borderRadius: 1.5, width: '90%' }} />
                    <div style={{ height: 3, background: '#E2E8F0', borderRadius: 1.5, width: '75%' }} />
                    <div style={{ height: 3, background: '#CBD5E1', borderRadius: 1.5, width: '40%' }} />
                  </div>
                )}
              </div>

              {/* Issue Warning Pill */}
              {hasIssues && (
                <div 
                  className="position-absolute bottom-0 end-0 m-1 badge bg-warning text-dark d-flex align-items-center gap-1"
                  style={{ fontSize: '0.65rem' }}
                >
                  <WarningAmberIcon style={{ fontSize: 12 }} />
                  <span>{page.issues.length}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
