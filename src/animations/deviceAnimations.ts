import type { Variants, Transition } from 'framer-motion';

// Spring for the initial card entrance (smooth ease-out, no bounce, no spin)
export const cardEntranceSpring: Transition = {
  type: 'spring',
  stiffness: 90,
  damping: 22,
  mass: 1,
};

// Spring config for the device unfold — main panels
export const unfoldSpring: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1,
};

// Spring for the left panel (staggered delay, deliberate inertia)
export const leftPanelSpring: Transition = {
  type: 'spring',
  stiffness: 75,
  damping: 20,
  mass: 1.05,
  delay: 0.05,
};

// Spring for the right panel (slightly more delayed, sitting deeper)
export const rightPanelSpring: Transition = {
  type: 'spring',
  stiffness: 75,
  damping: 20,
  mass: 1.05,
  delay: 0.1,
};

// Device shell variants with exact spatial Z-elevation across all 4 stages
export const deviceShellVariants: Variants = {
  enter: {
    scale: 0.92,
    z: -80,
    opacity: 0,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 24px rgba(0, 0, 0, 0.4)',
  },
  card: {
    scale: 1,
    z: 0,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 20px 48px rgba(0, 0, 0, 0.6)',
    transition: cardEntranceSpring,
  },
  scan: {
    scale: 1,
    z: 4,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.08), 0 22px 52px rgba(0, 0, 0, 0.65)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  resolve: {
    scale: 1.01,
    z: 8,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.08), 0 24px 56px rgba(0, 0, 0, 0.68)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  unfold: {
    scale: 1,
    z: 25,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 32px 70px rgba(0, 0, 0, 0.75)',
    transition: unfoldSpring,
  },
  settled: {
    scale: 1,
    z: 25,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 32px 70px rgba(0, 0, 0, 0.75)',
  },

  // Backwards compatibility aliases
  idle: {
    scale: 1,
    z: 0,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 20px 48px rgba(0, 0, 0, 0.6)',
  },
  power: {
    scale: 1,
    z: 4,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.08), 0 22px 52px rgba(0, 0, 0, 0.65)',
  },
  identify: {
    scale: 1.01,
    z: 8,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.08), 0 24px 56px rgba(0, 0, 0, 0.68)',
  },
  open: {
    scale: 1,
    z: 25,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 32px 70px rgba(0, 0, 0, 0.75)',
    transition: unfoldSpring,
  },
  profile: {
    scale: 1,
    z: 25,
    opacity: 1,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 32px 70px rgba(0, 0, 0, 0.75)',
  },
};

// Left panel unfold — emerges from behind center and settles at Z: -20px with 14px overlap
export const leftPanelVariants: Variants = {
  closed: {
    x: '100%',
    z: -40,
    rotateY: 0,
    opacity: 0,
    scale: 0.92,
  },
  open: {
    x: '14px',
    z: -20,
    rotateY: 3,
    opacity: 1,
    scale: 0.98,
    transition: leftPanelSpring,
  },
};

// Right panel unfold — emerges from behind center and settles at Z: -15px with 14px overlap
export const rightPanelVariants: Variants = {
  closed: {
    x: '-100%',
    z: -40,
    rotateY: 0,
    opacity: 0,
    scale: 0.92,
  },
  open: {
    x: '-14px',
    z: -15,
    rotateY: -3,
    opacity: 1,
    scale: 0.98,
    transition: rightPanelSpring,
  },
};

// Edge light pulse animation — refined and subtle
export const edgeLightVariants: Variants = {
  enter: { opacity: 0 },
  card: { opacity: 0.04 },
  scan: { opacity: 0.18, transition: { duration: 0.4 } },
  resolve: { opacity: 0.25, transition: { duration: 0.3 } },
  unfold: { opacity: 0.08, transition: { duration: 0.6 } },
  settled: { opacity: 0.06 },

  // Backwards compatibility aliases
  idle: { opacity: 0 },
  power: { opacity: 0.15 },
  identify: { opacity: 0.25 },
  open: { opacity: 0.08 },
  profile: { opacity: 0.06 },
};

// Display activation
export const displayVariants: Variants = {
  enter: { opacity: 0 },
  card: { opacity: 1, transition: { duration: 0.3 } },
  scan: { opacity: 1 },
  resolve: { opacity: 1 },
  unfold: { opacity: 1 },
  settled: { opacity: 1 },

  // Backwards compatibility aliases
  idle: { opacity: 1 },
  power: { opacity: 1 },
  identify: { opacity: 1 },
  open: { opacity: 1 },
  profile: { opacity: 1 },
};

// Identity found pulse (radial expansion) — quiet and restrained
export const identityPulseVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.2, 1.5],
    opacity: [0, 0.18, 0],
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
