'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DevDexVoiceProps {
  developerName: string;
}

type VoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'ended';

export default function DevDexAI({ developerName }: DevDexVoiceProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const [timer, setTimer] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [needleHeights, setNeedleHeights] = useState<number[]>([14, 28, 42, 20, 36, 18, 40, 24, 16]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Animate amplitude needles during listening and speaking
  useEffect(() => {
    if (state !== 'listening' && state !== 'speaking') return;

    const interval = setInterval(() => {
      setNeedleHeights(
        Array.from({ length: 9 }, () => Math.floor(Math.random() * (state === 'speaking' ? 36 : 24)) + 10)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [state]);

  // Handle call lifecycle simulation
  const startCall = () => {
    clearTimers();
    setState('connecting');

    // Connecting (800ms) -> Listening
    stateTimerRef.current = setTimeout(() => {
      setState('listening');
      setTimer(0);

      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);

      // Listening for 4.5s -> Thinking
      stateTimerRef.current = setTimeout(() => {
        setState('thinking');

        // Thinking for 1.2s -> Speaking
        stateTimerRef.current = setTimeout(() => {
          setState('speaking');

          // Speaking for 5s -> Idle
          stateTimerRef.current = setTimeout(() => {
            clearTimers();
            setState('idle');
          }, 5000);
        }, 1200);
      }, 4500);
    }, 800);
  };

  const endCall = () => {
    clearTimers();
    setState('idle');
    setTimer(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  return (
    <section className="p-6 flex flex-col justify-between h-full select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#F2F2F2]">
              DevDex Voice
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#55585F] tracking-wider uppercase">
            v1.0
          </span>
        </div>

        <p className="text-xs text-[#8B8D93] mt-2 font-sans">
          {state === 'listening'
            ? 'Listening to you...'
            : state === 'speaking'
            ? `${developerName}'s AI is speaking`
            : state === 'thinking'
            ? 'Processing voice input...'
            : state === 'connecting'
            ? 'Connecting audio stream...'
            : `Ask me about ${developerName}`}
        </p>
      </div>

      {/* Center Transforming Voice Visualizer */}
      <div className="my-auto py-6 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {/* STATE: IDLE */}
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              {/* Idle Orb */}
              <div className="w-28 h-28 rounded-full border border-white/[0.08] bg-[#111214]/60 flex items-center justify-center relative shadow-inner">
                {/* Secondary inner ring */}
                <div className="w-16 h-16 rounded-full border border-white/[0.05] flex items-center justify-center">
                  {/* Subtle red core with resting glow */}
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full bg-[#E5484D]"
                    animate={{
                      scale: [1, 1.15, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(229, 72, 77, 0.3)',
                        '0 0 14px 4px rgba(229, 72, 77, 0.2)',
                        '0 0 0 0 rgba(229, 72, 77, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>

              {/* Sub-label */}
              <p className="text-xs font-medium text-[#F2F2F2] mt-4 font-sans">
                DevDex AI
              </p>
              <p className="text-[11px] text-[#55585F] font-mono mt-0.5">
                Voice Assistant
              </p>
            </motion.div>
          )}

          {/* STATE: CONNECTING */}
          {state === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full border border-dashed border-white/[0.2] flex items-center justify-center relative animate-[spin_8s_linear_infinite]">
                <div className="w-16 h-16 rounded-full border border-white/[0.08] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#E5484D] animate-ping" />
                </div>
              </div>
              <p className="text-xs font-mono text-[#8B8D93] mt-4 animate-pulse">
                Connecting...
              </p>
            </motion.div>
          )}

          {/* STATE: LISTENING (Acoustic Diaphragm) */}
          {state === 'listening' && (
            <motion.div
              key="listening"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Diaphragm container with concentric wave aura */}
              <div className="w-28 h-28 rounded-full border border-[#E5484D]/30 bg-[#111214]/80 flex items-center justify-center relative shadow-[0_0_24px_rgba(229,72,77,0.15)]">
                {/* Expanding sonar ripple */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#E5484D]/25 pointer-events-none"
                  animate={{
                    scale: [1, 1.4],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />

                {/* Vertical acoustic amplitude needles */}
                <div className="flex items-center gap-1 h-12">
                  {needleHeights.map((h, idx) => (
                    <motion.div
                      key={idx}
                      className="w-0.5 rounded-full bg-[#E5484D]"
                      animate={{ height: `${h}px` }}
                      transition={{ duration: 0.12 }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-mono text-[#E5484D] mt-4 tracking-wider uppercase">
                Listening...
              </p>
            </motion.div>
          )}

          {/* STATE: THINKING */}
          {state === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full border border-white/[0.08] bg-[#111214]/60 flex items-center justify-center relative">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>

              <p className="text-xs font-mono text-[#8B8D93] mt-4 tracking-wider uppercase">
                Thinking...
              </p>
            </motion.div>
          )}

          {/* STATE: SPEAKING (Dynamic audio waveform) */}
          {state === 'speaking' && (
            <motion.div
              key="speaking"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full border border-white/[0.12] bg-[#111214] flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.04)]">
                {/* Reactive speech waveform bars */}
                <div className="flex items-center gap-1 h-14">
                  {needleHeights.map((h, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1 rounded-full bg-gradient-to-t from-[#E5484D] to-white/90"
                      animate={{ height: `${h}px` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-mono text-[#F2F2F2] mt-4 tracking-wider uppercase">
                Speaking
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Action Controls */}
      <div className="space-y-3">
        {state === 'idle' ? (
          <>
            <button
              onClick={startCall}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] text-[#F2F2F2] text-xs font-medium font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#E5484D]"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              <span>Talk to DevDex</span>
            </button>

            <p className="text-[11px] font-mono text-[#55585F] text-center">
              Projects · Skills · Experience
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111214] border border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D] animate-ping" />
              <span className="text-xs font-mono text-[#F2F2F2]">
                {formatTime(timer)}
              </span>
            </div>

            <button
              onClick={endCall}
              className="text-xs font-mono text-[#E5484D] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 bg-[#E5484D] rounded-sm" />
              <span>End</span>
            </button>
          </div>
        )}

        {/* Transcript Drawer Toggle (Hidden by default) */}
        <div className="pt-2 border-t border-white/[0.04] flex flex-col items-center">
          <button
            onClick={() => setShowTranscript((s) => !s)}
            className="text-[10px] font-mono text-[#55585F] hover:text-[#8B8D93] transition-colors cursor-pointer"
          >
            {showTranscript ? 'Hide transcript' : 'Show transcript'}
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden w-full pt-2"
              >
                <div className="p-2.5 rounded bg-[#111214] border border-white/[0.06] text-[11px] font-mono text-[#8B8D93] leading-relaxed">
                  <p className="text-white/80 font-medium">DevDex:</p>
                  <p className="mt-0.5">
                    &ldquo;Hello! You&apos;re connected to Sajal&apos;s DevDex voice console. Speak naturally to ask about his work on Pairfect, Thinkfolio, CampusConnect, or his engineering stack.&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                state === 'idle'
                  ? 'bg-[#20B486]'
                  : state === 'connecting'
                  ? 'bg-[#8B8D93]'
                  : 'bg-[#E5484D]'
              }`}
            />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#55585F]">
              {state === 'idle'
                ? 'Ready'
                : state === 'connecting'
                ? 'Connecting'
                : state === 'listening'
                ? 'Listening'
                : state === 'thinking'
                ? 'Thinking'
                : 'Speaking'}
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#55585F]">
            WebRTC Voice
          </span>
        </div>
      </div>
    </section>
  );
}
