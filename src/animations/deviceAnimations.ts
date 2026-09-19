import type { Variants, Transition } from 'framer-motion';

// Spring config for the device unfold — main panels
export const unfoldSpring: Transition = {
  type: 'spring',
  stiffness: 85,
  damping: 18,
  mass: 1,
};

// Spring for the left panel (staggered delay, deliberate inertia)
export const leftPanelSpring: Transition = {
  type: 'spring',
  stiffness: 85,
  damping: 18,
  mass: 1,
  delay: 0.08,
};

// Spring for the right panel (slightly more delayed, sitting deeper)
export const rightPanelSpring: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 18,
  mass: 1,
  delay: 0.16,
};

// Device shell variants with spatial Z-elevation
export const deviceShellVariants: Variants = {
  idle: {
    scale: 1,
    z: 0,
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06), 0 20px 48px rgba(0, 0, 0, 0.6)',
  },
  power: {
    scale: 1,
    z: 4,
    boxShadow: '0 0 24px rgba(229, 72, 77, 0.06), 0 24px 54px rgba(0, 0, 0, 0.65)',
  },
  scan: {
    scale: 1,
    z: 8,
    boxShadow: '0 0 32px rgba(229, 72, 77, 0.08), 0 26px 60px rgba(0, 0, 0, 0.7)',
  },
  identify: {
    scale: 1.015,
    z: 22,
    boxShadow: '0 0 44px rgba(229, 72, 77, 0.12), 0 30px 68px rgba(0, 0, 0, 0.75)',
  },
  open: {
    scale: 1,
    z: 16,
    boxShadow: '0 0 16px rgba(229, 72, 77, 0.04), 0 24px 60px rgba(0, 0, 0, 0.65)',
  },
  profile: {
    scale: 1,
    z: 16,
    boxShadow: '0 0 0 rgba(229, 72, 77, 0), 0 24px 60px rgba(0, 0, 0, 0.65)',
  },
};

// Center panel in the tri-panel layout — primary focal plane
export const centerPanelVariants: Variants = {
  closed: {
    x: 0,
    z: 0,
  },
  open: {
    x: 0,
    z: 16,
    transition: unfoldSpring,
  },
};

// Left panel unfold — emerges from depth and settles angled toward viewer
export const leftPanelVariants: Variants = {
  closed: {
    x: '-20%',
    z: -50,
    rotateY: 14,
    opacity: 0,
    scale: 0.95,
  },
  open: {
    x: '-102%',
    z: -14,
    rotateY: 4,
    opacity: 1,
    scale: 0.985,
    transition: leftPanelSpring,
  },
};

// Right panel unfold — emerges from deeper plane and sits slightly farther back
export const rightPanelVariants: Variants = {
  closed: {
    x: '20%',
    z: -65,
    rotateY: -14,
    opacity: 0,
    scale: 0.94,
  },
  open: {
    x: '102%',
    z: -24,
    rotateY: -4,
    opacity: 1,
    scale: 0.975,
    transition: rightPanelSpring,
  },
};

// Edge light pulse animation
export const edgeLightVariants: Variants = {
  idle: {
    opacity: 0,
  },
  power: {
    opacity: [0, 0.5, 0.25],
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
  scan: {
    opacity: 0.35,
  },
  identify: {
    opacity: [0.35, 0.8, 0.4],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  open: {
    opacity: 0.12,
    transition: { duration: 1 },
  },
  profile: {
    opacity: 0.08,
    transition: { duration: 1.5 },
  },
};

// Display activation
export const displayVariants: Variants = {
  idle: {
    opacity: 0,
    filter: 'brightness(0)',
  },
  power: {
    opacity: 1,
    filter: 'brightness(0.6)',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  scan: {
    opacity: 1,
    filter: 'brightness(0.9)',
    transition: { duration: 0.3 },
  },
  identify: {
    opacity: 1,
    filter: 'brightness(1.05)',
    transition: { duration: 0.3 },
  },
  open: {
    opacity: 1,
    filter: 'brightness(1)',
    transition: { duration: 0.5 },
  },
  profile: {
    opacity: 1,
    filter: 'brightness(1)',
  },
};

// Identity found pulse (radial expansion)
export const identityPulseVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.4, 1.8],
    opacity: [0, 0.3, 0],
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
