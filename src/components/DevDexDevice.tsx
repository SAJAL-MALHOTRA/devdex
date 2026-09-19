'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import type { DeviceState, DeveloperProfile } from '@/types/profile';
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
  const [hoveredPanel, setHoveredPanel] = useState<'left' | 'center' | 'right' | null>(null);
  const [activeNav, setActiveNav] = useState('Profile');

  const prefersReducedMotion = useReducedMotion();

  // Mouse coordinate motion values normalized to [-1, 1] from center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Independent physics springs for each panel — distinct mass, stiffness, and damping
  // Center panel: crisp, responsive focal plane
  const centerSpringX = useSpring(mouseX, { stiffness: 100, damping: 20, mass: 1 });
  const centerSpringY = useSpring(mouseY, { stiffness: 100, damping: 20, mass: 1 });

  // Left panel: deliberate inertia, slightly slower settling
  const leftSpringX = useSpring(mouseX, { stiffness: 85, damping: 18, mass: 1.1 });
  const leftSpringY = useSpring(mouseY, { stiffness: 85, damping: 18, mass: 1.1 });

  // Right panel: deeper spatial inertia, fluid response
  const rightSpringX = useSpring(mouseX, { stiffness: 75, damping: 16, mass: 1.2 });
  const rightSpringY = useSpring(mouseY, { stiffness: 75, damping: 16, mass: 1.2 });

  // Independent rotational tilt (subtle: max 1.8° - 2.8°)
  const centerTiltX = useTransform(centerSpringY, [-1, 1], [1.8, -1.8]);
  const centerTiltY = useTransform(centerSpringX, [-1, 1], [-1.8, 1.8]);
  const centerParallaxX = useTransform(centerSpringX, [-1, 1], [-5, 5]);
  const centerParallaxY = useTransform(centerSpringY, [-1, 1], [-4, 4]);

  const leftTiltX = useTransform(leftSpringY, [-1, 1], [2.2, -2.2]);
  const leftTiltY = useTransform(leftSpringX, [-1, 1], [-2.5, 2.5]);
  const leftParallaxX = useTransform(leftSpringX, [-1, 1], [-9, 9]);
  const leftParallaxY = useTransform(leftSpringY, [-1, 1], [-6, 6]);

  const rightTiltX = useTransform(rightSpringY, [-1, 1], [2.2, -2.2]);
  const rightTiltY = useTransform(rightSpringX, [-1, 1], [-2.8, 2.8]);
  const rightParallaxX = useTransform(rightSpringX, [-1, 1], [-11, 11]);
  const rightParallaxY = useTransform(rightSpringY, [-1, 1], [-7, 7]);

  // Window pointer tracker with gentle decay on leave
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const ny = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      mouseX.set(Math.max(-1, Math.min(1, nx)));
      mouseY.set(Math.max(-1, Math.min(1, ny)));
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

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

  const scrollToSection = (item: string) => {
    setActiveNav(item);
    const targetId = `section-${item.toLowerCase()}`;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="perspective-1200 w-full flex items-center justify-center">
      <div className="relative preserve-3d">
        {/* Side panels — visible when unfolded */}
        <AnimatePresence>
          {isUnfolded && (
            <>
              {/* Left panel — Navigation */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full hidden md:block preserve-3d"
                variants={leftPanelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ transformOrigin: 'right center' }}
              >
                <motion.div
                  className="w-full h-full preserve-3d"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          z: hoveredPanel === 'left' ? 15 : hoveredPanel ? -8 : 0,
                          scale: hoveredPanel === 'left' ? 1.01 : hoveredPanel ? 0.99 : 1,
                        }
                  }
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  style={
                    prefersReducedMotion
                      ? {}
                      : {
                          rotateX: leftTiltX,
                          rotateY: leftTiltY,
                          x: leftParallaxX,
                          y: leftParallaxY,
                        }
                  }
                  onMouseEnter={() => setHoveredPanel('left')}
                  onMouseLeave={() => setHoveredPanel(null)}
                >
                  <div
                    className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#0d0e12',
                      border:
                        hoveredPanel === 'left'
                          ? '1px solid rgba(255, 255, 255, 0.16)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow:
                        hoveredPanel === 'left'
                          ? '0 28px 70px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.12)'
                          : '0 20px 50px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Top edge specular hairline */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px pointer-events-none z-30"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14), transparent)',
                      }}
                    />

                    {/* Subtle directional shadow from center panel on inner right edge */}
                    <div
                      className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none z-20"
                      style={{
                        background:
                          'linear-gradient(to left, rgba(0, 0, 0, 0.35), transparent)',
                      }}
                    />

                    <div className="relative h-full p-5 pt-6 flex flex-col justify-between z-10">
                      {/* DevDex wordmark */}
                      <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" />
                        <span className="text-xs font-semibold text-white tracking-tight">
                          DevDex
                        </span>
                      </motion.div>

                      {/* Navigation */}
                      <nav className="flex flex-col gap-4">
                        {['Profile', 'Skills', 'Projects', 'Connect'].map((item, i) => (
                          <motion.button
                            key={item}
                            onClick={() => scrollToSection(item)}
                            className={`text-left font-sans text-xs transition-colors duration-200 cursor-pointer flex items-center ${
                              activeNav === item
                                ? 'text-zinc-200 font-medium'
                                : 'text-zinc-500 hover:text-zinc-300 font-normal'
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
                            {activeNav === item && (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e5484d] mr-2 flex-shrink-0" />
                            )}
                            {item}
                          </motion.button>
                        ))}
                      </nav>

                      {/* Tagline */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        <p className="text-[11px] text-zinc-500 leading-normal font-sans">
                          Developer Identity
                          <br />
                          <span className="text-zinc-400">Sajal Malhotra</span>
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right panel — AI Agent */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full hidden md:block preserve-3d"
                variants={rightPanelVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ transformOrigin: 'left center' }}
              >
                <motion.div
                  className="w-full h-full preserve-3d"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          z: hoveredPanel === 'right' ? 15 : hoveredPanel ? -8 : 0,
                          scale: hoveredPanel === 'right' ? 1.01 : hoveredPanel ? 0.99 : 1,
                        }
                  }
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  style={
                    prefersReducedMotion
                      ? {}
                      : {
                          rotateX: rightTiltX,
                          rotateY: rightTiltY,
                          x: rightParallaxX,
                          y: rightParallaxY,
                        }
                  }
                  onMouseEnter={() => setHoveredPanel('right')}
                  onMouseLeave={() => setHoveredPanel(null)}
                >
                  <div
                    className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#0d0e12',
                      border:
                        hoveredPanel === 'right'
                          ? '1px solid rgba(255, 255, 255, 0.16)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow:
                        hoveredPanel === 'right'
                          ? '0 28px 70px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.12)'
                          : '0 20px 50px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Top edge specular hairline */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px pointer-events-none z-30"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14), transparent)',
                      }}
                    />

                    {/* Subtle directional shadow from center panel on inner left edge */}
                    <div
                      className="absolute top-0 left-0 bottom-0 w-8 pointer-events-none z-20"
                      style={{
                        background:
                          'linear-gradient(to right, rgba(0, 0, 0, 0.35), transparent)',
                      }}
                    />

                    <div className="relative h-full overflow-y-auto p-1 z-10">
                      <DevDexAI developerName={profile.name.split(' ')[0]} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main device body */}
        <motion.div
          className="relative z-10 w-[320px] md:w-[360px] preserve-3d"
          variants={deviceShellVariants}
          animate={state}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          onClick={state === 'idle' ? startSequence : undefined}
          role={state === 'idle' ? 'button' : undefined}
          tabIndex={state === 'idle' ? 0 : undefined}
          aria-label={state === 'idle' ? 'Activate DevDex' : undefined}
          style={{ cursor: state === 'idle' ? 'pointer' : 'default' }}
        >
          <motion.div
            className="w-full h-full preserve-3d"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    z: hoveredPanel === 'center' ? 15 : isUnfolded && hoveredPanel ? -8 : 0,
                    scale:
                      hoveredPanel === 'center'
                        ? 1.01
                        : isUnfolded && hoveredPanel
                        ? 0.99
                        : 1,
                  }
            }
            whileHover={
              state === 'idle' && !prefersReducedMotion
                ? { scale: 1.015, z: 6 }
                : undefined
            }
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            style={
              prefersReducedMotion
                ? {}
                : {
                    rotateX: centerTiltX,
                    rotateY: centerTiltY,
                    x: centerParallaxX,
                    y: centerParallaxY,
                  }
            }
            onMouseEnter={() => isUnfolded && setHoveredPanel('center')}
            onMouseLeave={() => isUnfolded && setHoveredPanel(null)}
          >
            {/* Device outer shell */}
            <div
              className="relative rounded-xl overflow-hidden transition-all duration-300"
              style={{
                border:
                  hoveredPanel === 'center'
                    ? '1px solid rgba(255, 255, 255, 0.16)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isUnfolded
                  ? hoveredPanel === 'center'
                    ? '0 1px 0 rgba(255,255,255,0.1), 0 32px 80px rgba(0,0,0,0.8), -8px 0 24px rgba(0,0,0,0.45), 8px 0 24px rgba(0,0,0,0.45)'
                    : '0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.65), -6px 0 18px rgba(0,0,0,0.35), 6px 0 18px rgba(0,0,0,0.35)'
                  : '0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.65)',
              }}
            >
              {/* Matte housing */}
              <div
                className="relative rounded-xl min-h-[500px] md:min-h-[560px]"
                style={{
                  background: '#0e0e11',
                }}
              >
                {/* Subtle top edge border / specular hairline */}
                <div
                  className="absolute top-0 left-4 right-4 h-px pointer-events-none z-20"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                  }}
                />

                {/* Edge light — animated glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(229, 72, 77, 0.12)',
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
                      background: `conic-gradient(from 0deg, transparent 0%, rgba(229,72,77,0.12) 10%, transparent 20%)`,
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
                    color="neutral"
                    active={state === 'scan' || state === 'identify'}
                    size={3}
                  />
                </div>

                {/* Display area — inset panel */}
                <motion.div
                  className="relative mx-3 mt-3 mb-6 rounded-lg overflow-hidden"
                  style={{
                    background: '#09090b',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    minHeight: 'calc(100% - 3rem)',
                  }}
                  variants={displayVariants}
                  animate={state}
                >
                  {/* Content container with proper min-height */}
                  <div className="relative min-h-[470px] md:min-h-[520px]">
                    {/* IDLE STATE */}
                    <AnimatePresence mode="wait">
                      {state === 'idle' && (
                        <motion.div
                          key="idle"
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        >
                          {/* DevDex logo — clean, confident typography */}
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.3,
                              type: 'spring',
                              stiffness: 120,
                              damping: 20,
                            }}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#e5484d]" />
                            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white font-sans">
                              DevDex
                            </h1>
                          </motion.div>

                          <div className="flex-1" />

                          {/* Tagline */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                              Sajal Malhotra
                              <br />
                              <span className="text-zinc-500">
                                Developer Profile &amp; Identity
                              </span>
                            </p>
                          </motion.div>

                          {/* Tap hint */}
                          <motion.p
                            className="mt-8 text-xs text-zinc-500 font-sans"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            Click to open
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
                            className="w-1.5 h-1.5 rounded-full bg-[#e5484d]"
                            animate={{
                              scale: [1, 2.5, 1.5],
                              opacity: [0.4, 1, 0.6],
                            }}
                            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                          />
                          <motion.p
                            className="mt-5 text-xs text-zinc-400 font-sans"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 0.4 }}
                          >
                            Initializing...
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
                          exit={{
                            opacity: 0,
                            scale: 1.02,
                            transition: { duration: 0.5 },
                          }}
                        >
                          {/* Radial pulse */}
                          <motion.div
                            className="absolute w-36 h-36 rounded-full"
                            style={{
                              background:
                                'radial-gradient(circle, rgba(229, 72, 77, 0.12) 0%, transparent 70%)',
                            }}
                            variants={identityPulseVariants}
                            initial="hidden"
                            animate="visible"
                          />

                          <AnimatePresence mode="wait">
                            {showIdentityText && (
                              <motion.div
                                key="identity-text"
                                className="flex flex-col items-center gap-1.5"
                              >
                                <motion.p
                                  className="text-sm font-medium tracking-tight text-white font-sans"
                                  initial={{ opacity: 0, scale: 0.96 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    delay: 0.15,
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 20,
                                  }}
                                >
                                  Identity Found
                                </motion.p>
                                <motion.p
                                  className="text-xs text-zinc-400 font-sans"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 0.7 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  Opening profile
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
                            <div id="section-profile">
                              <ProfileHeader profile={profile} />
                            </div>
                            <div id="section-skills">
                              <Skills skills={profile.skills} />
                            </div>
                            <div id="section-projects">
                              <Projects projects={profile.projects} />
                            </div>
                            {/* AI section inline on mobile */}
                            <div className="md:hidden">
                              <DevDexAI
                                developerName={profile.name.split(' ')[0]}
                              />
                            </div>
                            <div id="section-connect">
                              <Connect links={profile.links} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Bottom bezel — DevDex branding */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <p className="text-[10px] text-zinc-600 font-sans select-none">
                    DevDex
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
