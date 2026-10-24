import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export default function AIQualityGauge({ score = 74, isImproved = false }) {
  const isExcellent = score >= 90;
  const isGood = score >= 75 && score < 90;

  const color = isExcellent ? '#10B981' : isGood ? '#2563EB' : '#F59E0B';
  const label = isExcellent ? 'Print-Ready (Optimal)' : isGood ? 'Good Quality' : 'Needs Optimization';

  return (
    <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-4 border shadow-sm">
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Background track circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={78}
          thickness={5.5}
          sx={{ color: '#E2E8F0' }}
        />
        {/* Progress fill circle */}
        <CircularProgress
          variant="determinate"
          value={score}
          size={78}
          thickness={5.5}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
            transition: 'all 0.8s ease'
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant="caption" component="div" sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#172033', lineHeight: 1 }}>
            {score}%
          </Typography>
        </Box>
      </Box>

      <div>
        <div className="d-flex align-items-center gap-1 mb-1">
          <AutoFixHighIcon style={{ fontSize: 18, color: 'var(--sp-primary)' }} />
          <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
            Document Quality Score
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span 
            className="badge rounded-pill" 
            style={{ 
              backgroundColor: isExcellent ? '#ECFDF5' : '#EFF6FF',
              color: isExcellent ? '#059669' : '#2563EB',
              border: `1px solid ${isExcellent ? '#A7F3D0' : '#BFDBFE'}`,
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            {label}
          </span>
          {isImproved && (
            <span className="small text-success fw-bold animate__animated animate__fadeIn">
              ✨ +{score - 74}% Enhanced
            </span>
          )}
        </div>
        <span className="small text-muted d-block mt-1">
          Based on 6 optical checks (deskew, rotation, contrast, margins)
        </span>
      </div>
    </div>
  );
}
