'use client';

import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ECO_SCORE_CONFIG } from '@/lib/constants';
import { scaleRevealVariants, springBouncy } from '@/lib/animations';

type EcoScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

interface EcoScoreBadgeProps {
  grade: EcoScoreGrade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'h-8 w-8 min-w-8',
    text: 'text-sm font-bold',
    icon: 'h-3 w-3',
    label: 'text-[10px]',
  },
  md: {
    container: 'h-12 w-12 min-w-12',
    text: 'text-lg font-bold',
    icon: 'h-4 w-4',
    label: 'text-xs',
  },
  lg: {
    container: 'h-16 w-16 min-w-16',
    text: 'text-2xl font-bold',
    icon: 'h-5 w-5',
    label: 'text-sm',
  },
} as const;

const gradeColors: Record<EcoScoreGrade, { bg: string; glow: string; text: string; ring: string }> = {
  A: {
    bg: 'bg-emerald-500 dark:bg-emerald-600',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)] dark:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    text: 'text-white',
    ring: 'ring-emerald-400/50',
  },
  B: {
    bg: 'bg-lime-500 dark:bg-lime-600',
    glow: 'shadow-[0_0_16px_rgba(132,204,22,0.4)] dark:shadow-[0_0_16px_rgba(132,204,22,0.25)]',
    text: 'text-white',
    ring: 'ring-lime-400/50',
  },
  C: {
    bg: 'bg-yellow-500 dark:bg-yellow-600',
    glow: '',
    text: 'text-white',
    ring: 'ring-yellow-400/50',
  },
  D: {
    bg: 'bg-orange-500 dark:bg-orange-600',
    glow: '',
    text: 'text-white',
    ring: 'ring-orange-400/50',
  },
  E: {
    bg: 'bg-red-500 dark:bg-red-600',
    glow: '',
    text: 'text-white',
    ring: 'ring-red-400/50',
  },
};

export function EcoScoreBadge({
  grade,
  size = 'md',
  showLabel = false,
  className,
}: EcoScoreBadgeProps) {
  const config = ECO_SCORE_CONFIG[grade];
  const sizeStyles = sizeConfig[size];
  const colors = gradeColors[grade];
  const isHighScore = grade === 'A' || grade === 'B';

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-1', className)}
      variants={scaleRevealVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl ring-2',
          sizeStyles.container,
          colors.bg,
          colors.text,
          colors.ring,
          isHighScore && colors.glow,
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={springBouncy}
      >
        <Leaf className={cn(sizeStyles.icon, 'opacity-80')} />
        <span className={cn(sizeStyles.text, 'font-display leading-none')}>
          {grade}
        </span>

        {/* Glow pulse for A grade */}
        {grade === 'A' && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-emerald-400/20"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {showLabel && (
        <motion.span
          className={cn(
            'font-medium text-muted-foreground',
            sizeStyles.label,
          )}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {config.label}
        </motion.span>
      )}
    </motion.div>
  );
}

export default EcoScoreBadge;
