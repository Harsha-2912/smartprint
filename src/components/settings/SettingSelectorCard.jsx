import React, { useState } from 'react';
import { usePrintSession } from '../../context/PrintSessionContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LayersIcon from '@mui/icons-material/Layers';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TouchKeypadModal from '../common/TouchKeypadModal';

export default function SettingSelectorCard() {
  const { printSettings, updateSetting, document } = usePrintSession();
  const [keypadOpen, setKeypadOpen] = useState(false);

  const totalPages = document?.pageCount || 1;

  const handleCopiesChange = (delta) => {
    const nextVal = Math.max(1, Math.min(20, (printSettings.copies || 1) + delta));
    updateSetting('copies', nextVal);
  };

  const handleCustomRangeConfirm = (rangeStr) => {
    if (!rangeStr) {
      updateSetting('pageRangeMode', 'all');
      return;
    }

    // Parse custom range e.g. "1-3, 5"
    const pages = new Set();
    const parts = rangeStr.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
            pages.add(p);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
          pages.add(p);
        }
      }
    }

    const finalPages = Array.from(pages).sort((a, b) => a - b);
    if (finalPages.length > 0) {
      updateSetting('pageRangeMode', 'custom');
      updateSetting('customPageRange', rangeStr);
      updateSetting('selectedPages', finalPages);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* 1. Paper Size & Color Mode */}
      <div className="kiosk-card p-3">
        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <LayersIcon style={{ color: 'var(--sp-primary)', fontSize: 20 }} />
          <span>Paper Size & Colour Mode</span>
        </h6>

        <div className="row g-2 mb-3">
          <div className="col-12 text-muted small fw-semibold">Paper Size:</div>
          <div className="col-4">
            <div 
              className={`setting-tile ${printSettings.paperSize === 'a4' ? 'active' : ''}`}
              onClick={() => updateSetting('paperSize', 'a4')}
            >
              <span className="fw-bold text-dark">A4</span>
              <small className="text-muted">Standard (210×297)</small>
            </div>
          </div>
          <div className="col-4">
            <div 
              className={`setting-tile ${printSettings.paperSize === 'a3' ? 'active' : ''}`}
              onClick={() => updateSetting('paperSize', 'a3')}
            >
              <span className="fw-bold text-dark">A3</span>
              <small className="text-muted">Large (+₹3.00)</small>
            </div>
          </div>
          <div className="col-4">
            <div 
              className={`setting-tile ${printSettings.paperSize === 'letter' ? 'active' : ''}`}
              onClick={() => updateSetting('paperSize', 'letter')}
            >
              <span className="fw-bold text-dark">Letter</span>
              <small className="text-muted">8.5 × 11 in</small>
            </div>
          </div>
        </div>

        <div className="row g-2">
          <div className="col-12 text-muted small fw-semibold">Colour Selection:</div>
          <div className="col-6">
            <div 
              className={`setting-tile ${printSettings.colorMode === 'bw' ? 'active' : ''}`}
              onClick={() => updateSetting('colorMode', 'bw')}
            >
              <div className="d-flex align-items-center gap-1 mb-1">
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#172033', display: 'inline-block' }} />
                <strong className="text-dark">Black & White</strong>
              </div>
              <small className="text-muted">₹2.00 / page</small>
            </div>
          </div>
          <div className="col-6">
            <div 
              className={`setting-tile ${printSettings.colorMode === 'color' ? 'active' : ''}`}
              onClick={() => updateSetting('colorMode', 'color')}
            >
              <div className="d-flex align-items-center gap-1 mb-1">
                <ColorLensIcon style={{ fontSize: 16, color: '#EC4899' }} />
                <strong className="text-dark">Full Colour</strong>
              </div>
              <small className="text-muted">₹10.00 / page</small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sides, Copies & Page Range */}
      <div className="kiosk-card p-3">
        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <FilterNoneIcon style={{ color: 'var(--sp-primary)', fontSize: 20 }} />
          <span>Sides, Copies & Page Range</span>
        </h6>

        <div className="row g-3 align-items-center mb-3">
          <div className="col-md-7">
            <div className="text-muted small fw-semibold mb-2">Print Sides:</div>
            <div className="row g-2">
              <div className="col-6">
                <div 
                  className={`setting-tile ${printSettings.printSides === 'single' ? 'active' : ''}`}
                  onClick={() => updateSetting('printSides', 'single')}
                >
                  <strong className="text-dark">Single-sided</strong>
                  <small className="text-muted">1 sheet per page</small>
                </div>
              </div>
              <div className="col-6">
                <div 
                  className={`setting-tile ${printSettings.printSides === 'double' ? 'active' : ''}`}
                  onClick={() => updateSetting('printSides', 'double')}
                >
                  <strong className="text-dark">Double-sided</strong>
                  <small className="text-success fw-semibold">Save Paper & 10%</small>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Control for Copies */}
          <div className="col-md-5">
            <div className="text-muted small fw-semibold mb-2 text-center text-md-start">
              Number of Copies:
            </div>
            <div className="d-flex align-items-center justify-content-center bg-light p-2 rounded-3 border">
              <button 
                type="button" 
                className="btn btn-white border shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 44, height: 44 }}
                onClick={() => handleCopiesChange(-1)}
                disabled={printSettings.copies <= 1}
              >
                <RemoveIcon />
              </button>

              <span className="mx-4 fw-bold text-dark" style={{ fontSize: '1.4rem', minWidth: 32, textAlign: 'center' }}>
                {printSettings.copies || 1}
              </span>

              <button 
                type="button" 
                className="btn btn-white border shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 44, height: 44 }}
                onClick={() => handleCopiesChange(1)}
                disabled={printSettings.copies >= 20}
              >
                <AddIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Page Range Selector with Touch Keypad */}
        <div className="pt-2 border-top">
          <div className="text-muted small fw-semibold mb-2">Page Selection:</div>
          <div className="row g-2">
            <div className="col-6">
              <div 
                className={`setting-tile ${printSettings.pageRangeMode === 'all' ? 'active' : ''}`}
                onClick={() => updateSetting('pageRangeMode', 'all')}
              >
                <strong className="text-dark">All Pages ({totalPages})</strong>
                <small className="text-muted">Print entire document</small>
              </div>
            </div>
            <div className="col-6">
              <div 
                className={`setting-tile ${printSettings.pageRangeMode === 'custom' ? 'active' : ''}`}
                onClick={() => setKeypadOpen(true)}
              >
                <div className="d-flex align-items-center gap-1 justify-content-center">
                  <EditNoteIcon style={{ fontSize: 18 }} />
                  <strong className="text-dark">Custom Range</strong>
                </div>
                <small className="text-primary fw-semibold">
                  {printSettings.customPageRange ? `Pages: ${printSettings.customPageRange}` : 'Tap to Enter'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Orientation & Advanced Toggles */}
      <div className="kiosk-card p-3">
        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <SwapVertIcon style={{ color: 'var(--sp-primary)', fontSize: 20 }} />
          <span>Orientation & Layout</span>
        </h6>

        <div className="row g-2 mb-3">
          <div className="col-4">
            <div 
              className={`setting-tile ${printSettings.orientation === 'auto' ? 'active' : ''}`}
              onClick={() => updateSetting('orientation', 'auto')}
            >
              <strong className="text-dark">Auto</strong>
              <small className="text-muted">Smart Detect</small>
            </div>
          </div>
          <div className="col-4">
            <div 
              className={`setting-tile ${printSettings.orientation === 'portrait' ? 'active' : ''}`}
              onClick={() => updateSetting('orientation', 'portrait')}
            >
              <strong className="text-dark">Portrait</strong>
              <small className="text-muted">Vertical</small>
            </div>
          </div>
          <div className="col-4">
            <div 
              className={`setting-tile ${printSettings.orientation === 'landscape' ? 'active' : ''}`}
              onClick={() => updateSetting('orientation', 'landscape')}
            >
              <strong className="text-dark">Landscape</strong>
              <small className="text-muted">Horizontal</small>
            </div>
          </div>
        </div>

        {/* Fit to Page & Collate Toggles */}
        <div className="d-flex flex-wrap gap-3 pt-2 border-top">
          <div className="form-check form-switch d-flex align-items-center gap-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              role="switch" 
              id="fitToPageSwitch"
              checked={printSettings.fitToPage}
              onChange={(e) => updateSetting('fitToPage', e.target.checked)}
              style={{ width: '2.5rem', height: '1.3rem' }}
            />
            <label className="form-check-label small fw-semibold text-dark" htmlFor="fitToPageSwitch">
              Fit to Printable Page (Prevents Edge Clipping)
            </label>
          </div>

          <div className="form-check form-switch d-flex align-items-center gap-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              role="switch" 
              id="collateSwitch"
              checked={printSettings.collate}
              onChange={(e) => updateSetting('collate', e.target.checked)}
              style={{ width: '2.5rem', height: '1.3rem' }}
            />
            <label className="form-check-label small fw-semibold text-dark" htmlFor="collateSwitch">
              Collate Copies (1,2,3... 1,2,3...)
            </label>
          </div>
        </div>
      </div>

      {/* Touch Keypad Modal */}
      <TouchKeypadModal
        open={keypadOpen}
        onClose={() => setKeypadOpen(false)}
        title="Select Custom Page Range"
        initialValue={printSettings.customPageRange || ""}
        placeholder="e.g. 1-3, 5"
        maxPages={totalPages}
        onConfirm={handleCustomRangeConfirm}
      />
    </div>
  );
}
