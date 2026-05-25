'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INGREDIENT_SAFETY } from '@/lib/constants';
import { springSnappy } from '@/lib/animations';

type IngredientSafetyLevel = 'safe' | 'caution' | 'avoid';

interface IngredientChipProps {
  name: string;
  safety: IngredientSafetyLevel;
  icon?: LucideIcon;
  className?: string;
}

const safetyConfig: Record<IngredientSafetyLevel, { dot: string; hover: string }> = {
  safe: {
    dot: 'bg-emerald-500',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
  },
  caution: {
    dot: 'bg-amber-500',
    hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
  },
  avoid: {
    dot: 'bg-rose-500',
    hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/40',
  },
};

export function IngredientChip({
  name,
  safety,
  icon: Icon,
  className,
}: IngredientChipProps) {
  const safetyStyles = INGREDIENT_SAFETY[safety];
  const dotConfig = safetyConfig[safety];

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        safetyStyles.color,
        safetyStyles.border,
        safetyStyles.text,
        dotConfig.hover,
        className,
      )}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springSnappy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Safety dot indicator */}
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full flex-shrink-0',
          dotConfig.dot,
        )}
      />

      {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />}

      <span className="truncate">{name}</span>
    </motion.span>
  );
}

export default IngredientChip;
