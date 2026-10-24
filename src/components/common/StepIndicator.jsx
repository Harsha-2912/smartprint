import React from 'react';
import { useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const STEPS = [
  { id: 1, route: '/upload', label: '1. Upload' },
  { id: 2, route: '/preview', label: '2. Preview' },
  { id: 3, route: '/ai-analysis', label: '3. AI Enhance' },
  { id: 4, route: '/settings', label: '4. Print Settings' },
  { id: 5, route: '/payment', label: '5. Pay' },
  { id: 6, route: '/printing', label: '6. Print' },
  { id: 7, route: '/success', label: '7. Done' }
];

export default function StepIndicator() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't render stepper on welcome home screen
  if (currentPath === '/' || currentPath === '/help') {
    return null;
  }

  const currentStepIndex = STEPS.findIndex(s => s.route === currentPath);
  const activeStepNum = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  return (
    <div className="kiosk-stepper-wrap">
      <div className="container-fluid px-0">
        <div className="d-flex align-items-center justify-content-between position-relative">
          {/* Background Connecting Line */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              right: '5%',
              height: 3,
              backgroundColor: '#E2E8F0',
              zIndex: 1,
              transform: 'translateY(-50%)'
            }}
          />
          {/* Active Fill Line */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              width: `${Math.max(0, Math.min(100, ((activeStepNum - 1) / (STEPS.length - 1)) * 90))}%`,
              height: 3,
              background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
              zIndex: 2,
              transform: 'translateY(-50%)',
              transition: 'width 0.4s ease'
            }}
          />

          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < activeStepNum;
            const isCurrent = stepNum === activeStepNum;

            return (
              <div 
                key={step.id} 
                className="d-flex flex-column align-items-center position-relative"
                style={{ zIndex: 3 }}
              >
                <div 
                  style={{
                    width: isCurrent ? 36 : 28,
                    height: isCurrent ? 36 : 28,
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? '#2563EB' : isCompleted ? '#10B981' : '#FFFFFF',
                    border: isCurrent ? '3px solid #EFF6FF' : isCompleted ? 'none' : '2px solid #CBD5E1',
                    color: isCurrent || isCompleted ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: isCurrent ? '0.9rem' : '0.8rem',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isCompleted ? <CheckCircleIcon style={{ fontSize: 20 }} /> : stepNum}
                </div>
                <span 
                  className="mt-1 d-none d-sm-block"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
                    color: isCurrent ? '#2563EB' : isCompleted ? '#10B981' : '#64748B',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
