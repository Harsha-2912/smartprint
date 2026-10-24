import React, { useState, useRef } from 'react';
import { usePrintSession } from '../../context/PrintSessionContext';
import { documentService } from '../../services/documentService';
import { LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export default function FileUploadZone({ onUploadSuccess }) {
  const { setDocument, loadSampleDocument } = usePrintSession();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndProcessFile = async (file) => {
    setErrorMessage(null);
    if (!file) return;

    // Validate extension
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(`Unsupported format (${ext}). Please upload a PDF, JPG, or PNG document.`);
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('File size exceeds the 25 MB kiosk limit. Please choose a smaller file.');
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const response = await documentService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response && response.success) {
        setDocument(response.document);
        if (onUploadSuccess) onUploadSuccess(response.document);
      }
    } catch (err) {
      setErrorMessage('Failed to process document. Please try again or choose a sample.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Drag & Drop Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`p-4 text-center rounded-4 position-relative d-flex flex-column align-items-center justify-content-center ${
          isDragging ? 'border-primary bg-primary-subtle' : ''
        }`}
        style={{
          border: `2.5px dashed ${isDragging ? 'var(--sp-primary)' : '#CBD5E1'}`,
          backgroundColor: isDragging ? '#EFF6FF' : '#FFFFFF',
          minHeight: '260px',
          cursor: isUploading ? 'wait' : 'pointer',
          transition: 'all 0.25s ease'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div className="w-75 py-4">
            <InsertDriveFileIcon style={{ fontSize: 52, color: 'var(--sp-primary)' }} className="anim-float mb-2" />
            <h6 className="fw-bold mb-1">Scanning & Parsing Document...</h6>
            <p className="text-muted small mb-3">{selectedFileName}</p>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ height: 10, borderRadius: 5, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: 'var(--sp-primary)' } }}
            />
            <span className="small fw-semibold text-primary mt-2 d-block">{uploadProgress}% Complete</span>
          </div>
        ) : (
          <>
            <div 
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EFF6FF, #E0E7FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sp-primary)',
                marginBottom: '1rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)'
              }}
            >
              <CloudUploadIcon style={{ fontSize: 38 }} />
            </div>

            <h5 className="fw-bold mb-1" style={{ color: '#172033' }}>
              Drag & Drop Your Document Here
            </h5>
            <p className="text-secondary small mb-3">
              or tap to browse files on this kiosk
            </p>

            <button 
              type="button" 
              className="btn btn-kiosk-primary btn-sm px-4"
              style={{ height: '46px', pointerEvents: 'none' }}
            >
              <PictureAsPdfIcon style={{ fontSize: 20 }} />
              Browse Files (PDF, JPG, PNG)
            </button>

            <span className="text-muted mt-3" style={{ fontSize: '0.75rem' }}>
              Maximum file size: 25 MB • High resolution vector & image parsing
            </span>
          </>
        )}
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0 py-2 rounded-3">
          <ErrorIcon style={{ color: '#F43F5E', fontSize: 20 }} />
          <span className="small fw-medium">{errorMessage}</span>
        </div>
      )}

      {/* Quick Test Demo Samples */}
      <div className="mt-3 p-3 rounded-3 bg-light border">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold small text-dark">
            🚀 Quick Kiosk Test: Load Sample Document
          </span>
          <span className="badge bg-secondary-subtle text-secondary small">Demo Files</span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button 
            type="button"
            className="btn btn-outline-primary btn-sm text-start"
            onClick={() => {
              loadSampleDocument(0);
              if (onUploadSuccess) onUploadSuccess();
            }}
          >
            📄 Project Proposal (6 Pgs, Skew & Rotation Flaws)
          </button>
          <button 
            type="button"
            className="btn btn-outline-primary btn-sm text-start"
            onClick={() => {
              loadSampleDocument(1);
              if (onUploadSuccess) onUploadSuccess();
            }}
          >
            🪪 ID Card & Transcript (2 Pgs)
          </button>
          <button 
            type="button"
            className="btn btn-outline-primary btn-sm text-start"
            onClick={() => {
              loadSampleDocument(2);
              if (onUploadSuccess) onUploadSuccess();
            }}
          >
            📐 Blueprint CAD (A3 Presentation)
          </button>
        </div>
      </div>
    </div>
  );
}
