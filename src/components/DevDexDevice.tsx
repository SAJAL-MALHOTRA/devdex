'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  const prefersReducedMotion = useReducedMotion();

  // 4-Stage intro state machine: enter -> card -> scan -> resolve -> unfold -> settled
  const [state, setState] = useState<DeviceState>(() =>
    prefersReducedMotion ? 'settled' : 'enter'
  );
  const [isMouseActive, setIsMouseActive] = useState(() => !!prefersReducedMotion);
  const [hoveredPanel, setHoveredPanel] = useState<'left' | 'center' | 'right' | null>(null);
  const [activeNav, setActiveNav] = useState('Profile');

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Automatic mount sequence: schedules timed progression without synchronous setState in effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    // 0.2s — developer card appears at Z: -80px and glides forward to Z: 0px
    const t1 = setTimeout(() => setState('card'), 200);

    // 1.1s — identity scan begins (horizontal scan beam + progress bar)
    const t2 = setTimeout(() => setState('scan'), 1100);

    // 1.8s — identity resolves (Stage 03: Data resolution, ~400ms)
    const t3 = setTimeout(() => setState('resolve'), 1800);

    // 2.2s — card begins physical 3D unfolding from behind
    const t4 = setTimeout(() => setState('unfold'), 2200);

    // 3.1s — workspace settles into 3D positions
    const t5 = setTimeout(() => setState('settled'), 3100);

    // 3.3s — mouse interaction becomes active
    const t6 = setTimeout(() => setIsMouseActive(true), 3300);

    timersRef.current = [t1, t2, t3, t4, t5, t6];

    return () => clearAllTimers();
  }, [clearAllTimers, prefersReducedMotion]);

  // Replay trigger for user click
  const replayIntro = useCallback(() => {
    clearAllTimers();

    if (prefersReducedMotion) {
      setState('settled');
      setIsMouseActive(true);
      return;
    }

    setState('enter');
    setIsMouseActive(false);

    const t1 = setTimeout(() => setState('card'), 200);
    const t2 = setTimeout(() => setState('scan'), 1100);
    const t3 = setTimeout(() => setState('resolve'), 1800);
    const t4 = setTimeout(() => setState('unfold'), 2200);
    const t5 = setTimeout(() => setState('settled'), 3100);
    const t6 = setTimeout(() => setIsMouseActive(true), 3300);

    timersRef.current = [t1, t2, t3, t4, t5, t6];
  }, [clearAllTimers, prefersReducedMotion]);

  // Fast-forward / Skip to final workspace
  const skipToWorkspace = useCallback(() => {
    clearAllTimers();
    setState('settled');
    setIsMouseActive(true);
  }, [clearAllTimers]);

  // Mouse coordinate motion values normalized to [-1, 1] from center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Independent physics springs for each panel with distinct inertia
  // Center panel (0.25x): crisp, hero focal anchor
  const centerSpringX = useSpring(mouseX, { stiffness: 100, damping: 20, mass: 1 });
  const centerSpringY = useSpring(mouseY, { stiffness: 100, damping: 20, mass: 1 });

  // Left panel (0.55x): deliberate mechanical inertia
  const leftSpringX = useSpring(mouseX, { stiffness: 85, damping: 18, mass: 1.1 });
  const leftSpringY = useSpring(mouseY, { stiffness: 85, damping: 18, mass: 1.1 });

  // Right panel (0.65x): fluid voice plane inertia
  const rightSpringX = useSpring(mouseX, { stiffness: 75, damping: 16, mass: 1.2 });
  const rightSpringY = useSpring(mouseY, { stiffness: 75, damping: 16, mass: 1.2 });

  // Exact bounds & calibrated coefficients:
  // Center: 0.25x -> transX ±2.0px, transY ±1.5px, rotX ±0.5°, rotY ±0.75°
  const centerTiltX = useTransform(centerSpringY, [-1, 1], [0.5, -0.5]);
  const centerTiltY = useTransform(centerSpringX, [-1, 1], [-0.75, 0.75]);
  const centerParallaxX = useTransform(centerSpringX, [-1, 1], [-2.0, 2.0]);
  const centerParallaxY = useTransform(centerSpringY, [-1, 1], [-1.5, 1.5]);

  // Left: 0.55x -> transX ±4.4px, transY ±3.3px, rotX ±1.1°, rotY ±1.65°
  const leftTiltX = useTransform(leftSpringY, [-1, 1], [1.1, -1.1]);
  const leftTiltY = useTransform(leftSpringX, [-1, 1], [-1.65, 1.65]);
  const leftParallaxX = useTransform(leftSpringX, [-1, 1], [-4.4, 4.4]);
  const leftParallaxY = useTransform(leftSpringY, [-1, 1], [-3.3, 3.3]);

  // Right: 0.65x -> transX ±5.2px, transY ±3.9px, rotX ±1.3°, rotY ±1.95°
  const rightTiltX = useTransform(rightSpringY, [-1, 1], [1.3, -1.3]);
  const rightTiltY = useTransform(rightSpringX, [-1, 1], [-1.95, 1.95]);
  const rightParallaxX = useTransform(rightSpringX, [-1, 1], [-5.2, 5.2]);
  const rightParallaxY = useTransform(rightSpringY, [-1, 1], [-3.9, 3.9]);

  // Window pointer tracker with gentle decay on leave
  useEffect(() => {
    if (prefersReducedMotion || !isMouseActive) return;

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
  }, [mouseX, mouseY, prefersReducedMotion, isMouseActive]);

  const isUnfolded =
    state === 'unfold' || state === 'settled' || state === 'open' || state === 'profile';

  const scrollToSection = (item: string) => {
    setActiveNav(item);
    const targetId = `section-${item.toLowerCase()}`;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="perspective-1400 w-full flex flex-col items-center justify-center relative">
      {/* Subtle Skip button during intro sequence */}
      {!isUnfolded && state !== 'enter' && (
        <motion.button
          onClick={skipToWorkspace}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          className="absolute -top-10 right-4 text-[11px] font-mono text-[#8B8D93] hover:text-[#F2F2F2] transition-opacity duration-200 cursor-pointer z-50 flex items-center gap-1 bg-[#111214] px-2.5 py-1 rounded border border-white/[0.08]"
        >
          <span>Skip reveal</span>
          <span className="text-zinc-500">→</span>
        </motion.button>
      )}

      {/* Shared 3D Scene */}
      <div className="relative preserve-3d">
        {/* Side panels — unfold physically from behind with 14px overlap under center */}
        <AnimatePresence>
          {isUnfolded && (
            <>
              {/* LEFT PANEL — Developer Navigation (25% proportion: 270px width, Z: -20px) */}
              <motion.div
                className="absolute top-0 right-full w-[250px] md:w-[270px] h-full hidden md:block preserve-3d"
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
                          z: hoveredPanel === 'left' ? 8 : hoveredPanel ? -4 : 0,
                          scale: hoveredPanel === 'left' ? 1.01 : hoveredPanel ? 0.99 : 1,
                        }
                  }
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  style={
                    prefersReducedMotion || !isMouseActive
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
                      background: '#0C0D0F',
                      border:
                        hoveredPanel === 'left'
                          ? '1px solid rgba(255, 255, 255, 0.16)'
                          : '1px solid rgba(255, 255, 255, 0.07)',
                      boxShadow:
                        hoveredPanel === 'left'
                          ? '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.12)'
                          : '0 16px 40px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Top edge specular hairline */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px pointer-events-none z-30"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
                      }}
                    />

                    {/* Left Panel Inner Structure (Linear restraint) */}
                    <div className="relative h-full p-6 flex flex-col justify-between z-10 select-none">
                      {/* Section 1: Brand & Navigation */}
                      <div>
                        <div className="flex items-center gap-2 pb-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
                          <span className="text-xs font-semibold text-[#F2F2F2] font-sans">
                            DevDex
                          </span>
                        </div>

                        {/* Navigation links */}
                        <nav className="flex flex-col gap-3.5 pt-5">
                          {['Profile', 'Projects', 'Skills', 'Connect'].map((item) => {
                            const isActive = activeNav === item;
                            return (
                              <button
                                key={item}
                                onClick={() => scrollToSection(item)}
                                className={`text-left text-xs font-sans transition-all duration-150 cursor-pointer flex items-center ${
                                  isActive
                                    ? 'text-[#F2F2F2] font-medium border-l-2 border-[#E5484D] pl-3 -ml-3'
                                    : 'text-[#8B8D93] hover:text-[#F2F2F2] font-normal border-l-2 border-transparent pl-3 -ml-3'
                                }`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </nav>
                      </div>

                      {/* Section 2: Identity Footer */}
                      <div className="pt-4 border-t border-white/[0.06]">
                        <p className="text-xs font-medium text-[#F2F2F2] font-sans tracking-tight">
                          Sajal Malhotra
                        </p>
                        <p className="text-[11px] text-[#55585F] font-sans mt-0.5">
                          Developer Console
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* RIGHT PANEL — DevDex Voice Console (33% proportion: 360px width, Z: -15px) */}
              <motion.div
                className="absolute top-0 left-full w-[320px] md:w-[360px] h-full hidden md:block preserve-3d"
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
                          z: hoveredPanel === 'right' ? 8 : hoveredPanel ? -4 : 0,
                          scale: hoveredPanel === 'right' ? 1.01 : hoveredPanel ? 0.99 : 1,
                        }
                  }
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  style={
                    prefersReducedMotion || !isMouseActive
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
                      background: '#0C0D0F',
                      border:
                        hoveredPanel === 'right'
                          ? '1px solid rgba(255, 255, 255, 0.16)'
                          : '1px solid rgba(255, 255, 255, 0.07)',
                      boxShadow:
                        hoveredPanel === 'right'
                          ? '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.12)'
                          : '0 16px 40px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Top edge specular hairline */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px pointer-events-none z-30"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
                      }}
                    />

                    <div className="relative h-full overflow-y-auto z-10">
                      <DevDexAI developerName={profile.name.split(' ')[0]} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* CENTER PANEL — Hero Identity & Work (42% proportion: 470px width, Z: +25px) */}
        <motion.div
          className="relative z-20 w-[340px] md:w-[470px] preserve-3d"
          variants={deviceShellVariants}
          initial="enter"
          animate={state}
        >
          <motion.div
            className="w-full h-full preserve-3d"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    z: hoveredPanel === 'center' ? 8 : isUnfolded && hoveredPanel ? -4 : 0,
                    scale:
                      hoveredPanel === 'center'
                        ? 1.01
                        : isUnfolded && hoveredPanel
                        ? 0.99
                        : 1,
                  }
            }
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            style={
              prefersReducedMotion || !isMouseActive
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
            {/* Outer physical housing with lateral overlap drop shadows */}
            <div
              className="relative rounded-xl overflow-hidden transition-all duration-300"
              style={{
                border:
                  hoveredPanel === 'center'
                    ? '1px solid rgba(255, 255, 255, 0.18)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isUnfolded
                  ? hoveredPanel === 'center'
                    ? '0 1px 0 rgba(255,255,255,0.12), 0 32px 80px rgba(0,0,0,0.8), -12px 0 28px rgba(0,0,0,0.55), 12px 0 28px rgba(0,0,0,0.55)'
                    : '0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.65), -10px 0 22px rgba(0,0,0,0.45), 10px 0 22px rgba(0,0,0,0.45)'
                  : '0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.65)',
              }}
            >
              {/* Primary focal surface */}
              <div
                className="relative rounded-xl min-h-[540px] md:min-h-[600px]"
                style={{
                  background: '#0C0D0F',
                }}
              >
                {/* Subtle top edge specular hairline */}
                <div
                  className="absolute top-0 left-4 right-4 h-px pointer-events-none z-20"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
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

                {/* Top LED row */}
                <div className="absolute top-3.5 right-3.5 flex gap-2 z-20">
                  <LEDIndicator
                    color="red"
                    active={state !== 'enter'}
                    size={3}
                  />
                  <LEDIndicator
                    color="neutral"
                    active={state === 'scan' || state === 'resolve'}
                    size={3}
                  />
                </div>

                {/* Display area — inset surface with 30-40% fewer borders */}
                <motion.div
                  className="relative mx-3.5 mt-3.5 mb-6 rounded-lg overflow-hidden"
                  style={{
                    background: '#08090B',
                    minHeight: 'calc(100% - 3.25rem)',
                  }}
                  variants={displayVariants}
                  animate={state}
                >
                  <div className="relative min-h-[500px] md:min-h-[550px]">
                    <AnimatePresence mode="wait">
                      {/* STAGE 01 / STAGE 02 / STAGE 03: DEVELOPER CARD & ELEGANT SCAN */}
                      {!isUnfolded && (
                        <motion.div
                          key="card-intro"
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        >
                          <Scanner
                            isActive={state === 'scan' || state === 'resolve'}
                            isResolving={state === 'resolve'}
                            developerName={profile.name}
                            role={profile.role}
                          />
                        </motion.div>
                      )}

                      {/* STAGE 04 & SETTLED: UNVEILED DEVELOPER WORKSPACE */}
                      {isUnfolded && (
                        <motion.div
                          key="profile-workspace"
                          className="absolute inset-0 overflow-y-auto"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.15, duration: 0.5 }}
                        >
                          <div className="p-6 space-y-6">
                            <div id="section-profile">
                              <ProfileHeader profile={profile} />
                            </div>
                            <div id="section-projects">
                              <Projects projects={profile.projects} />
                            </div>
                            <div id="section-skills">
                              <Skills skills={profile.skills} />
                            </div>
                            {/* Voice section inline on mobile only */}
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
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
                  <p className="text-[10px] text-[#55585F] font-mono select-none tracking-tight">
                    DEVDEX // CONSOLE
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle replay button once settled */}
      {isUnfolded && (
        <motion.button
          onClick={replayIntro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.9 }}
          className="mt-7 text-[11px] font-mono text-[#55585F] hover:text-[#8B8D93] transition-opacity duration-200 cursor-pointer flex items-center gap-1.5"
          title="Replay 3D intro animation"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Replay intro</span>
        </motion.button>
      )}
    </div>
  );
}
