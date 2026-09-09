import type { Variants } from 'framer-motion';

// Scanner rotating ring
export const scannerRingVariants: Variants = {
  idle: {
    rotate: 0,
    opacity: 0,
  },
  scanning: {
    rotate: 360,
    opacity: 1,
    transition: {
      rotate: {
        duration: 4,
        ease: 'linear',
        repeat: Infinity,
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
  locked: {
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 30,
    },
  },
};

// Scan line sweep
export const scanLineVariants: Variants = {
  idle: {
    y: '-100%',
    opacity: 0,
  },
  scanning: {
    y: ['0%', '100%'],
    opacity: [0, 0.6, 0.6, 0],
    transition: {
      y: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
      opacity: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
  locked: {
    y: '50%',
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// QR code appearance
export const qrVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

// Status text cycling
export const statusTextVariants: Variants = {
  enter: {
    opacity: 0,
    y: 8,
    filter: 'blur(2px)',
  },
  visible: {
    opacity: 0.7,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: {
      duration: 0.2,
    },
  },
};

// Scanner particle response
export const scanParticleVariants: Variants = {
  idle: {
    opacity: 0.1,
    scale: 1,
  },
  active: {
    opacity: [0.1, 0.4, 0.1],
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
