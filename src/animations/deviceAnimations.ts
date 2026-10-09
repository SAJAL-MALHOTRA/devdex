import type { Variants, Transition } from 'framer-motion';

// Spring config for the device unfold — main panels
export const unfoldSpring: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 15,
  mass: 1,
};

// Spring for the left panel (slightly delayed)
export const leftPanelSpring: Transition = {
  type: 'spring',
  stiffness: 75,
  damping: 14,
  mass: 1,
  delay: 0.05,
};

// Spring for the right panel (slightly more delayed)
export const rightPanelSpring: Transition = {
  type: 'spring',
  stiffness: 70,
  damping: 14,
  mass: 1,
  delay: 0.1,
};

// Device shell variants
export const deviceShellVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: '0 0 0 rgba(232, 93, 74, 0), 0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  power: {
    scale: 1,
    boxShadow: '0 0 30px rgba(232, 93, 74, 0.08), 0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  scan: {
    scale: 1,
    boxShadow: '0 0 40px rgba(232, 93, 74, 0.12), 0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  identify: {
    scale: 1.02,
    boxShadow: '0 0 60px rgba(232, 93, 74, 0.2), 0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  open: {
    scale: 1,
    boxShadow: '0 0 20px rgba(232, 93, 74, 0.05), 0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  profile: {
    scale: 1,
    boxShadow: '0 0 0 rgba(232, 93, 74, 0), 0 20px 50px rgba(0, 0, 0, 0.4)',
  },
};

// Center panel in the tri-panel layout
export const centerPanelVariants: Variants = {
  closed: {
    x: 0,
  },
  open: {
    x: 0,
  },
};

// Left panel unfold
export const leftPanelVariants: Variants = {
  closed: {
    x: 0,
    rotateY: 0,
    opacity: 0,
    scale: 0.98,
  },
  open: {
    x: '-102%',
    rotateY: 5,
    opacity: 1,
    scale: 1,
    transition: leftPanelSpring,
  },
};

// Right panel unfold
export const rightPanelVariants: Variants = {
  closed: {
    x: 0,
    rotateY: 0,
    opacity: 0,
    scale: 0.98,
  },
  open: {
    x: '102%',
    rotateY: -5,
    opacity: 1,
    scale: 1,
    transition: rightPanelSpring,
  },
};

// Edge light pulse animation
export const edgeLightVariants: Variants = {
  idle: {
    opacity: 0,
  },
  power: {
    opacity: [0, 0.6, 0.3],
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
  scan: {
    opacity: 0.4,
  },
  identify: {
    opacity: [0.4, 1, 0.5],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  open: {
    opacity: 0.15,
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
    filter: 'brightness(1.1)',
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
    scale: [0, 1.5, 2],
    opacity: [0, 0.4, 0],
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
