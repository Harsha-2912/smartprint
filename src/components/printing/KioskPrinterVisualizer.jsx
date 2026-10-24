import React from 'react';

export default function KioskPrinterVisualizer({ isPrinting = true, hasError = false }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-3">
      <div 
        className={`position-relative ${isPrinting ? 'anim-vibrate' : ''}`}
        style={{ width: '280px', height: '240px' }}
      >
        {/* Animated Output Paper exiting the printer */}
        {isPrinting && !hasError && (
          <div 
            className="position-absolute start-50 translate-middle-x"
            style={{
              top: '80px',
              width: '110px',
              height: '140px',
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              animation: 'paperFeed 3s ease-in-out infinite',
              zIndex: 1
            }}
          >
            {/* Printed Lines Simulation */}
            <div className="p-2 d-flex flex-column gap-1">
              <div style={{ height: 4, background: '#2563EB', width: '70%', borderRadius: 2 }} />
              <div style={{ height: 3, background: '#94A3B8', width: '90%', borderRadius: 1.5 }} />
              <div style={{ height: 3, background: '#94A3B8', width: '85%', borderRadius: 1.5 }} />
              <div style={{ height: 3, background: '#94A3B8', width: '95%', borderRadius: 1.5 }} />
              <div style={{ height: 3, background: '#94A3B8', width: '60%', borderRadius: 1.5 }} />
            </div>
          </div>
        )}

        {/* Xerox Kiosk Hardware SVG Illustration */}
        <svg 
          viewBox="0 0 280 240" 
          width="280" 
          height="240" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {/* Main Printer Body */}
          <rect x="30" y="70" width="220" height="130" rx="14" fill="#1E293B" />
          <rect x="40" y="80" width="200" height="110" rx="10" fill="#334155" />
          
          {/* Top Scanner Lid */}
          <rect x="45" y="45" width="190" height="25" rx="6" fill="#475569" />
          <path d="M55 45L70 30H210L225 45H55Z" fill="#64748B" />

          {/* Touchscreen Console on Printer */}
          <rect x="180" y="90" width="50" height="40" rx="4" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
          <rect x="185" y="95" width="40" height="30" rx="2" fill="#2563EB" fillOpacity="0.8" />
          <line x1="189" y1="102" x2="205" y2="102" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="189" y1="108" x2="215" y2="108" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="218" cy="118" r="3" fill="#10B981" />

          {/* Paper Output Slot */}
          <rect x="65" y="100" width="100" height="16" rx="4" fill="#0F172A" />
          <path d="M70 108H160" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

          {/* Paper Tray 1 Handle */}
          <rect x="50" y="145" width="125" height="35" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <rect x="90" y="157" width="45" height="10" rx="3" fill="#64748B" />

          {/* Status LEDs */}
          <circle 
            cx="60" 
            cy="90" 
            r="4" 
            fill={hasError ? '#F43F5E' : isPrinting ? '#10B981' : '#06B6D4'} 
            className={isPrinting ? 'anim-pulse-success' : ''}
          />
          <circle cx="75" cy="90" r="4" fill="#3B82F6" />
          <circle cx="90" cy="90" r="4" fill="#F59E0B" fillOpacity={hasError ? '1' : '0.2'} />

          {/* Base Stand & Casters */}
          <rect x="50" y="200" width="180" height="12" rx="3" fill="#0F172A" />
          <circle cx="70" cy="216" r="6" fill="#334155" />
          <circle cx="210" cy="216" r="6" fill="#334155" />
        </svg>
      </div>

      <div className="text-center mt-2">
        <span className="badge bg-light text-secondary border px-3 py-1 small">
          Xerox AltaLink® Multifunction Hardware Engine
        </span>
      </div>
    </div>
  );
}
