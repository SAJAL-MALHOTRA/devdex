'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DevDexAIProps {
  developerName: string;
}

type AIAgentState = 'idle' | 'listening' | 'thinking' | 'speaking';

const WAVEFORM_BARS = 20;

export default function DevDexAI({ developerName }: DevDexAIProps) {
  const [agentState, setAgentState] = useState<AIAgentState>('idle');
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array.from({ length: WAVEFORM_BARS }, () => 0.5)
  );

  // Animate waveform when speaking — preserved
  useEffect(() => {
    if (agentState !== 'speaking') return;
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: WAVEFORM_BARS }, () => Math.random()));
    }, 120);
    return () => clearInterval(interval);
  }, [agentState]);

  const cycleState = useCallback(() => {
    const states: AIAgentState[] = ['idle', 'listening', 'thinking', 'speaking'];
    setAgentState((prev) => {
      const idx = states.indexOf(prev);
      return states[(idx + 1) % states.length];
    });
  }, []);

  const greetingLines = [
    'Hello.',
    `I'm the DevDex Assistant for ${developerName}.`,
    '',
    `Explore his projects, stack,`,
    'or get in touch.',
  ];

  const getBarConfig = (randomVal: number) => {
    switch (agentState) {
      case 'idle':
        return { height: 3 + randomVal * 3, opacity: 0.2 };
      case 'listening':
        return { height: 4 + randomVal * 6, opacity: 0.45 };
      case 'thinking':
        return { height: 5 + randomVal * 5, opacity: 0.55 };
      case 'speaking':
        return { height: 4 + randomVal * 14, opacity: 0.75 + randomVal * 0.25 };
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      className="p-4 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" />
          <h2 className="text-xs font-medium text-zinc-300 font-sans">
            AI Assistant
          </h2>
        </div>

        <div className="space-y-4">
          {/* Avatar + Text */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-opacity duration-300 ${
                  agentState === 'idle' ? 'opacity-50' : 'opacity-90'
                }`}
              >
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  stroke="#e5484d"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill={agentState === 'speaking' ? 'rgba(229,72,77,0.2)' : 'none'}
                />
              </svg>
            </div>

            {/* Greeting text — preserved animation */}
            <div className="flex-1 pt-0.5">
              {greetingLines.map((line, index) => (
                <motion.p
                  key={index}
                  className={`text-xs leading-relaxed font-sans ${
                    line === '' ? 'h-2' : 'text-zinc-300'
                  }`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: line === '' ? 0 : 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Waveform */}
          <div className="flex items-end h-5 gap-[2px] px-1 py-0.5 bg-zinc-950/40 rounded border border-white/[0.04]">
            {barHeights.map((val, i) => {
              const config = getBarConfig(val);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-all"
                  style={{
                    height: `${config.height}px`,
                    backgroundColor: '#e5484d',
                    opacity: config.opacity,
                    transitionDuration: agentState === 'speaking' ? '100ms' : '400ms',
                    transitionTimingFunction: 'ease-out',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Control */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-4">
        <button
          onClick={cycleState}
          className="text-xs font-medium px-2.5 py-1.5 bg-zinc-900 border border-white/[0.08] hover:border-white/[0.16] rounded-md text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          Tap to toggle state
        </button>
        <span className="text-[11px] text-zinc-500 font-sans capitalize">
          {agentState}
        </span>
      </div>
    </motion.section>
  );
}
