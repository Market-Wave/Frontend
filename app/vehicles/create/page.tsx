'use client';

import { useRouter } from 'next/navigation';
import { VehicleAdForm } from '@/components/vehicle/vehicle-ad-form';
import { useCreateVehicleAd } from '@/lib/hooks/use-vehicle-ads';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateVehicleAdPage() {
  const router = useRouter();
  const createMutation = useCreateVehicleAd();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/vehicles');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/vehicles"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vehicles
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Post a Vehicle Ad</CardTitle>
            <p className="text-gray-500 mt-1">
              Fill in the details below to list your vehicle
            </p>
          </CardHeader>
          <CardContent>
            <VehicleAdForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
