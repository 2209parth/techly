'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LiquidDockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export interface LiquidDockProps {
  items: LiquidDockItem[];
  activeIndex?: number;
}

export default function LiquidDock({ items, activeIndex: externalActiveIndex }: LiquidDockProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define item height/width and gaps
  const itemSize = 56; // 14 * 4
  const gap = 8; // 2 * 4
  const padding = 8; // 2 * 4

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4">
      <div 
        ref={containerRef}
        className="relative flex items-center gap-2 p-2 bg-[#000510]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,101,255,0.4)]"
      >
        {/* Background Gooey Layer */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden" 
          style={{ filter: "url(#gooey-nav)" }}
        >
          <motion.div
            className="absolute top-2 left-2 w-14 h-14 bg-[#0065FF] rounded-full"
            animate={{
              x: activeIndex * (itemSize + gap),
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
          {/* Extra blobs for more "liquid" feel if needed */}
        </div>

        {/* Foreground Content */}
        {items.map((item, index) => (
          <div key={index} className="relative">
             <button
              onClick={() => {
                setInternalActiveIndex(index);
                item.onClick();
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative w-14 h-14 flex items-center justify-center rounded-full transition-all duration-500 z-10 ${
                activeIndex === index ? 'text-white' : 'text-white/40'
              }`}
            >
              <motion.span 
                animate={{ 
                  scale: activeIndex === index ? 1.2 : 1,
                  y: activeIndex === index ? -2 : 0 
                }}
                className="relative z-20"
              >
                {item.icon}
              </motion.span>
            </button>

            {/* Hover Tooltip */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#000510]/80 backdrop-blur-xl border border-[#0065FF]/40 rounded-xl text-[10px] font-black tracking-widest uppercase text-white shadow-2xl z-50 pointer-events-none"
                >
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#000510]/80 border-r border-b border-[#0065FF]/40 rotate-45" />
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* SVG Gooey Filter */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="gooey-nav">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
              result="gooey" 
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
