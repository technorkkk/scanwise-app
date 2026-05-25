import type { Variants, Transition } from 'framer-motion';

// ─── Spring Physics ────────────────────────────────────────
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 18,
  mass: 0.9,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 20,
  mass: 1,
};

export const springSlow: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1.2,
};

// ─── Page Transitions ──────────────────────────────────────
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    filter: 'blur(2px)',
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Fade Up ───────────────────────────────────────────────
export const fadeUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

// ─── Fade In ───────────────────────────────────────────────
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─── Scale Reveal (Score Badges) ───────────────────────────
export const scaleRevealVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
    rotate: -15,
  },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: springBouncy,
  },
};

// ─── Stagger Container ─────────────────────────────────────
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnappy,
  },
};

// ─── Card Hover ────────────────────────────────────────────
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    transition: springSnappy,
  },
  hover: {
    y: -4,
    scale: 1.01,
    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
    transition: springSnappy,
  },
};

// ─── Button Tap ────────────────────────────────────────────
export const buttonTapVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.15 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// ─── Scanner Frame ─────────────────────────────────────────
export const scannerFrameVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springBouncy,
  },
};

export const scannerLineVariants: Variants = {
  animate: {
    y: [0, 200, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ─── Slide In from Bottom (Mobile Sheets) ──────────────────
export const slideUpVariants: Variants = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

// ─── Slide In from Right ──────────────────────────────────
export const slideRightVariants: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// ─── Heart/Favorite Animation ──────────────────────────────
export const heartVariants: Variants = {
  unmoved: {
    scale: 1,
    transition: springSnappy,
  },
  liked: {
    scale: [1, 1.3, 0.9, 1.1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.3, 0.5, 0.7, 1],
    },
  },
};

// ─── Number Counter ────────────────────────────────────────
export const counterVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springBouncy,
  },
};

// ─── Shimmer/Skeleton ──────────────────────────────────────
export const shimmerVariants: Variants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ─── Toast / Notification ──────────────────────────────────
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: -20,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springBouncy,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// ─── Modal / Dialog ────────────────────────────────────────
export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const dialogVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springSnappy,
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 10,
    transition: { duration: 0.15 },
  },
};

// ─── Parallax ──────────────────────────────────────────────
export const parallaxVariants = (scrollY: number) => ({
  y: scrollY * 0.3,
  scale: 1 + scrollY * 0.0005,
});

// ─── Rotate Reveal ─────────────────────────────────────────
export const rotateRevealVariants: Variants = {
  initial: {
    rotateX: -90,
    opacity: 0,
  },
  animate: {
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Reduced Motion Variants ───────────────────────────────
export const reducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};
