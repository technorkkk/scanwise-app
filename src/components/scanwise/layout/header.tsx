'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/animations';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onLanguageToggle?: () => void;
  locale?: 'en' | 'hi';
  className?: string;
}

export function Header({
  title,
  showBack = false,
  onBack,
  onLanguageToggle,
  locale = 'en',
  className,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-40 glass-strong safe-top',
        className,
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {showBack && (
            <motion.button
              onClick={onBack}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl',
                'bg-secondary/50 text-foreground transition-colors',
                'hover:bg-secondary',
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={springSnappy}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          )}

          {title ? (
            <motion.h1
              className="text-lg font-semibold font-display"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {title}
            </motion.h1>
          ) : (
            <div className="flex items-center gap-2">
              {/* Logo */}
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={springSnappy}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-white"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </motion.div>
              <motion.span
                className="text-xl font-bold font-display gradient-text"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                ScanWise
              </motion.span>
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Language toggle */}
          <motion.button
            onClick={onLanguageToggle}
            className={cn(
              'flex h-9 items-center gap-1 rounded-xl px-2.5',
              'bg-secondary/50 text-foreground transition-colors',
              'hover:bg-secondary',
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={springSnappy}
            aria-label={`Switch language, current: ${locale === 'en' ? 'English' : 'हिन्दी'}`}
          >
            <Globe className="h-4 w-4 opacity-70" />
            <span className="text-xs font-medium">
              {locale === 'en' ? 'EN' : 'हि'}
            </span>
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl',
              'bg-secondary/50 text-foreground transition-colors',
              'hover:bg-secondary',
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={springSnappy}
            aria-label={`Toggle theme, current: ${theme}`}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={springSnappy}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
