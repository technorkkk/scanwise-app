'use client';

import { motion } from 'framer-motion';
import { Heart, Clock, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUpVariants, springSnappy } from '@/lib/animations';
import type { LucideIcon } from 'lucide-react';

type EmptyStateVariant = 'favorites' | 'history' | 'search' | 'error';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: LucideIcon;
    defaultTitle: string;
    defaultDescription: string;
    svgPath: string;
  }
> = {
  favorites: {
    icon: Heart,
    defaultTitle: 'No favorites yet',
    defaultDescription: 'Products you love will appear here. Scan a barcode to start building your collection.',
    svgPath:
      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  history: {
    icon: Clock,
    defaultTitle: 'No scan history',
    defaultDescription: 'Your scanned products will show up here. Start scanning to track your food choices.',
    svgPath:
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3',
  },
  search: {
    icon: Search,
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your search or scan a different barcode.',
    svgPath:
      'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 0v4m0 4h4m8 8l-4-4',
  },
  error: {
    icon: AlertCircle,
    defaultTitle: 'Something went wrong',
    defaultDescription: 'We couldn\'t process your request. Please try again.',
    svgPath:
      'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01',
  },
};

export function EmptyState({
  variant = 'search',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const displayTitle = title ?? config.defaultTitle;
  const displayDescription = description ?? config.defaultDescription;

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
    >
      {/* Illustration */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springSnappy, delay: 0.1 }}
      >
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-muted/50">
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-muted-foreground/50"
          >
            <path d={config.svgPath} />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        className="mb-2 text-lg font-semibold font-display text-foreground"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="mb-6 max-w-xs text-sm text-muted-foreground leading-relaxed"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {displayDescription}
      </motion.p>

      {/* Action button */}
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-5 py-2.5',
            'bg-emerald-500 text-white font-medium text-sm',
            'hover:bg-emerald-600 active:bg-emerald-700',
            'transition-colors shadow-md shadow-emerald-500/20',
          )}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

export default EmptyState;
