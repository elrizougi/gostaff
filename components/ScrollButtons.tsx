'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ScrollButtons() {
  const [upPos, setUpPos] = useState({ x: -1, y: -1 });
  const [downPos, setDownPos] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Ref to track dragging state
  const dragRef = useRef<{ 
    startX: number; 
    startY: number; 
    initialX: number; 
    initialY: number; 
    id: 'up' | 'down'; 
  } | null>(null);

  useEffect(() => {
    // Initialize positions based on window size
    if (typeof window !== 'undefined') {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const btnSize = 50; // approximate button size
      const rightMargin = 32;
      
      setUpPos({ 
        x: winW - rightMargin - btnSize, 
        y: 96 
      });
      
      setDownPos({ 
        x: winW - rightMargin - btnSize, 
        y: winH - 32 - btnSize 
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, id: 'up' | 'down') => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentPos = id === 'up' ? upPos : downPos;
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
      id
    };
    
    setIsDragging(false);
    
    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!dragRef.current) return;
    
    // Prevent scrolling when dragging on touch
    if (e.cancelable && e.type === 'touchmove') {
        e.preventDefault(); 
    }

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    
    // Threshold to consider it a drag
    if (!isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      setIsDragging(true);
    }
    
    const newPos = {
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy
    };
    
    if (dragRef.current.id === 'up') {
      setUpPos(newPos);
    } else {
      setDownPos(newPos);
    }
  };

  const handleMouseUp = () => {
    if (dragRef.current) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      
      dragRef.current = null;
      
      // Reset isDragging after a short delay
      setTimeout(() => {
        setIsDragging(false);
      }, 50);
    }
  };
  
  const handleClick = (action: () => void) => {
    if (!isDragging) {
      action();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
  };

  if (upPos.x === -1) return null;

  const btnClass = "p-3 bg-white text-orange-600 rounded-full shadow-lg hover:shadow-xl hover:bg-orange-50 transition-colors border border-orange-200 cursor-move active:cursor-grabbing select-none";

  return (
    <>
      <div 
        style={{ left: `${upPos.x}px`, top: `${upPos.y}px`, position: 'fixed', zIndex: 50, touchAction: 'none' }}
        onMouseDown={(e) => handleMouseDown(e, 'up')}
        onTouchStart={(e) => handleMouseDown(e, 'up')}
        onClick={() => handleClick(scrollToTop)}
        className={btnClass}
        title="الصعود للأعلى"
      >
        <ArrowUp className="w-6 h-6" />
      </div>
      
      <div 
        style={{ left: `${downPos.x}px`, top: `${downPos.y}px`, position: 'fixed', zIndex: 50, touchAction: 'none' }}
        onMouseDown={(e) => handleMouseDown(e, 'down')}
        onTouchStart={(e) => handleMouseDown(e, 'down')}
        onClick={() => handleClick(scrollToBottom)}
        className={btnClass}
        title="النزول للأسفل"
      >
        <ArrowDown className="w-6 h-6" />
      </div>
    </>
  );
}
