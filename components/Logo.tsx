import React from 'react';

export function Logo({ className = "w-8 h-8", style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="playGrad" x1="80" y1="65" x2="135" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
        <filter id="shadow" x="-10" y="-10" width="220" height="220" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="8" stdDeviation="15" floodOpacity="0.4" floodColor="#ea580c" />
        </filter>
      </defs>

      {/* Main Base */}
      <rect x="24" y="24" width="152" height="152" rx="42" fill="url(#logoGrad)" filter="url(#shadow)" />

      {/* Decorative Asian-inspired Ornaments */}
      <path
        d="M24 100 Q100 24 176 100 Q100 176 24 100Z"
        fill="white"
        fillOpacity="0.05"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      
      {/* Film Reel dots */}
      <circle cx="50" cy="50" r="4.5" fill="white" fillOpacity="0.6" />
      <circle cx="50" cy="150" r="4.5" fill="white" fillOpacity="0.6" />
      <circle cx="150" cy="50" r="4.5" fill="white" fillOpacity="0.6" />
      <circle cx="150" cy="150" r="4.5" fill="white" fillOpacity="0.6" />

      {/* Inner Ring */}
      <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="2" strokeOpacity="0.15" strokeDasharray="6 6" />

      {/* Main Play Icon with glowing effect */}
      <path
        d="M132.21 95.77C135.543 97.6945 135.543 102.306 132.21 104.23L83.71 132.542C80.3768 134.467 76.2101 132.061 76.2101 128.211L76.2101 71.7891C76.2101 67.9392 80.3768 65.5332 83.71 67.4577L132.21 95.77Z"
        fill="url(#playGrad)"
      />
    </svg>
  );
}
