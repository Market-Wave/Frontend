'use client';

import { use } from 'react';
import { useVehicleAd, useDeleteVehicleAd } from '@/lib/hooks/use-vehicle-ads';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';
import {
  ArrowLeft,
  Car,
  Calendar,
  Gauge,
  MapPin,
  Fuel,
  Settings,
  DollarSign,
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: vehicle, isLoading, error, refetch } = useVehicleAd(Number(id));
  const deleteMutation = useDeleteVehicleAd();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => {
        router.push('/vehicles');
      },
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error || !vehicle) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/vehicles"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
                <Car className="w-32 h-32 text-gray-400" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold">{vehicle.title}</h1>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      vehicle.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : vehicle.status === 'SOLD'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{vehicle.description}</p>

                {(vehicle.brand || vehicle.model || vehicle.bodyType || vehicle.category) && (
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-blue-50 rounded-lg">
                    {vehicle.brand && (
                      <div>
                        <p className="text-xs text-gray-500">Brand</p>
                        <p className="font-semibold text-blue-900">{vehicle.brand.name}</p>
                      </div>
                    )}
                    {vehicle.model && (
                      <div>
                        <p className="text-xs text-gray-500">Model</p>
                        <p className="font-semibold text-blue-900">{vehicle.model.name}</p>
                      </div>
                    )}
                    {vehicle.bodyType && (
                      <div>
                        <p className="text-xs text-gray-500">Body Type</p>
                        <p className="font-semibold text-blue-900">{vehicle.bodyType.name}</p>
                      </div>
                    )}
                    {vehicle.category && (
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-semibold text-blue-900">{vehicle.category.name}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Year</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="font-semibold">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Fuel className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Fuel Type</p>
                      <p className="font-semibold">{vehicle.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Transmission</p>
                      <p className="font-semibold">{vehicle.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Condition</p>
                      <p className="font-semibold">{vehicle.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold">{vehicle.city}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">Price</span>
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  {formatCurrency(vehicle.price, vehicle.currency)}
                </p>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">
                      {vehicle.city}, {vehicle.country}
                    </span>
                  </div>
                  {vehicle.address && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium">{vehicle.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Contact Seller
                  </Button>
                  <Link href={`/vehicles/${id}/edit`} className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Ad
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    size="lg"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Ad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Vehicle Ad"
      >
        <p className="mb-6">
          Are you sure you want to delete this ad? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
