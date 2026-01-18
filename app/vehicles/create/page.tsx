'use client';

import { useRouter } from 'next/navigation';
import { VehicleAdForm } from '@/components/vehicle/vehicle-ad-form';
import { useCreateVehicleAd } from '@/lib/hooks/use-vehicle-ads';
import { vehicleAdsApi } from '@/lib/api';
import { MediaItem } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateVehicleAdPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useCreateVehicleAd();

  const handleSubmit = async (data: any, media: MediaItem[]) => {
    createMutation.mutate(data, {
      onSuccess: async (createdAd) => {
        // Upload media after ad is created
        if (media.length > 0) {
          try {
            await Promise.all(
              media.map((item) =>
                vehicleAdsApi.addMedia({
                  adId: createdAd.id,
                  url: item.url,
                  mediaType: item.mediaType,
                  mediaView: item.mediaView,
                  sortOrder: item.sortOrder,
                })
              )
            );
            // Invalidate queries to refresh data
            await queryClient.invalidateQueries({ queryKey: ['vehicle-media', createdAd.id] });
            await queryClient.invalidateQueries({ queryKey: ['vehicle-ad', createdAd.id] });
            toast.success('Vehicle ad and media uploaded successfully!');
          } catch (error) {
            toast.error('Ad created but some media failed to upload');
          }
        }
        // Invalidate all vehicle queries
        await queryClient.invalidateQueries({ queryKey: ['vehicle-ads'] });
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
