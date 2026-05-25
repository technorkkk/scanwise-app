'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  cursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  cursor = true,
  className,
  onComplete,
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const lines = Array.isArray(text) ? text : [text];
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset and start typing when text changes
  useEffect(() => {
    setCurrentLine(0);
    setCurrentChar(0);
    setCompletedLines([]);
    setIsComplete(false);
    clearTimer();

    if (prefersReducedMotion) {
      setCompletedLines(lines.map((_, i) => i));
      setCurrentLine(lines.length);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let lineIdx = 0;
    let charIdx = 0;
    let cancelled = false;

    const delayTimer = setTimeout(() => {
      function tick() {
        if (cancelled) return;

        if (lineIdx >= lines.length) {
          setIsComplete(true);
          onComplete?.();
          return;
        }

        const lineText = lines[lineIdx];

        if (charIdx < lineText.length) {
          charIdx++;
          setCurrentChar(charIdx);
          timerRef.current = setTimeout(tick, speed);
        } else {
          // Line finished
          setCompletedLines((prev) => [...prev, lineIdx]);
          lineIdx++;
          charIdx = 0;
          setCurrentLine(lineIdx);
          setCurrentChar(0);
          timerRef.current = setTimeout(tick, speed * 5);
        }
      }

      tick();
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
      clearTimer();
    };
  }, [text, speed, delay, prefersReducedMotion, lines, onComplete, clearTimer]);

  return (
    <div className={cn('font-sans leading-relaxed', className)}>
      {lines.map((line, lineIndex) => {
        const isCompleted = completedLines.includes(lineIndex);
        const isCurrentLine = lineIndex === currentLine && !isComplete;
        const isFutureLine = lineIndex > currentLine;

        if (isFutureLine) return null;

        return (
          <motion.div
            key={lineIndex}
            className="min-h-[1.5em]"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {isCompleted ? (
              <span>{line}</span>
            ) : isCurrentLine ? (
              <span>
                {line.slice(0, currentChar)}
                {cursor && !isComplete && (
                  <motion.span
                    className="inline-block w-[2px] translate-y-[2px] bg-emerald-500 dark:bg-emerald-400"
                    style={{ height: '1em' }}
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </span>
            ) : null}
          </motion.div>
        );
      })}

      {/* Cursor after all text is complete */}
      <AnimatePresence>
        {isComplete && cursor && (
          <motion.span
            className="inline-block w-[2px] translate-y-[2px] bg-emerald-500 dark:bg-emerald-400"
            style={{ height: '1em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default TypewriterText;
