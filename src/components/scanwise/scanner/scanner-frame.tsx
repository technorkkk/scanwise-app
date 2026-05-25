'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashlight, FlashlightOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scannerFrameVariants, scannerLineVariants, springBouncy } from '@/lib/animations';

interface ScannerFrameProps {
  onDetected?: () => void;
  isDetected?: boolean;
  className?: string;
}

export function ScannerFrame({
  onDetected,
  isDetected = false,
  className,
}: ScannerFrameProps) {
  const [torchOn, setTorchOn] = useState(false);

  const toggleTorch = () => setTorchOn((prev) => !prev);

  // Scan area dimensions relative to viewport
  const scanSize = 'w-64 h-64 sm:w-72 sm:h-72';

  return (
    <div className={cn('relative flex h-full w-full flex-col items-center justify-center', className)}>
      {/* Camera background placeholder */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Semi-transparent overlay with cutout */}
      <div className="absolute inset-0">
        {/* Top overlay */}
        <div className="absolute inset-x-0 top-0 h-[calc(50%-144px)] sm:h-[calc(50%-144px)] bg-black/50" />
        {/* Bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[calc(50%-144px)] sm:h-[calc(50%-144px)] bg-black/50" />
        {/* Left overlay */}
        <div className="absolute left-0 top-[calc(50%-144px)] h-72 w-[calc(50%-128px)] sm:h-80 sm:w-[calc(50%-144px)] bg-black/50" />
        {/* Right overlay */}
        <div className="absolute right-0 top-[calc(50%-144px)] h-72 w-[calc(50%-128px)] sm:h-80 sm:w-[calc(50%-144px)] bg-black/50" />
      </div>

      {/* Scan area frame */}
      <motion.div
        className={cn(
          'relative z-10',
          scanSize,
        )}
        variants={scannerFrameVariants}
        initial="initial"
        animate="animate"
      >
        {/* Corner brackets */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(
          (position, i) => {
            const isTop = i < 2;
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={i}
                className={cn('absolute h-8 w-8', position)}
                animate={
                  isDetected
                    ? { opacity: [1, 0.4, 1] }
                    : { opacity: [0.7, 1, 0.7] }
                }
                transition={{
                  duration: isDetected ? 0.5 : 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Horizontal bar */}
                <div
                  className={cn(
                    'absolute h-[3px] w-full rounded-full',
                    isTop ? 'top-0' : 'bottom-0',
                    isLeft ? 'left-0 origin-left' : 'right-0 origin-right',
                    isDetected
                      ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                      : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]',
                  )}
                />
                {/* Vertical bar */}
                <div
                  className={cn(
                    'absolute h-full w-[3px] rounded-full',
                    isTop ? 'top-0' : 'bottom-0',
                    isLeft ? 'left-0 origin-top' : 'right-0 origin-top',
                    isDetected
                      ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                      : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]',
                  )}
                />
              </motion.div>
            );
          },
        )}

        {/* Moving scan line */}
        {!isDetected && (
          <motion.div
            className="absolute inset-x-2 z-20 h-[2px]"
            variants={scannerLineVariants}
            animate="animate"
          >
            <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </motion.div>
        )}

        {/* Detection pulse effect */}
        {isDetected && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-green-400"
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: [1, 1.02, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Detection glow background */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-2xl',
            isDetected
              ? 'bg-green-500/10'
              : 'bg-transparent',
          )}
          animate={
            isDetected
              ? { backgroundColor: 'rgba(34,197,94,0.08)' }
              : {}
          }
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Torch toggle */}
      <motion.button
        onClick={toggleTorch}
        className={cn(
          'absolute bottom-8 z-20 flex h-12 w-12 items-center justify-center rounded-full',
          'bg-white/10 backdrop-blur-sm border border-white/20',
          'text-white transition-colors',
          'hover:bg-white/20',
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={springBouncy}
        aria-label={torchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
      >
        <motion.div
          key={torchOn ? 'on' : 'off'}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={springBouncy}
        >
          {torchOn ? (
            <Flashlight className="h-5 w-5 text-amber-300" />
          ) : (
            <FlashlightOff className="h-5 w-5 text-white/60" />
          )}
        </motion.div>
      </motion.button>

      {/* Status text */}
      <motion.p
        className="absolute bottom-24 z-20 text-sm text-white/70 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {isDetected ? 'Barcode detected!' : 'Point camera at barcode'}
      </motion.p>
    </div>
  );
}

export default ScannerFrame;
