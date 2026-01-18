'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  onRetry,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      <div className="flex gap-2">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
        {onAction && actionLabel && (
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
