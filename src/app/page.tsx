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

  // Exact 0.10x background parallax (max bounds: ±8px * 0.10 = ±0.8px, ±6px * 0.10 = ±0.6px)
  const bgX = useTransform(bgSpringX, [-1, 1], [-0.8, 0.8]);
  const bgY = useTransform(bgSpringY, [-1, 1], [-0.6, 0.6]);

  // Subtle drift for the ambient studio spotlight
  const lightX = useTransform(bgSpringX, [-1, 1], [-8, 8]);
  const lightY = useTransform(bgSpringY, [-1, 1], [-5, 5]);

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
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#08090B]">
      {/* Ambient particle field — exact 0.10x depth multiplier */}
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
                  'radial-gradient(ellipse at 50% 50%, rgba(229, 72, 77, 0.02) 0%, transparent 65%)',
              }
            : {
                x: lightX,
                y: lightY,
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(229, 72, 77, 0.02) 0%, transparent 65%)',
              }
        }
      />

      {/* DevDex Developer Identity Console — Asymmetric 3D System */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8 flex items-center justify-center">
        <DevDexDevice profile={sampleProfile} />
      </div>
    </main>
  );
}
