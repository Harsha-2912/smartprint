import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrintSession } from '../context/PrintSessionContext';
import AIQualityGauge from '../components/ai/AIQualityGauge';
import AIAnalysisCard from '../components/ai/AIAnalysisCard';
import AIReviewModal from '../components/ai/AIReviewModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';


export default function AIAnalysis() {
  const navigate = useNavigate();
  const { 
    document, 
    aiAnalysis, 
    startAIAnalysis, 
    applyAllAICorrections 
  } = usePrintSession();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [fixedCards, setFixedCards] = useState({});

  useEffect(() => {
    // If not yet analysed, trigger initial simulated scan
    if (!aiAnalysis.isAnalysed && !aiAnalysis.isScanning && document) {
      startAIAnalysis();
    }
  }, [document]);

  if (!document) {
    return (
      <div className="p-5 text-center bg-white rounded-4 border shadow-sm my-4">
        <h5 className="fw-bold text-dark mb-2">No Document to Analyze</h5>
        <button className="btn btn-kiosk-primary" onClick={() => navigate('/upload')}>
          Go to Upload Screen
        </button>
      </div>
    );
  }

  const handleApplyAll = () => {
    applyAllAICorrections();
    setFixedCards({
      rotation: true,
      skew: true,
      contrast: true,
      blank: true,
      margin: true
    });
  };

  const handleApplySingle = (cardKey) => {
    setFixedCards(prev => ({ ...prev, [cardKey]: true }));
  };

  const isApplied = aiAnalysis.correctionsApplied;

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page Title & Scanning Banner */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h3 className="fw-extrabold text-dark mb-0" style={{ fontWeight: 800 }}>
              AI Document Analysis & Optimization
            </h3>
            <span className="badge bg-primary-subtle text-primary border border-primary small">
              Optical Neural Engine (Demo)
            </span>
          </div>
          <p className="text-secondary small mb-0 mt-1">
            Autonomous computer vision algorithms analyze page orientation, contrast, and edge margins.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-kiosk-secondary"
            onClick={() => setReviewModalOpen(true)}
          >
            <CompareArrowsIcon style={{ fontSize: 20 }} />
            <span>Review Changes</span>
          </button>

          <button 
            type="button" 
            className={`btn ${isApplied ? 'btn-kiosk-success' : 'btn-kiosk-primary'}`}
            onClick={handleApplyAll}
            disabled={aiAnalysis.isScanning}
          >
            {isApplied ? (
              <>
                <CheckCircleIcon style={{ fontSize: 20 }} />
                <span>All Corrections Applied!</span>
              </>
            ) : (
              <>
                <AutoFixHighIcon style={{ fontSize: 20 }} />
                <span>Apply Suggested Corrections</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Score Banner & Mode Notice */}
      <div className="row g-3 align-items-center">
        <div className="col-lg-5">
          <AIQualityGauge 
            score={aiAnalysis.qualityScore} 
            isImproved={isApplied} 
          />
        </div>

        <div className="col-lg-7">
          <div className="p-3 bg-white rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <strong className="text-dark small">AI Inspection Summary</strong>
              <span className="badge bg-light text-secondary border small">
                {isApplied ? '5 Optimizations Active' : '4 Flaws Flagged'}
              </span>
            </div>
            <p className="text-secondary small mb-2" style={{ lineHeight: 1.5 }}>
              {isApplied 
                ? '✅ Document has been deskewed, inverted pages rotated upright, and blank divider sheets excluded to minimize paper waste.'
                : '⚠️ We found 1 inverted page, 1 tilted scan, low contrast text on page 4, and an empty divider sheet.'}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark border small">Page 2: Inverted 180°</span>
              <span className="badge bg-light text-dark border small">Page 1: 3.4° Tilt</span>
              <span className="badge bg-light text-dark border small">Page 4: Low Contrast</span>
              <span className="badge bg-light text-dark border small">Page 5: Blank Divider</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Cards Grid (6 Diagnostic Checks) */}
      {aiAnalysis.isScanning ? (
        <div className="p-5 text-center bg-white rounded-4 border shadow-sm my-3 position-relative overflow-hidden">
          <div className="anim-laser-scan" />
          <CircularProgress size={48} sx={{ color: 'var(--sp-primary)' }} />
          <h5 className="fw-bold mt-3 mb-1 text-dark">Optical Neural Scanner Active...</h5>
          <p className="text-muted small mb-0">Analyzing vectors, contrast histograms, and bounding margins</p>
        </div>
      ) : (
        <div className="row g-3">
          {/* Card 1: Rotation */}
          <div className="col-md-4">
            <AIAnalysisCard 
              category="rotation"
              title="1. Page Rotation Check"
              status={fixedCards.rotation || isApplied ? 'looks_good' : 'action_required'}
              description="Deep neural network verifies text and heading reading orientation."
              details="Page 2: Inverted 180° detected"
              suggestedAction="Rotate 180° to upright"
              isFixed={fixedCards.rotation || isApplied}
              onApplySingleFix={() => handleApplySingle('rotation')}
            />
          </div>

          {/* Card 2: Skew / Tilt */}
          <div className="col-md-4">
            <AIAnalysisCard 
              category="skew"
              title="2. Skew / Tilt Angle"
              status={fixedCards.skew || isApplied ? 'looks_good' : 'needs_attention'}
              description="Radon transform detects scanner feeder angle offsets."
              details="Page 1: 3.4° clockwise tilt detected"
              suggestedAction="Deskew document to 0.0°"
              isFixed={fixedCards.skew || isApplied}
              onApplySingleFix={() => handleApplySingle('skew')}
            />
          </div>

          {/* Card 3: Image Quality & Contrast */}
          <div className="col-md-4">
            <AIAnalysisCard 
              category="contrast"
              title="3. Contrast & Legibility"
              status={fixedCards.contrast || isApplied ? 'looks_good' : 'correction_available'}
              description="Evaluates ink density against paper background reflectance."
              details="Page 4: Faint pencil strokes (contrast 3.1:1)"
              suggestedAction="Dynamic thresholding & darkening"
              isFixed={fixedCards.contrast || isApplied}
              onApplySingleFix={() => handleApplySingle('contrast')}
            />
          </div>

          {/* Card 4: Blank Page Detection */}
          <div className="col-md-4">
            <AIAnalysisCard 
              category="blank"
              title="4. Blank Page Detection"
              status={fixedCards.blank || isApplied ? 'looks_good' : 'needs_attention'}
              description="Pixel density analysis flags accidental divider sheets."
              details="Page 5: 99.4% white space detected"
              suggestedAction="Auto-exclude page 5 (saves ₹2.00)"
              isFixed={fixedCards.blank || isApplied}
              onApplySingleFix={() => handleApplySingle('blank')}
            />
          </div>

          {/* Card 5: Margin & Content Clipping */}
          <div className="col-md-4">
            <AIAnalysisCard 
              category="margin"
              title="5. Margin & Clipping Guard"
              status={fixedCards.margin || isApplied ? 'looks_good' : 'correction_available'}
              description="Checks content distance against Xerox non-printable 3mm margins."
              details="Page 3: Table border within 1.2mm of page edge"
              suggestedAction="Auto-scale 97% to fit printable area"
              isFixed={fixedCards.margin || isApplied}
              onApplySingleFix={() => handleApplySingle('margin')}
            />
          </div>

          {/* Card 6: Paper Size & Consistency */}
          <div className="col-md-4">
            <AIAnalysisCard 
              category="size"
              title="6. Sheet Format Consistency"
              status="looks_good"
              description="Verifies ISO 216 aspect ratios across all pages."
              details="All pages conform to standard A4 (210×297 mm)"
              suggestedAction="No action needed"
              isFixed={true}
            />
          </div>
        </div>
      )}

      {/* Review Modal */}
      <AIReviewModal 
        open={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)} 
        onApplyAll={handleApplyAll} 
      />

      {/* Bottom Navigation Controls */}
      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
        <button 
          type="button" 
          className="btn btn-kiosk-secondary"
          onClick={() => navigate('/preview')}
        >
          <ArrowBackIcon />
          <span>Back to Preview</span>
        </button>

        <div className="d-flex gap-2">
          <button 
            type="button" 
            className="btn btn-kiosk-secondary"
            onClick={() => navigate('/settings')}
          >
            <span>Continue Without Changes</span>
          </button>

          <button 
            type="button" 
            className="btn btn-kiosk-primary"
            onClick={() => navigate('/settings')}
          >
            <span>Proceed to Print Settings</span>
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
