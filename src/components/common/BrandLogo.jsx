import React from 'react';

export default function BrandLogo({ size = 'medium', showTagline = true, onClick }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconDimension = isLarge ? 56 : isSmall ? 36 : 46;
  const titleSize = isLarge ? '1.75rem' : isSmall ? '1.15rem' : '1.4rem';
  const tagSize = isLarge ? '0.88rem' : '0.75rem';

  return (
    <div 
      className="d-flex align-items-center gap-3" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
    >
      <div 
        style={{
          width: iconDimension,
          height: iconDimension,
          borderRadius: isLarge ? '16px' : '12px',
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35)',
          flexShrink: 0
        }}
      >
        <svg 
          viewBox="0 0 32 32" 
          width={iconDimension * 0.65} 
          height={iconDimension * 0.65} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Paper */}
          <path 
            d="M8 5C8 3.89543 8.89543 3 10 3H19L24 8V27C24 28.1046 23.1046 29 22 29H10C8.89543 29 8 28.1046 8 27V5Z" 
            fill="white" 
            fillOpacity="0.95" 
          />
          <path d="M19 3V8H24" fill="#E2E8F0" />
          {/* Print Scan Lines */}
          <line x1="12" y1="12" x2="18" y2="12" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="20" y2="16" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="20" x2="19" y2="20" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round"/>
          {/* AI Sparkle Star */}
          <path 
            d="M24 19L24.9 22.1L28 23L24.9 23.9L24 27L23.1 23.9L20 23L23.1 22.1L24 19Z" 
            fill="#06B6D4"
          />
          <circle cx="27" cy="15" r="1.2" fill="#F59E0B" />
        </svg>
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: titleSize, fontWeight: 800, letterSpacing: '-0.02em', color: '#172033', lineHeight: 1.1 }}>
            SmartPrint
          </span>
          <span 
            style={{ 
              fontSize: isSmall ? '0.75rem' : '0.85rem', 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
              color: '#FFFFFF',
              padding: '2px 7px',
              borderRadius: '6px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            AI
          </span>
        </div>
        {showTagline && (
          <span style={{ fontSize: tagSize, color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
            Smart Printing. Perfect Results.
          </span>
        )}
      </div>
    </div>
  );
}
