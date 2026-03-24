"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds for loading
    const interval = 30; // update every 30ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          // Wait a bit before signaling completion to show 100%
          setTimeout(() => setIsFinished(true), 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isFinished) {
      if (onComplete) onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#000510] flex items-center justify-center"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0065FF]/10 blur-[150px] rounded-full pointer-events-none z-10"></div>
      
      {/* Center Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-30 flex flex-col items-center gap-8"
      >
        {/* Logo Wrapper */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#0065FF]/20 blur-2xl rounded-full group-hover:bg-[#0065FF]/30 transition-all duration-500"></div>
          <img 
            src="/reallogo.png" 
            alt="Techly Logo" 
            className="h-16 md:h-20 w-auto relative drop-shadow-[0_0_30px_rgba(0,101,255,0.4)]"
          />
        </div>

        {/* Loading Info */}
        <div className="flex flex-col items-center gap-4 w-64 md:w-80">
          <div className="flex justify-between w-full px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0065FF]">
              System Initializing
            </span>
            <span className="text-[10px] font-mono text-white/50">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Loading Bar Container */}
          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#0065FF] shadow-[0_0_15px_#0065FF]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Dynamic Text */}
          <div className="text-[9px] font-medium text-white/30 uppercase tracking-[0.3em] h-4">
            {progress < 30 ? 'Loading Assets...' : progress < 60 ? 'Analyzing Workflows...' : progress < 90 ? 'Powering Experience...' : 'Ready to Launch'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
