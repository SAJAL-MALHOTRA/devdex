'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { scannerRingVariants, scanLineVariants, statusTextVariants } from '@/animations/scannerAnimations';

interface ScannerProps {
  isActive: boolean;
  onScanComplete?: () => void;
}

const STATUS_MESSAGES = [
  'SCANNING DEVELOPER',
  'READING IDENTITY',
  'FETCHING PROFILE',
  'ANALYZING STACK',
];

export default function Scanner({ isActive, onScanComplete }: ScannerProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= STATUS_MESSAGES.length - 1) {
          clearInterval(interval);
          onScanComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, onScanComplete]);

  useEffect(() => {
    if (!isActive) {
      setCurrentMessage(0);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Scanner ring */}
      <motion.div
        className="relative w-32 h-32 md:w-40 md:h-40"
        variants={scannerRingVariants}
        animate={isActive ? 'scanning' : 'idle'}
      >
        {/* Outer ring */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="rgba(232, 93, 74, 0.15)"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="#e85d4a"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            strokeLinecap="round"
            opacity={isActive ? 0.6 : 0}
            className="transition-opacity duration-300"
          />
        </svg>

        {/* Inner ring */}
        <svg
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Center QR-like pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 md:w-16 md:h-16 relative">
            {/* QR placeholder — geometric grid */}
            <svg viewBox="0 0 64 64" className="w-full h-full opacity-60">
              {/* Corner markers */}
              <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="#e85d4a" strokeWidth="1.5" />
              <rect x="8" y="8" width="8" height="8" rx="1" fill="#e85d4a" opacity="0.4" />
              <rect x="44" y="4" width="16" height="16" rx="2" fill="none" stroke="#e85d4a" strokeWidth="1.5" />
              <rect x="48" y="8" width="8" height="8" rx="1" fill="#e85d4a" opacity="0.4" />
              <rect x="4" y="44" width="16" height="16" rx="2" fill="none" stroke="#e85d4a" strokeWidth="1.5" />
              <rect x="8" y="48" width="8" height="8" rx="1" fill="#e85d4a" opacity="0.4" />
              {/* Center pattern */}
              <rect x="26" y="26" width="12" height="12" rx="1" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <rect x="29" y="29" width="6" height="6" rx="0.5" fill="#e85d4a" opacity="0.3" />
              {/* Data dots */}
              <rect x="24" y="8" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.12)" />
              <rect x="30" y="8" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.08)" />
              <rect x="36" y="8" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.12)" />
              <rect x="8" y="24" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.08)" />
              <rect x="8" y="30" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.12)" />
              <rect x="8" y="36" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.08)" />
              <rect x="52" y="24" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.1)" />
              <rect x="52" y="30" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.06)" />
              <rect x="52" y="36" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.1)" />
              <rect x="24" y="52" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.08)" />
              <rect x="30" y="52" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.12)" />
              <rect x="36" y="52" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.08)" />
              <rect x="44" y="44" width="8" height="8" rx="1" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              <rect x="46" y="46" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.06)" />
            </svg>
          </div>
        </div>

        {/* Crosshair lines */}
        {isActive && (
          <>
            <motion.div
              className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#e85d4a]/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.div
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#e85d4a]/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </>
        )}
      </motion.div>

      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e85d4a]/40 to-transparent"
        variants={scanLineVariants}
        animate={isActive ? 'scanning' : 'idle'}
      />

      {/* Status text */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.p
                key={currentMessage}
                variants={statusTextVariants}
                initial="enter"
                animate="visible"
                exit="exit"
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500"
              >
                {STATUS_MESSAGES[currentMessage]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
