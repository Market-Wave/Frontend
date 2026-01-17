'use client';

import { Car, MapPin, Calendar, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VehicleAd } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface VehicleCardProps {
  vehicle: VehicleAd;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <Card className={cn('hover:shadow-lg transition-shadow cursor-pointer', className)}>
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
          <Car className="w-16 h-16 text-gray-400" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{vehicle.title}</h3>
            <span className={cn(
              'px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ml-2',
              vehicle.status === 'ACTIVE' && 'bg-green-100 text-green-700',
              vehicle.status === 'SOLD' && 'bg-red-100 text-red-700',
              vehicle.status === 'PENDING' && 'bg-yellow-100 text-yellow-700'
            )}>
              {vehicle.status}
            </span>
          </div>
          
          {(vehicle.brand || vehicle.model) && (
            <p className="text-sm font-medium text-gray-700 mb-2">
              {vehicle.brand?.name} {vehicle.model?.name}
            </p>
          )}
          
          {(vehicle.bodyType || vehicle.category) && (
            <div className="flex items-center gap-2 mb-3">
              {vehicle.bodyType && (
                <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  {vehicle.bodyType.name}
                </span>
              )}
              {vehicle.category && (
                <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                  {vehicle.category.name}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {vehicle.year}
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              {vehicle.mileage.toLocaleString()} km
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            {vehicle.city}, {vehicle.country}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(vehicle.price, vehicle.currency)}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {vehicle.transmission} • {vehicle.fuelType}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
