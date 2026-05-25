'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shimmerVariants } from '@/lib/animations';

// ─── Base Shimmer Block ──────────────────────────────────────
function ShimmerBlock({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('shimmer rounded-lg', className)}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    />
  );
}

// ─── Product Card Skeleton ───────────────────────────────────
interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-4 space-y-3',
        className,
      )}
    >
      {/* Image placeholder */}
      <ShimmerBlock className="h-36 w-full rounded-xl" />
      {/* Title */}
      <ShimmerBlock className="h-5 w-3/4" />
      {/* Brand */}
      <ShimmerBlock className="h-4 w-1/2" />
      {/* Score badges row */}
      <div className="flex gap-2">
        <ShimmerBlock className="h-8 w-8 rounded-lg" />
        <ShimmerBlock className="h-8 w-8 rounded-lg" />
        <ShimmerBlock className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Score Badge Skeleton ────────────────────────────────────
interface ScoreBadgeSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeSizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function ScoreBadgeSkeleton({
  size = 'md',
  className,
}: ScoreBadgeSkeletonProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <ShimmerBlock className={cn('rounded-2xl', badgeSizeMap[size])} />
      {size !== 'sm' && <ShimmerBlock className="h-3 w-10" />}
    </div>
  );
}

// ─── Nutrition Table Skeleton ────────────────────────────────
interface NutritionTableSkeletonProps {
  rows?: number;
  className?: string;
}

export function NutritionTableSkeleton({
  rows = 6,
  className,
}: NutritionTableSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex justify-between">
        <ShimmerBlock className="h-4 w-24" />
        <ShimmerBlock className="h-4 w-16" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <ShimmerBlock className="h-3.5 flex-1" style={{ maxWidth: `${60 + Math.random() * 30}%` }} />
          <ShimmerBlock className="h-3.5 w-12" />
        </div>
      ))}
    </div>
  );
}

// ─── AI Summary Skeleton ────────────────────────────────────
interface AISummarySkeletonProps {
  lines?: number;
  className?: string;
}

export function AISummarySkeleton({
  lines = 4,
  className,
}: AISummarySkeletonProps) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {/* Title bar */}
      <ShimmerBlock className="h-5 w-32" />
      {/* Text lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBlock
          key={i}
          className="h-3.5"
          style={{
            width: i === lines - 1 ? '55%' : `${75 + Math.random() * 20}%`,
          }}
        />
      ))}
    </div>
  );
}

export { ShimmerBlock };
export default ProductCardSkeleton;
