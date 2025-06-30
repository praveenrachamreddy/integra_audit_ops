'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  text = 'Loading...', 
  className,
  showText = true 
}: LoadingProps) {
  const baseClasses = sizeClasses[size];
  const textClasses = textSizeClasses[size];

  const renderSpinner = () => (
    <div className={cn(
      'border-4 border-primary/20 border-t-primary rounded-full animate-spin',
      baseClasses,
      className
    )} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'bg-primary rounded-full',
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <motion.div
      className={cn(
        'bg-primary rounded-full',
        baseClasses,
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );

  const renderBars = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'bg-primary',
            size === 'sm' ? 'w-1' : size === 'md' ? 'w-2' : size === 'lg' ? 'w-3' : 'w-4'
          )}
          style={{
            height: size === 'sm' ? '8px' : size === 'md' ? '16px' : size === 'lg' ? '24px' : '32px'
          }}
          animate={{
            scaleY: [1, 2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {renderLoader()}
      {showText && text && (
        <p className={cn('text-muted-foreground font-medium', textClasses)}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full screen loading component
export function FullScreenLoading({ 
  text = 'Loading...', 
  variant = 'spinner',
  size = 'lg'
}: Omit<LoadingProps, 'className'>) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Loading variant={variant} size={size} showText={false} />
          {variant === 'spinner' && (
            <div className={cn(
              'absolute inset-0 border-2 border-primary/10 rounded-full animate-ping',
              sizeClasses[size]
            )} />
          )}
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{text}</h3>
          <p className="text-sm text-muted-foreground">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard specific loading with branding
export function DashboardLoading({ text = 'Loading Dashboard' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-primary/10 rounded-full animate-ping"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{text}</h3>
          <p className="text-sm text-muted-foreground">Preparing your regulatory command center...</p>
        </div>
      </div>
    </div>
  );
} 