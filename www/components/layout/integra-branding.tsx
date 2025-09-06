'use client';

import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface IntegraBrandingProps extends ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg';
}

export function IntegraBranding({ 
  size = 'md', 
  className, 
  ...props 
}: IntegraBrandingProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div 
      className={cn(
        'font-bold flex items-center gap-2',
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      <div className="bg-blue-600 text-white p-1 rounded">
        <span className="font-bold">I</span>
      </div>
      <span>ntegra<span className="text-blue-600">Ops</span></span>
    </div>
  );
}