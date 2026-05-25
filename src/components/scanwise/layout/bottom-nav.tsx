'use client';

import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, ScanLine, Search, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/animations';

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  href: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'search', label: 'Search', icon: Search, href: '/search' },
  { id: 'scan', label: 'Scan', icon: ScanLine, href: '/scan', isCenter: true },
  { id: 'favorites', label: 'Favorites', icon: Heart, href: '/favorites' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

interface BottomNavProps {
  activeId?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export function BottomNav({
  activeId = 'home',
  onNavigate,
  className,
}: BottomNavProps) {
  const pathname = usePathname();

  const handleNavigate = (href: string) => {
    onNavigate?.(href);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 glass-strong safe-bottom',
        className,
      )}
    >
      <LayoutGroup>
        <div className="flex items-end justify-around px-2 pt-1 pb-1">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.href)}
                  className="relative -mt-5 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  transition={springSnappy}
                >
                  <motion.div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-full shadow-lg',
                      'bg-emerald-500 dark:bg-emerald-600',
                      'ring-4 ring-background',
                    )}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              '0 0 0 0 rgba(34,197,94,0.4)',
                              '0 0 0 8px rgba(34,197,94,0)',
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <span className="sr-only">{item.label}</span>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1.5',
                  'transition-colors rounded-xl min-w-[56px]',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground',
                )}
                whileTap={{ scale: 0.92 }}
                transition={springSnappy}
              >
                {isActive && (
                  <motion.div
                    className="absolute -top-0.5 h-0.5 w-6 rounded-full bg-emerald-500"
                    layoutId="bottomNavIndicator"
                    transition={springSnappy}
                  />
                )}
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
}

export default BottomNav;
