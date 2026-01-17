'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function Loading({ size = 'md', className, text }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizes[size])} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}
