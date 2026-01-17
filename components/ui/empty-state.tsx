'use client';

import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <Package className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6 max-w-md">{description}</p>}
      {action}
    </div>
  );
}
