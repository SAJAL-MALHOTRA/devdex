'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DevDexAIProps {
  aiSummary: string;
  developerName: string;
}

type AIAgentState = 'idle' | 'listening' | 'thinking' | 'speaking';

const WAVEFORM_BARS = 20;

export default function DevDexAI({ aiSummary, developerName }: DevDexAIProps) {
  const [agentState, setAgentState] = useState<AIAgentState>('idle');
  const [barHeights, setBarHeights] = useState<number[]>([]);

  useEffect(() => {
    setBarHeights(Array.from({ length: WAVEFORM_BARS }, () => Math.random()));
  }, []);

  // Animate waveform when speaking
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
    'Hey.',
    `I'm DevDex AI.`,
    '',
    'Want me to tell you',
    `about ${developerName}?`,
  ];

  const getBarConfig = (randomVal: number) => {
    switch (agentState) {
      case 'idle':
        return { height: 3 + randomVal * 3, opacity: 0.15 };
      case 'listening':
        return { height: 5 + randomVal * 7, opacity: 0.4 };
      case 'thinking':
        return { height: 6 + randomVal * 6, opacity: 0.5 };
      case 'speaking':
        return { height: 4 + randomVal * 18, opacity: 0.7 + randomVal * 0.3 };
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      className="p-4"
    >
      <h2 className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-700 mb-4">
        DevDex AI
      </h2>

      <div className="space-y-4">
        {/* AI Avatar — geometric, not cute */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #161616 0%, #1e1e1e 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-all duration-500 ${
                agentState === 'idle' ? 'opacity-40' : 'opacity-80'
              }`}
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                stroke="#e85d4a"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill={agentState === 'speaking' ? 'rgba(232,93,74,0.15)' : 'none'}
              />
            </svg>
          </div>

          {/* Greeting text — staggered reveal */}
          <div className="flex-1 pt-0.5">
            {greetingLines.map((line, index) => (
              <motion.p
                key={index}
                className={`text-[13px] leading-[1.6] ${
                  line === '' ? 'h-3' : 'text-gray-400'
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
        <div className="flex items-end h-5 gap-[2px] px-1">
          {barHeights.map((val, i) => {
            const config = getBarConfig(val);
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all"
                style={{
                  height: `${config.height}px`,
                  backgroundColor: '#e85d4a',
                  opacity: config.opacity,
                  transitionDuration: agentState === 'speaking' ? '100ms' : '400ms',
                  transitionTimingFunction: 'ease-out',
                }}
              />
            );
          })}
        </div>

        {/* Control */}
        <div className="flex items-center gap-3">
          <button
            onClick={cycleState}
            className="font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/[0.06] rounded-md hover:border-white/[0.12] hover:bg-white/[0.02] text-gray-500 hover:text-gray-300 transition-all duration-200 cursor-pointer"
          >
            Tap to listen
          </button>
          <span className="font-mono text-[8px] text-gray-700 tracking-wider uppercase">
            {agentState}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
