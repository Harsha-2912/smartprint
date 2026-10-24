import React, { useState, useEffect } from 'react';
import { usePrintSession } from '../../context/PrintSessionContext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { BACKEND_SERVER_URL } from '../../services/api';


export default function DocumentCanvasPreview({ currentPageNumber = 1, onPageChange }) {
  const { document, rotateDocumentPage } = usePrintSession();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [imgLoadError, setImgLoadError] = useState(false);

  useEffect(() => {
    setImgLoadError(false);
  }, [currentPageNumber, document?.id]);

  if (!document || !document.pages) {
    return (
      <div className="p-5 text-center bg-light rounded-4 border">
        <p className="text-muted">No document loaded for preview.</p>
      </div>
    );
  }

  const currentPage = document.pages.find(p => p.pageNumber === currentPageNumber) || document.pages[0];
  const totalPages = document.pageCount || document.pages.length;
  const rotation = currentPage.rotation || 0;
  const issues = currentPage.issues || [];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(180, prev + 20));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(60, prev - 20));
  const handleRotate = () => {
    rotateDocumentPage(currentPage.pageNumber);
  };

  const handlePrev = () => {
    if (currentPageNumber > 1 && onPageChange) {
      onPageChange(currentPageNumber - 1);
    }
  };

  const handleNext = () => {
    if (currentPageNumber < totalPages && onPageChange) {
      onPageChange(currentPageNumber + 1);
    }
  };

  const previewImgUrl = currentPage.previewUrl
    ? (currentPage.previewUrl.startsWith('http') ? currentPage.previewUrl : `${BACKEND_SERVER_URL}${currentPage.previewUrl}`)
    : null;


  return (
    <div className="d-flex flex-column h-100 position-relative">
      {/* Top Floating Control Bar */}
      <div 
        className="d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded-3 shadow-sm border flex-wrap gap-2"
        style={{ zIndex: 10 }}
      >
        {/* Page Switcher */}
        <div className="d-flex align-items-center gap-1">
          <button 
            type="button" 
            className="btn btn-light btn-sm p-1 border"
            onClick={handlePrev} 
            disabled={currentPageNumber <= 1}
            title="Previous Page"
          >
            <NavigateBeforeIcon />
          </button>
          <span className="fw-bold px-2 text-dark" style={{ fontSize: '0.9rem' }}>
            Page {currentPageNumber} of {totalPages}
          </span>
          <button 
            type="button" 
            className="btn btn-light btn-sm p-1 border"
            onClick={handleNext} 
            disabled={currentPageNumber >= totalPages}
            title="Next Page"
          >
            <NavigateNextIcon />
          </button>
        </div>

        {/* Zoom & Rotate Controls */}
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-light btn-sm d-flex align-items-center gap-1 border px-2"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOutIcon style={{ fontSize: 18 }} />
          </button>
          <span className="small text-muted fw-semibold" style={{ minWidth: 42, textAlign: 'center' }}>
            {zoomLevel}%
          </span>
          <button 
            type="button" 
            className="btn btn-light btn-sm d-flex align-items-center gap-1 border px-2"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomInIcon style={{ fontSize: 18 }} />
          </button>

          <div className="vr mx-1" />

          <button 
            type="button" 
            className="btn btn-light btn-sm d-flex align-items-center gap-1 border px-2 text-primary"
            onClick={handleRotate}
            title="Rotate Page 90° Clockwise"
          >
            <RotateRightIcon style={{ fontSize: 18 }} />
            <span className="d-none d-sm-inline small fw-semibold">Rotate</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace with Viewport */}
      <div 
        className="flex-grow-1 d-flex align-items-center justify-content-center p-3 rounded-4 overflow-auto position-relative"
        style={{
          background: '#E2E8F0',
          minHeight: '440px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        {/* Rendered Document Sheet */}
        <div 
          className="bg-white shadow-lg rounded-2 position-relative d-flex flex-column transition-all"
          style={{
            width: currentPage.orientation === 'landscape' ? '540px' : '400px',
            minHeight: currentPage.orientation === 'landscape' ? '380px' : '540px',
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: previewImgUrl && !imgLoadError ? '1rem' : '1.75rem',
            border: '1px solid #CBD5E1',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)'
          }}
        >
          {/* Header Line */}
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <span className="small fw-bold text-primary text-uppercase" style={{ letterSpacing: '0.05em' }}>
              SmartPrint AI Laser Raster
            </span>
            <span className="badge bg-light text-secondary border small">
              Page {currentPage.pageNumber}
            </span>
          </div>

          {/* Real Raster Image OR High-Fidelity Vector Representation */}
          {previewImgUrl && !imgLoadError ? (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden my-auto">
              <img 
                src={previewImgUrl}
                alt={`Page ${currentPage.pageNumber}`}
                onError={() => setImgLoadError(true)}
                className="img-fluid rounded"
                style={{
                  maxHeight: '460px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
            </div>
          ) : (
            <div className="flex-grow-1">
              <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                {currentPage.title}
              </h5>
              
              <p className="text-secondary small mb-3" style={{ lineHeight: 1.6 }}>
                {currentPage.contentSummary}
              </p>

              {currentPage.previewType === 'cover' && (
                <div className="p-3 my-2 bg-light border rounded-3 text-center">
                  <div className="fw-bold text-dark mb-1">SMARTPRINT AUTONOMOUS KIOSK</div>
                  <div className="small text-muted mb-2">Technical Specification Document & User Guide</div>
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <div style={{ width: 60, height: 4, background: '#2563EB', borderRadius: 2 }} />
                    <div style={{ width: 20, height: 4, background: '#7C3AED', borderRadius: 2 }} />
                  </div>
                </div>
              )}

              {currentPage.previewType === 'table' && (
                <div className="table-responsive my-2">
                  <table className="table table-sm table-bordered small text-muted mb-0">
                    <thead className="table-light">
                      <tr><th>Item</th><th>Qty</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>A4 Bond Paper</td><td>500</td><td>Optimal</td></tr>
                      <tr><td>Toner Black</td><td>1</td><td>94% Full</td></tr>
                      <tr><td>Fuser Roller</td><td>1</td><td>Operational</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {currentPage.previewType === 'blank' && (
                <div className="p-4 my-4 border border-dashed rounded-3 text-center text-muted">
                  <small>⚠️ Blank divider sheet detected</small>
                </div>
              )}

              <div className="d-flex flex-column gap-2 mt-3 opacity-75">
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, width: '100%' }} />
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, width: '92%' }} />
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, width: '96%' }} />
                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, width: '70%' }} />
              </div>
            </div>
          )}

          {/* Footer of Sheet */}
          <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto small text-muted">
            <span>Verified Vector Laser Raster</span>
            <span>Doc: {document.id ? document.id.slice(0, 10) : 'Sample'}</span>
          </div>
        </div>
      </div>

      {/* Floating Issue Badge on Page */}
      {issues.length > 0 && (
        <div 
          className="position-absolute bottom-0 start-0 m-3 p-2 px-3 bg-white border border-warning rounded-pill shadow-md d-flex align-items-center gap-2"
          style={{ zIndex: 10 }}
        >
          <WarningAmberIcon style={{ color: '#F59E0B', fontSize: 20 }} />
          <span className="small fw-bold text-dark">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'} flagged by AI on this page
          </span>
        </div>
      )}
    </div>
  );
}
