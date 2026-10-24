import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import DocumentCanvasPreview from '../components/preview/DocumentCanvasPreview';
import PageThumbnailStrip from '../components/preview/PageThumbnailStrip';
import DocumentInfoCard from '../components/preview/DocumentInfoCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Preview() {
  const navigate = useNavigate();
  const { document } = usePrintSession();
  const [activePage, setActivePage] = useState(1);

  // If no document is loaded, redirect to upload
  if (!document) {
    return (
      <div className="p-5 text-center bg-white rounded-4 border shadow-sm my-4">
        <h5 className="fw-bold text-dark mb-2">No Document Uploaded</h5>
        <p className="text-secondary small mb-3">Please upload a document to view its preview.</p>
        <button className="btn btn-kiosk-primary" onClick={() => navigate('/upload')}>
          Go to Upload Screen
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Title & Breadcrumb Actions */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h3 className="fw-extrabold text-dark mb-1" style={{ fontWeight: 800 }}>
            Document Preview Workspace
          </h3>
          <p className="text-secondary small mb-0">
            Inspect pages, zoom, rotate, and select individual sheets before printing.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-kiosk-primary btn-sm px-3"
            onClick={() => navigate('/ai-analysis')}
            style={{ height: '44px' }}
          >
            <AutoFixHighIcon style={{ fontSize: 18 }} />
            <span>Analyse with AI</span>
          </button>
        </div>
      </div>

      {/* Main Preview Grid: Thumbnails (Left/Col-2), Canvas Viewport (Center/Col-7), Info/Actions (Right/Col-3) */}
      <div className="row g-3 align-items-stretch">
        {/* Left: Thumbnail Strip */}
        <div className="col-lg-2 col-md-3">
          <div className="kiosk-card p-3 h-100">
            <PageThumbnailStrip 
              currentPageNumber={activePage} 
              onSelectPage={(pageNum) => setActivePage(pageNum)} 
            />
          </div>
        </div>

        {/* Center: Main High-Res Canvas */}
        <div className="col-lg-7 col-md-9">
          <div className="kiosk-card p-3 h-100">
            <DocumentCanvasPreview 
              currentPageNumber={activePage} 
              onPageChange={(newPage) => setActivePage(newPage)} 
            />
          </div>
        </div>

        {/* Right: Metadata & Navigation Card */}
        <div className="col-lg-3 col-md-12">
          <DocumentInfoCard />
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
        <button 
          type="button" 
          className="btn btn-kiosk-secondary"
          onClick={() => navigate('/upload')}
        >
          <ArrowBackIcon />
          <span>Back to Upload</span>
        </button>

        <div className="d-flex gap-2">
          <button 
            type="button" 
            className="btn btn-kiosk-secondary"
            onClick={() => navigate('/settings')}
          >
            <SettingsIcon style={{ fontSize: 18 }} />
            <span>Skip to Settings</span>
          </button>

          <button 
            type="button" 
            className="btn btn-kiosk-primary"
            onClick={() => navigate('/ai-analysis')}
          >
            <span>Proceed to AI Analysis</span>
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
