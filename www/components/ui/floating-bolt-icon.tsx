'use client';

import Image from 'next/image';
import boltLogo from '@/public/bolt-logo.png';
import { useState, useRef, useEffect } from 'react';

export function FloatingBoltIcon() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRight, setIsRight] = useState(true); // Start on right side
  const [dragDistance, setDragDistance] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  // Initialize position on mount
  useEffect(() => {
    const updatePosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const iconSize = 64; // 16 * 4 = 64px (w-16 h-16)
      
      setPosition({
        x: screenWidth - iconSize - 24, // 24px from right edge
        y: screenHeight / 2 - iconSize / 2, // Center vertically
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!iconRef.current) return;
    
    setIsDragging(true);
    setDragDistance(0);
    const rect = iconRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragRef.current.offsetX;
    const newY = e.clientY - dragRef.current.offsetY;
    
    // Calculate drag distance
    const distance = Math.sqrt(
      Math.pow(e.clientX - dragRef.current.startX, 2) + 
      Math.pow(e.clientY - dragRef.current.startY, 2)
    );
    setDragDistance(distance);
    
    // Constrain to screen bounds
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const iconSize = 64;
    
    const constrainedX = Math.max(0, Math.min(screenWidth - iconSize, newX));
    const constrainedY = Math.max(0, Math.min(screenHeight - iconSize, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap to nearest horizontal edge
    const screenWidth = window.innerWidth;
    const iconSize = 64;
    const centerX = position.x + iconSize / 2;
    const isCloserToRight = centerX > screenWidth / 2;
    
    setIsRight(isCloserToRight);
    
    // Animate to edge
    const targetX = isCloserToRight 
      ? screenWidth - iconSize - 24 // Right edge with padding
      : 24; // Left edge with padding
    
    setPosition(prev => ({ ...prev, x: targetX }));
    setDragDistance(0);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, position.x]);

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!iconRef.current) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragDistance(0);
    const rect = iconRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
    
    e.preventDefault();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragRef.current.offsetX;
    const newY = touch.clientY - dragRef.current.offsetY;
    
    // Calculate drag distance
    const distance = Math.sqrt(
      Math.pow(touch.clientX - dragRef.current.startX, 2) + 
      Math.pow(touch.clientY - dragRef.current.startY, 2)
    );
    setDragDistance(distance);
    
    // Constrain to screen bounds
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const iconSize = 64;
    
    const constrainedX = Math.max(0, Math.min(screenWidth - iconSize, newX));
    const constrainedY = Math.max(0, Math.min(screenHeight - iconSize, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap to nearest horizontal edge
    const screenWidth = window.innerWidth;
    const iconSize = 64;
    const centerX = position.x + iconSize / 2;
    const isCloserToRight = centerX > screenWidth / 2;
    
    setIsRight(isCloserToRight);
    
    // Animate to edge
    const targetX = isCloserToRight 
      ? screenWidth - iconSize - 24 // Right edge with padding
      : 24; // Left edge with padding
    
    setPosition(prev => ({ ...prev, x: targetX }));
    setDragDistance(0);
  };

  // Add global touch event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, position.x]);

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if we haven't dragged significantly (less than 5px)
    if (dragDistance > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={iconRef}
      className={`fixed z-50 cursor-pointer select-none transition-all duration-300 ease-out ${
        isDragging ? 'scale-110' : 'hover:scale-105'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #333333)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={handleClick}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div 
            className="absolute inset-0 rounded-full blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
              transform: 'scale(1.1)',
            }}
          />
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 rounded-full transform -skew-x-12 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
              width: '200%',
              left: '-100%',
              animation: isDragging ? 'none' : 'shine 3s infinite',
            }}
          />
        </div>
        
        {/* Bolt image */}
        {/* <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik01MiAyMEw0MCA0MEg1NUw0OCA4MEw2MCA2MEg0NUw1MiAyMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjUwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qk9MVDwvdGV4dD4KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPgo="
          alt="Bolt Logo"
          className="h-8 w-8 relative z-10 drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
          draggable={false}
        /> */}
        <Image
          src={boltLogo}
          alt="Bolt Logo"
          className="h-14 w-14 relative z-10 drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
          draggable={false} 
        />
        
        {/* Tooltip */}
        <div 
          className={`absolute ${isRight ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2 hidden whitespace-nowrap rounded-lg bg-black/90 backdrop-blur-sm px-3 py-2 text-sm text-white group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10`}
        >
          <div className="flex items-center gap-2">
            <span>Open Bolt.new</span>
            <span className="text-yellow-400">⚡</span>
          </div>
          {/* Tooltip arrow */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 ${
              isRight 
                ? 'left-full border-l-4 border-l-black/90 border-t-4 border-b-4 border-t-transparent border-b-transparent'
                : 'right-full border-r-4 border-r-black/90 border-t-4 border-b-4 border-t-transparent border-b-transparent'
            }`}
          />
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