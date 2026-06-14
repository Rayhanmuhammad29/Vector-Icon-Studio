import React from 'react';

interface GridOverlayProps {
  color: string;
}

export default function GridOverlay({ color }: GridOverlayProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="absolute inset-0 pointer-events-none w-full h-full select-none"
      aria-hidden="true"
    >
      <g opacity="0.35" stroke={color} strokeWidth="0.4" strokeDasharray="1 1">
        {/* Safe Area Outer Border */}
        <rect x="14" y="14" width="72" height="72" rx="4" fill="none" strokeWidth="0.5" />
        
        {/* Core Safe area Circle boundary */}
        <circle cx="50" cy="50" r="36" fill="none" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="16" fill="none" strokeWidth="0.25" />
      </g>

      <g opacity="0.45" stroke={color} strokeWidth="0.3">
        {/* Horizontal Center Line */}
        <line x1="6" y1="50" x2="94" y2="50" />
        {/* Vertical Center Line */}
        <line x1="50" y1="6" x2="50" y2="94" />
        
        {/* Diagonals */}
        <line x1="14" y1="14" x2="86" y2="86" strokeDasharray="2 2" />
        <line x1="86" y1="14" x2="14" y2="86" strokeDasharray="2 2" />
      </g>

      {/* Grid Coordinates markings on margins (subtle ticks) */}
      <g opacity="0.6" fill={color} className="text-[3px]" style={{ fontFamily: 'monospace' }}>
        <text x="52" y="8" textAnchor="middle">N0</text>
        <text x="52" y="96" textAnchor="middle">S0</text>
        <text x="6" y="52">W0</text>
        <text x="90" y="52">E0</text>
        
        <circle cx="50" cy="50" r="1.5" fill={color} />
      </g>
    </svg>
  );
}
