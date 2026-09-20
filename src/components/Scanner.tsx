'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScannerProps {
  isActive: boolean;
  isResolving?: boolean;
  developerName?: string;
  role?: string;
  onScanComplete?: () => void;
}

export default function Scanner({
  isActive,
  isResolving = false,
  developerName = 'Sajal Malhotra',
  role = 'Undergraduate Developer',
  onScanComplete,
}: ScannerProps) {
  const [progress, setProgress] = useState(0);

  // Smooth progress count-up during scanning phase (approx 700ms)
  useEffect(() => {
    if (!isActive || isResolving) return;

    const startTime = performance.now();
    const duration = 700; // ms

    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        onScanComplete?.();
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive, isResolving, onScanComplete]);

  const initials = developerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none">
      {/* Horizontal hairline scan beam — passes across the card once */}
      {isActive && !isResolving && (
        <motion.div
          className="absolute left-4 right-4 h-px pointer-events-none z-30"
          initial={{ top: '15%', opacity: 0 }}
          animate={{
            top: ['15%', '85%'],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(229, 72, 77, 0.4) 20%, rgba(255, 255, 255, 0.85) 50%, rgba(229, 72, 77, 0.4) 80%, transparent 100%)',
            boxShadow: '0 0 12px rgba(229, 72, 77, 0.3)',
          }}
        />
      )}

      {/* Developer Card Interior Surface */}
      <div className="w-full max-w-[270px] flex flex-col items-center text-center">
        {/* Top brand & card header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" />
            <span className="text-[11px] font-semibold text-white tracking-tight">
              DevDex
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
            ID // 01
          </span>
        </div>

        {/* Minimal hardware monogram badge */}
        <div className="my-7 relative">
          <div className="w-14 h-14 rounded-xl bg-zinc-900/90 border border-white/[0.08] shadow-inner flex items-center justify-center relative overflow-hidden">
            {/* Subtle tactile micro-chip hairline contact lines */}
            <div className="absolute top-1 left-1 right-1 h-px bg-white/[0.04]" />
            <div className="absolute bottom-1 left-1 right-1 h-px bg-white/[0.04]" />
            <div className="absolute top-1 bottom-1 left-1 w-px bg-white/[0.04]" />
            <div className="absolute top-1 bottom-1 right-1 w-px bg-white/[0.04]" />

            <span className="text-xs font-semibold text-zinc-200 tracking-widest font-sans">
              {initials}
            </span>
          </div>
        </div>

        {/* Dynamic status display: Scanning vs Data Resolution */}
        <div className="w-full min-h-[72px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isResolving ? (
              /* STAGE 02 — IDENTIFYING & PROGRESS */
              <motion.div
                key="scanning"
                className="flex flex-col items-center gap-2.5 w-full"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.2 } }}
              >
                <div className="flex flex-col items-center">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                    Identifying
                  </p>
                  <p className="text-xs font-medium text-white tracking-tight mt-0.5 font-sans">
                    {developerName.toUpperCase()}
                  </p>
                </div>

                {/* Segmented / linear progress track */}
                <div className="w-40 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-zinc-200 rounded-full transition-all duration-75 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
                    {progress}%
                  </span>
                </div>
              </motion.div>
            ) : (
              /* STAGE 03 — DATA RESOLUTION */
              <motion.div
                key="resolved"
                className="flex flex-col items-center gap-1 w-full"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <p className="text-sm font-medium text-white tracking-tight font-sans">
                  {developerName}
                </p>
                <p className="text-xs text-zinc-400 font-sans">
                  {role}
                </p>

                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/90">
                    DevDex Profile Initialized
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
