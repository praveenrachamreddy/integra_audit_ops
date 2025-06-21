'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
          <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
      >
        <motion.div
          className="inline-block h-4 w-4 transform rounded-full bg-primary shadow-sm"
          animate={{
            x: isDark ? 24 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}