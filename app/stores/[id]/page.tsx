'use client';

import { use } from 'react';
import { useStore, useDeleteStore } from '@/lib/hooks/use-stores';
import { useVehicleAdsByStore } from '@/lib/hooks/use-vehicle-ads';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleCard } from '@/components/vehicle/vehicle-card';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Store,
  MapPin,
  Edit,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: store, isLoading, error, refetch } = useStore(Number(id));
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicleAdsByStore(
    Number(id)
  );
  const deleteMutation = useDeleteStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => {
        router.push('/stores');
      },
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error || !store) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/stores"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="aspect-[3/1] bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl flex items-center justify-center">
                <Store className="w-24 h-24 text-blue-500" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
                    <p className="text-sm text-gray-500">@{store.slug}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      store.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {store.status}
                  </span>
                </div>

                {store.description && (
                  <p className="text-gray-600 mb-6">{store.description}</p>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">
                        {store.city}, {store.country}
                      </p>
                      {store.address && (
                        <p className="text-gray-500 text-xs mt-1">{store.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Inventory</CardTitle>
                <p className="text-gray-500 text-sm mt-1">
                  {vehicles.length} vehicles listed
                </p>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <LoadingPage />
                ) : vehicles.length === 0 ? (
                  <EmptyState
                    title="No vehicles listed"
                    description="This store hasn't listed any vehicles yet"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Store Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Store Page
                  </Button>
                  <Link href={`/stores/${id}/edit`} className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Store
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    size="lg"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Store
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
        title="Delete Store"
      >
        <p className="mb-6">
          Are you sure you want to delete this store? This action cannot be undone.
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
