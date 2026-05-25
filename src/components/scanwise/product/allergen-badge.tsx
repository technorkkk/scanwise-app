'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALLERGEN_LEVELS } from '@/lib/constants';
import { scaleRevealVariants, springBouncy } from '@/lib/animations';

type AllergenLevel = 'contains' | 'may_contain' | 'free';

interface AllergenBadgeProps {
  name: string;
  level: AllergenLevel;
  className?: string;
}

const levelIcons: Record<AllergenLevel, typeof AlertTriangle> = {
  contains: AlertTriangle,
  may_contain: HelpCircle,
  free: ShieldCheck,
};

const levelStyles: Record<AllergenLevel, { bg: string; text: string; border: string; pulse: boolean }> = {
  contains: {
    bg: 'bg-rose-500 dark:bg-rose-600',
    text: 'text-rose-50',
    border: 'border-rose-400/30',
    pulse: true,
  },
  may_contain: {
    bg: 'bg-amber-500 dark:bg-amber-600',
    text: 'text-amber-50',
    border: 'border-amber-400/30',
    pulse: false,
  },
  free: {
    bg: 'bg-emerald-500 dark:bg-emerald-600',
    text: 'text-emerald-50',
    border: 'border-emerald-400/30',
    pulse: false,
  },
};

export function AllergenBadge({
  name,
  level,
  className,
}: AllergenBadgeProps) {
  const config = ALLERGEN_LEVELS[level];
  const Icon = levelIcons[level];
  const styles = levelStyles[level];

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center gap-2 rounded-lg border px-3 py-1.5',
        styles.bg,
        styles.text,
        styles.border,
        className,
      )}
      variants={scaleRevealVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={springBouncy}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
          {config.label}
        </span>
        <span className="text-sm font-medium">{name}</span>
      </div>

      {/* Pulse animation for "Contains" level */}
      {styles.pulse && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-rose-400/30"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}

export default AllergenBadge;
