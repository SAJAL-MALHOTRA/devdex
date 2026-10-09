'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { DeveloperProfile } from '@/types/profile';

type AIAgentState = 'idle' | 'listening' | 'thinking' | 'speaking';

const WAVEFORM_BARS = 20;

function buildDeveloperIntroduction(profile: DeveloperProfile): string {
  const projectTechnologies = Array.from(
    new Set(profile.projects.flatMap((project) => project.technologies)),
  ).slice(0, 6);
  const projects = profile.projects.map((project) => project.name).filter(Boolean).slice(0, 2);
  const experience = (profile.experience ?? [])
    .map((entry) => `${entry.role}${entry.company ? ` at ${entry.company}` : ''}`)
    .filter(Boolean)
    .slice(0, 2);
  const education = (profile.education ?? [])
    .map((entry) =>
      `${[entry.degree, entry.field].filter(Boolean).join(' in ')}${entry.institution ? ` at ${entry.institution}` : ''}`.trim(),
    )
    .filter(Boolean)
    .slice(0, 2);
  const bio = (profile.bio || profile.aiSummary).trim();
  const conciseBio =
    bio.length > 180 ? `${bio.slice(0, 177).trimEnd()}…` : bio;
  const introduction = [
    `Let me introduce ${profile.name}.`,
    (profile.role || profile.location) &&
      `${profile.role ? `Their role is ${profile.role}` : 'They are a developer'}${profile.location ? `, based in ${profile.location}` : ''}.`,
    conciseBio && `In their own words: "${conciseBio}"`,
    profile.skills.length > 0 &&
      `They work with ${profile.skills.slice(0, 6).join(', ')}.`,
    projects.length > 0 &&
      `Their projects include ${projects.join(' and ')}.`,
    projectTechnologies.length > 0 &&
      `Across those projects, they use technologies such as ${projectTechnologies.join(', ')}.`,
    experience.length > 0 && `They have experience as ${experience.join(' and ')}.`,
    education.length > 0 && `Their education includes ${education.join(' and ')}.`,
  ].filter((sentence): sentence is string => typeof sentence === 'string' && sentence.length > 0);

  const fullIntroduction = introduction.join(' ');
  if (fullIntroduction.length <= 850) return fullIntroduction;

  const trimmedIntroduction = fullIntroduction.slice(0, 847).trimEnd();
  const lastSpace = trimmedIntroduction.lastIndexOf(' ');
  return `${trimmedIntroduction.slice(0, lastSpace)}…`;
}

export default function DevDexAI({ profile }: { profile: DeveloperProfile }) {
  const [agentState, setAgentState] = useState<AIAgentState>('idle');
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array.from({ length: WAVEFORM_BARS }, () => Math.random()),
  );
  const [showSummary, setShowSummary] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [spokenCharacters, setSpokenCharacters] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const developerName = profile.name.split(' ')[0];
  const summary = buildDeveloperIntroduction(profile);

  // Animate waveform when speaking
  useEffect(() => {
    if (agentState !== 'speaking') return;
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: WAVEFORM_BARS }, () => Math.random()));
    }, 120);
    return () => clearInterval(interval);
  }, [agentState]);

  useEffect(() => () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      window.speechSynthesis?.cancel();
    }
  }, []);

  const toggleSpeech = () => {
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setAgentState('idle');
      return;
    }

    setShowSummary(true);
    setSpokenCharacters(0);
    setSpeechError('');

    if (!summary) {
      setSpeechError(`${profile.name} hasn't added enough profile details for an introduction.`);
      return;
    }

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeechError('Voice playback is not supported by this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(summary);
    const englishVoices = window.speechSynthesis.getVoices().filter((voice) =>
      voice.lang.toLowerCase().startsWith('en'),
    );
    utterance.voice =
      englishVoices.find((voice) => /robot|synthetic|zarvox|trinoid|computer/i.test(voice.name)) ??
      englishVoices.find((voice) => /fred/i.test(voice.name)) ??
      englishVoices.find((voice) => voice.lang.toLowerCase() === 'en-us') ??
      englishVoices[0] ??
      null;
    utteranceRef.current = utterance;
    utterance.lang = utterance.voice?.lang || navigator.language || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 0.35;
    utterance.onstart = () => {
      setAgentState('speaking');
      typingIntervalRef.current = setInterval(() => {
        setSpokenCharacters((current) => Math.min(current + 1, summary.length));
      }, 90);
    };
    utterance.onboundary = (event) => {
      setSpokenCharacters((current) =>
        Math.max(current, Math.min(event.charIndex + (event.charLength ?? 0), summary.length)),
      );
    };
    utterance.onend = () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      setSpokenCharacters(summary.length);
      utteranceRef.current = null;
      setAgentState('idle');
    };
    utterance.onerror = () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      utteranceRef.current = null;
      setAgentState('idle');
      setSpeechError('Voice playback could not start. Please try again.');
    };
    setAgentState('thinking');
    window.speechSynthesis.speak(utterance);
  };

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

          {showSummary ? (
            <motion.div
              key="summary"
              role="status"
              aria-live="polite"
              className="relative flex-1 rounded-xl border border-white/[0.08] bg-[#151515] px-3 py-2.5 text-[11px] leading-[1.6] text-gray-300 before:absolute before:-left-1 before:top-3 before:h-2 before:w-2 before:rotate-45 before:border-b before:border-l before:border-white/[0.08] before:bg-[#151515]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {speechError ? (
                <span className="text-gray-500">{speechError}</span>
              ) : (
                <>
                  <span className="mb-1 block font-mono text-[8px] uppercase tracking-[0.15em] text-[#e85d4a]">
                    Meet {developerName}
                  </span>
                  {summary.slice(0, spokenCharacters)}
                  {agentState === 'speaking' && (
                    <span aria-hidden="true" className="ml-px inline-block h-3 w-px animate-pulse bg-[#e85d4a] align-middle" />
                  )}
                </>
              )}
            </motion.div>
          ) : (
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
          )}
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
            type="button"
            onClick={toggleSpeech}
            aria-pressed={agentState === 'speaking' || agentState === 'thinking'}
            className="font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/[0.06] rounded-md hover:border-white/[0.12] hover:bg-white/[0.02] text-gray-500 hover:text-gray-300 transition-all duration-200 cursor-pointer"
          >
            {agentState === 'speaking' || agentState === 'thinking'
              ? 'Stop playback'
              : showSummary
                ? 'Listen again'
                : 'Tap to listen'}
          </button>
          <span className="font-mono text-[8px] text-gray-700 tracking-wider uppercase">
            {agentState}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
