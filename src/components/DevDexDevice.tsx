'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DeviceState } from '@/types/profile';
import type { DeveloperProfile } from '@/types/profile';
import {
  deviceShellVariants,
  edgeLightVariants,
  displayVariants,
  identityPulseVariants,
  leftPanelVariants,
  rightPanelVariants,
} from '@/animations/deviceAnimations';
import Scanner from './Scanner';
import LEDIndicator from './LEDIndicator';
import ProfileHeader from './ProfileHeader';
import Skills from './Skills';
import Projects from './Projects';
import DevDexAI from './DevDexAI';
import Connect from './Connect';

interface DevDexDeviceProps {
  profile: DeveloperProfile;
}

export default function DevDexDevice({ profile }: DevDexDeviceProps) {
  const [state, setState] = useState<DeviceState>('idle');
  const [showIdentityText, setShowIdentityText] = useState(false);

  const startSequence = useCallback(() => {
    if (state !== 'idle') return;

    // STATE 02 — POWER
    setState('power');

    setTimeout(() => {
      // STATE 03 — SCAN
      setState('scan');
    }, 1200);
  }, [state]);

  const handleScanComplete = useCallback(() => {
    // STATE 04 — IDENTIFY
    setState('identify');
    setShowIdentityText(true);

    setTimeout(() => {
      // STATE 05 — OPEN
      setState('open');
      setShowIdentityText(false);

      setTimeout(() => {
        // STATE 06 — PROFILE (settled)
        setState('profile');
      }, 1400);
    }, 1400);
  }, []);

  const isUnfolded = state === 'open' || state === 'profile';

  return (
    <div className="perspective-1200 w-full flex items-center justify-center">
      <div className="relative preserve-3d">
        {/* Side panels — visible when unfolded */}
        <AnimatePresence>
          {isUnfolded && (
            <>
              {/* Left panel — Navigation */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full hidden md:block"
                variants={leftPanelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ transformOrigin: 'right center' }}
              >
                <div
                  className="w-full h-full rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #111111 0%, #0d0d0d 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="noise-texture relative h-full p-5 pt-6 flex flex-col justify-between">
                    {/* DevDex wordmark */}
                    <motion.p
                      className="font-mono text-[9px] tracking-[0.25em] text-gray-600 uppercase"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      DevDex
                    </motion.p>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-5">
                      {['PROFILE', 'PROJECTS', 'SKILLS', 'EXPERIENCE', 'CONNECT'].map(
                        (item, i) => (
                          <motion.button
                            key={item}
                            className={`text-left font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-300 ${
                              i === 0
                                ? 'text-gray-200'
                                : 'text-gray-700 hover:text-gray-400'
                            }`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.4 + i * 0.06,
                              type: 'spring',
                              stiffness: 120,
                              damping: 20,
                            }}
                          >
                            {i === 0 && (
                              <span className="inline-block w-1 h-1 rounded-full bg-[#e85d4a] mr-2 -translate-y-px" />
                            )}
                            {item}
                          </motion.button>
                        )
                      )}
                    </nav>

                    {/* Tagline */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <p className="font-mono text-[7px] tracking-[0.08em] text-gray-800 leading-[1.8]">
                        MORE THAN
                        <br />A PORTFOLIO.
                        <br />
                        <span className="text-gray-700">A CONVERSATION.</span>
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right panel — AI Agent */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full hidden md:block"
                variants={rightPanelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ transformOrigin: 'left center' }}
              >
                <div
                  className="w-full h-full rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #111111 0%, #0d0d0d 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="noise-texture glass-reflection relative h-full overflow-y-auto p-1">
                    <DevDexAI
                      aiSummary={profile.aiSummary}
                      developerName={profile.name.split(' ')[0]}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main device body */}
        <motion.div
          className="relative z-10 w-[320px] md:w-[360px]"
          variants={deviceShellVariants}
          animate={state}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          onClick={state === 'idle' ? startSequence : undefined}
          role={state === 'idle' ? 'button' : undefined}
          tabIndex={state === 'idle' ? 0 : undefined}
          aria-label={state === 'idle' ? 'Activate DevDex' : undefined}
          style={{ cursor: state === 'idle' ? 'pointer' : 'default' }}
        >
          {/* Device outer shell */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              // Bevel effect — layered shadows for physical depth
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.04), 0 -1px 0 rgba(0,0,0,0.3), 0 30px 70px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Metal housing */}
            <div
              className="relative rounded-xl min-h-[500px] md:min-h-[560px]"
              style={{
                background: 'linear-gradient(180deg, #121212 0%, #0e0e0e 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Noise texture overlay */}
              <div className="noise-texture absolute inset-0 rounded-xl" />

              {/* Top bevel highlight */}
              <div
                className="absolute top-0 left-4 right-4 h-px pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                }}
              />

              {/* Edge light — animated glow */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(232, 93, 74, 0.1)',
                }}
                variants={edgeLightVariants}
                animate={state}
              />

              {/* Animated edge sweep during power/scan */}
              {(state === 'power' || state === 'scan') && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0%, rgba(232,93,74,0.12) 10%, transparent 20%)`,
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-xl"
                    style={{
                      background: 'inherit',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}

              {/* Top LED row */}
              <div className="absolute top-3.5 right-3.5 flex gap-2 z-20">
                <LEDIndicator
                  color="red"
                  active={state !== 'idle'}
                  size={3}
                />
                <LEDIndicator
                  color="cyan"
                  active={state === 'scan' || state === 'identify'}
                  size={3}
                />
              </div>

              {/* Display area — inset glass panel */}
              <motion.div
                className="relative mx-3 mt-3 mb-6 rounded-lg overflow-hidden"
                style={{
                  background: '#080808',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
                  minHeight: 'calc(100% - 3rem)',
                }}
                variants={displayVariants}
                animate={state}
              >
                {/* Glass reflection — very subtle diagonal highlight */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)',
                  }}
                />

                {/* Content container with proper min-height */}
                <div className="relative min-h-[470px] md:min-h-[520px]">
                  {/* IDLE STATE */}
                  <AnimatePresence mode="wait">
                    {state === 'idle' && (
                      <motion.div
                        key="idle"
                        className="absolute inset-0 flex flex-col items-center justify-center p-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                      >
                        {/* DevDex logo — clean, editorial */}
                        <motion.h1
                          className="text-[22px] md:text-[26px] font-semibold tracking-[0.02em] text-white"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
                        >
                          DEVDEX
                        </motion.h1>

                        <div className="flex-1" />

                        {/* Tagline */}
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <p className="font-mono text-[8px] tracking-[0.12em] text-gray-600 leading-[2] uppercase">
                            More than a portfolio.
                            <br />
                            A conversation.
                          </p>
                        </motion.div>

                        {/* Tap hint — restrained pulse */}
                        <motion.p
                          className="mt-8 font-mono text-[8px] tracking-[0.15em] text-gray-700 uppercase"
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          Tap to activate
                        </motion.p>
                      </motion.div>
                    )}

                    {/* POWER STATE */}
                    {state === 'power' && (
                      <motion.div
                        key="power"
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <motion.div
                          className="w-1 h-1 rounded-full bg-[#e85d4a]"
                          animate={{
                            scale: [1, 2.5, 1.5],
                            opacity: [0.4, 1, 0.6],
                          }}
                          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                        />
                        <motion.p
                          className="mt-5 font-mono text-[9px] tracking-[0.25em] text-gray-600 uppercase"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          transition={{ delay: 0.4 }}
                        >
                          Initializing
                        </motion.p>
                      </motion.div>
                    )}

                    {/* SCAN STATE */}
                    {state === 'scan' && (
                      <motion.div
                        key="scan"
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <Scanner
                          isActive={true}
                          onScanComplete={handleScanComplete}
                        />
                      </motion.div>
                    )}

                    {/* IDENTIFY STATE */}
                    {state === 'identify' && (
                      <motion.div
                        key="identify"
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5 } }}
                      >
                        {/* Radial pulse */}
                        <motion.div
                          className="absolute w-40 h-40 rounded-full"
                          style={{
                            background:
                              'radial-gradient(circle, rgba(232, 93, 74, 0.15) 0%, transparent 70%)',
                          }}
                          variants={identityPulseVariants}
                          initial="hidden"
                          animate="visible"
                        />

                        <AnimatePresence mode="wait">
                          {showIdentityText && (
                            <motion.div
                              key="identity-text"
                              className="flex flex-col items-center gap-2"
                            >
                              <motion.p
                                className="font-mono text-[11px] tracking-[0.25em] text-white uppercase"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 150, damping: 20 }}
                              >
                                Identity Found
                              </motion.p>
                              <motion.p
                                className="font-mono text-[9px] tracking-[0.2em] text-gray-600 uppercase"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ delay: 0.5 }}
                              >
                                Opening DevDex
                              </motion.p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {/* PROFILE STATE (after unfold) */}
                    {(state === 'open' || state === 'profile') && (
                      <motion.div
                        key="profile"
                        className="absolute inset-0 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <div className="p-4 md:p-5 space-y-6">
                          <ProfileHeader profile={profile} />
                          <Skills skills={profile.skills} />
                          <Projects projects={profile.projects} />
                          {/* AI section inline on mobile */}
                          <div className="md:hidden">
                            <DevDexAI
                              aiSummary={profile.aiSummary}
                              developerName={profile.name.split(' ')[0]}
                            />
                          </div>
                          <Connect links={profile.links} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Bottom bezel — DevDex branding */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <p className="font-mono text-[7px] tracking-[0.3em] text-gray-800 uppercase select-none">
                  DevDex
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
