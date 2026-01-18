'use client';

import { useState, useEffect } from 'react';
import { useVehicleAds, useVehicleMedia } from '@/lib/hooks/use-vehicle-ads';
import { VehicleCard } from '@/components/vehicle/vehicle-card';
import { VehicleFilters } from '@/components/vehicle/vehicle-filters';
import { SearchInput } from '@/components/ui/search-input';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { VehicleAd } from '@/lib/types';
import { useQueries } from '@tanstack/react-query';
import { vehicleAdsApi } from '@/lib/api';

export default function VehiclesPage() {
  const { data: vehicles = [], isLoading, error, refetch } = useVehicleAds();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  // Fetch media for all vehicles
  const mediaQueries = useQueries({
    queries: vehicles.map((vehicle) => ({
      queryKey: ['vehicle-media', vehicle.id],
      queryFn: () => vehicleAdsApi.getMediaForAd(vehicle.id),
      enabled: !!vehicle.id,
    })),
  });

  // Combine vehicles with their media
  const vehiclesWithMedia: VehicleAd[] = vehicles.map((vehicle, index) => ({
    ...vehicle,
    media: mediaQueries[index]?.data || [],
  }));

  const filteredVehicles = vehiclesWithMedia.filter((vehicle) => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      (!filters.minPrice || vehicle.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || vehicle.price <= Number(filters.maxPrice));
    const matchesYear = !filters.year || vehicle.year === Number(filters.year);
    const matchesBrand = !filters.brandId || vehicle.brandId === Number(filters.brandId);
    const matchesModel = !filters.modelId || vehicle.modelId === Number(filters.modelId);
    const matchesBodyType = !filters.bodyTypeId || vehicle.bodyTypeId === Number(filters.bodyTypeId);
    const matchesCategory = !filters.categoryId || vehicle.categoryId === Number(filters.categoryId);
    const matchesFuel = !filters.fuelType || vehicle.fuelType === filters.fuelType;
    const matchesTransmission =
      !filters.transmission || vehicle.transmission === filters.transmission;
    const matchesCondition = !filters.condition || vehicle.condition === filters.condition;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesYear &&
      matchesBrand &&
      matchesModel &&
      matchesBodyType &&
      matchesCategory &&
      matchesFuel &&
      matchesTransmission &&
      matchesCondition
    );
  });

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Vehicle Marketplace</h1>
              <p className="text-gray-500 mt-1">
                Browse {vehicles.length} available vehicles
              </p>
            </div>
            <Link href="/vehicles/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Ad
              </Button>
            </Link>
          </div>
          <SearchInput
            placeholder="Search by title..."
            onSearch={setSearchQuery}
            className="max-w-2xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <VehicleFilters onFilterChange={setFilters} />
          </aside>

          <main className="lg:col-span-3">
            {filteredVehicles.length === 0 ? (
              <EmptyState
                title="No vehicles found"
                description="Try adjusting your search or filters"
                action={
                  <Link href="/vehicles/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your Ad
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
