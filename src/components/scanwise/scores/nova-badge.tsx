'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NOVA_GROUP_CONFIG } from '@/lib/constants';
import { scaleRevealVariants, springBouncy } from '@/lib/animations';

type NovaGroup = 1 | 2 | 3 | 4;

interface NovaBadgeProps {
  group: NovaGroup;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'h-7 min-w-7 px-2',
    number: 'text-xs font-bold',
    label: 'text-[10px]',
  },
  md: {
    container: 'h-9 min-w-9 px-3',
    number: 'text-base font-bold',
    label: 'text-xs',
  },
  lg: {
    container: 'h-11 min-w-11 px-4',
    number: 'text-lg font-bold',
    label: 'text-sm',
  },
} as const;

const groupColors: Record<NovaGroup, { bg: string; text: string; border: string }> = {
  1: {
    bg: 'bg-emerald-500 dark:bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-400/30',
  },
  2: {
    bg: 'bg-lime-500 dark:bg-lime-600',
    text: 'text-white',
    border: 'border-lime-400/30',
  },
  3: {
    bg: 'bg-yellow-500 dark:bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-400/30',
  },
  4: {
    bg: 'bg-red-500 dark:bg-red-600',
    text: 'text-white',
    border: 'border-red-400/30',
  },
};

export function NovaBadge({
  group,
  size = 'md',
  showLabel = false,
  className,
}: NovaBadgeProps) {
  const config = NOVA_GROUP_CONFIG[group];
  const sizeStyles = sizeConfig[size];
  const colors = groupColors[group];

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-1', className)}
      variants={scaleRevealVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-full border',
          sizeStyles.container,
          colors.bg,
          colors.text,
          colors.border,
        )}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={springBouncy}
      >
        <span className={cn(sizeStyles.number, 'font-display')}>
          {group}
        </span>
      </motion.div>

      {showLabel && (
        <motion.span
          className={cn('font-medium text-muted-foreground', sizeStyles.label)}
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

export default NovaBadge;
