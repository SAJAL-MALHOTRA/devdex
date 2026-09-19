'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import DevDexDevice from '@/components/DevDexDevice';
import ParticleField from '@/components/ParticleField';
import { sampleProfile } from '@/data/sampleProfile';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Background spring for subtle ambient depth
  const bgSpringX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const bgSpringY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Subtle 2-3px background parallax
  const bgX = useTransform(bgSpringX, [-1, 1], [-3, 3]);
  const bgY = useTransform(bgSpringY, [-1, 1], [-2, 2]);

  // Subtle drift for the ambient spotlight
  const lightX = useTransform(bgSpringX, [-1, 1], [-16, 16]);
  const lightY = useTransform(bgSpringY, [-1, 1], [-10, 10]);

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

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#09090b]">
      {/* Ambient particle field — with subtle 2-3px parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={prefersReducedMotion ? {} : { x: bgX, y: bgY }}
      >
        <ParticleField intensity="low" />
      </motion.div>

      {/* Subtle radial ambient atmosphere with gentle studio spotlight drift */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={
          prefersReducedMotion
            ? {
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(229, 72, 77, 0.03) 0%, transparent 60%)',
              }
            : {
                x: lightX,
                y: lightY,
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(229, 72, 77, 0.03) 0%, transparent 60%)',
              }
        }
      />

      {/* Device — Three-panel unfolding system */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8 flex items-center justify-center">
        <DevDexDevice profile={sampleProfile} />
      </div>
    </main>
  );
}
