'use client';

import { useRouter, useParams } from 'next/navigation';
import { VehicleAdForm } from '@/components/vehicle/vehicle-ad-form';
import { useVehicleAd, useUpdateVehicleAd } from '@/lib/hooks/use-vehicle-ads';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';

export default function EditVehicleAdPage() {
  const router = useRouter();
  const params = useParams();
  const adId = Number(params.id);
  
  const { data: vehicleAd, isLoading, error } = useVehicleAd(adId);
  const updateMutation = useUpdateVehicleAd();

  const handleSubmit = (data: any) => {
    updateMutation.mutate(
      { id: adId, data },
      {
        onSuccess: () => {
          router.push(`/vehicles/${adId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !vehicleAd) {
    return (
      <ErrorState
        title="Vehicle Ad Not Found"
        message="The vehicle ad you're trying to edit could not be found."
        actionLabel="Back to Vehicles"
        onAction={() => router.push('/vehicles')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/vehicles/${adId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ad
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Vehicle Ad</CardTitle>
            <p className="text-gray-500 mt-1">
              Update your vehicle listing information
            </p>
          </CardHeader>
          <CardContent>
            <VehicleAdForm
              initialData={vehicleAd}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
