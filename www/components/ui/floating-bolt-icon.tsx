'use client';

import { useState } from 'react';

export function FloatingBoltIcon() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
        }}
      >
        {/* Shine effect */}
        {/* <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 overflow-hidden"> */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 rounded-full transform -skew-x-12"
            style={{
            //   background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              width: '200%',
              left: '-100%',
              animation: 'shine 2s infinite',
            }}
          />
        </div>
        
        {/* Icon */}
        <svg
          className="h-6 w-6 text-white drop-shadow-sm relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 0L8.5 8H0l6.5 7L11 24l4.5-8H24l-6.5-7L13 0z" />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:block opacity-90 pointer-events-none">
          Open Bolt.new ⚡
        </div>
      </a>
      
      <style jsx>{`
        @keyframes shine {
          0% { 
            left: -100%; 
          }
          100% { 
            left: 100%; 
          }
        }
      `}</style>
    </div>
  );
}

// Hook to control the floating icon
export function useFloatingBolt() {
  const [isEnabled, setIsEnabled] = useState(true);
  
  return {
    isEnabled,
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
    toggle: () => setIsEnabled(prev => !prev),
  };
} 