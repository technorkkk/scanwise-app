'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HEALTH_SCORE } from '@/lib/constants';
import { springBouncy, springGentle } from '@/lib/animations';

interface HealthScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { svgSize: 64, strokeWidth: 5, textSize: 'text-lg', labelSize: 'text-[10px]' },
  md: { svgSize: 100, strokeWidth: 7, textSize: 'text-3xl', labelSize: 'text-xs' },
  lg: { svgSize: 140, strokeWidth: 9, textSize: 'text-4xl', labelSize: 'text-sm' },
} as const;

function getScoreColor(score: number): { stroke: string; label: string; bg: string } {
  if (score >= HEALTH_SCORE.excellent.min) {
    return { stroke: '#22c55e', label: HEALTH_SCORE.excellent.label, bg: 'text-emerald-500' };
  }
  if (score >= HEALTH_SCORE.good.min) {
    return { stroke: '#84cc16', label: HEALTH_SCORE.good.label, bg: 'text-lime-500' };
  }
  if (score >= HEALTH_SCORE.average.min) {
    return { stroke: '#eab308', label: HEALTH_SCORE.average.label, bg: 'text-yellow-500' };
  }
  if (score >= HEALTH_SCORE.poor.min) {
    return { stroke: '#f97316', label: HEALTH_SCORE.poor.label, bg: 'text-orange-500' };
  }
  return { stroke: '#ef4444', label: HEALTH_SCORE.bad.label, bg: 'text-red-500' };
}

export function HealthScoreRing({
  score,
  size = 'md',
  showLabel = false,
  className,
}: HealthScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = sizeConfig[size];
  const { stroke, label, bg } = getScoreColor(score);

  // SVG circle calculations
  const radius = (config.svgSize - config.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = config.svgSize / 2;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const strokeDashoffset = circumference * (1 - progress);

  // Animate counter
  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const startVal = 0;
    const endVal = Math.round(score);

    function tick() {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(startVal + (endVal - startVal) * eased));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-1', className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springGentle}
    >
      <div className="relative" style={{ width: config.svgSize, height: config.svgSize }}>
        <svg
          width={config.svgSize}
          height={config.svgSize}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted/30"
          />
          {/* Progress arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ ...springBouncy, delay: 0.2 }}
          />
          {/* Glow filter */}
          <defs>
            <filter id={`glow-${size}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {score >= 80 && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth={config.strokeWidth + 4}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              filter={`url(#glow-${size})`}
              className="opacity-30"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ ...springBouncy, delay: 0.2 }}
            />
          )}
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn('font-display font-bold tabular-nums', config.textSize, bg)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {displayScore}
          </motion.span>
        </div>
      </div>

      {showLabel && (
        <motion.span
          className={cn('font-medium text-muted-foreground', config.labelSize)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}

export default HealthScoreRing;
