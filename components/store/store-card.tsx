'use client';

import { Store, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Store as StoreType } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface StoreCardProps {
  store: StoreType;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  return (
    <Link href={`/stores/${store.id}`}>
      <Card className={cn('hover:shadow-lg transition-shadow cursor-pointer h-full', className)}>
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl flex items-center justify-center">
          <Store className="w-16 h-16 text-blue-500" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{store.name}</h3>
            <span
              className={cn(
                'px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ml-2',
                store.status === 'ACTIVE' && 'bg-green-100 text-green-700',
                store.status === 'INACTIVE' && 'bg-gray-100 text-gray-700'
              )}
            >
              {store.status}
            </span>
          </div>

          {store.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{store.description}</p>
          )}

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            {store.city}, {store.country}
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center text-sm text-blue-600 hover:text-blue-700">
              <span>View Store</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
