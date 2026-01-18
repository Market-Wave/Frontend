'use client';

import { useRouter, useParams } from 'next/navigation';
import { VehicleAdForm } from '@/components/vehicle/vehicle-ad-form';
import { useVehicleAd, useUpdateVehicleAd, useVehicleMedia } from '@/lib/hooks/use-vehicle-ads';
import { vehicleAdsApi } from '@/lib/api';
import { MediaItem } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function EditVehicleAdPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const adId = Number(params.id);
  
  const { data: vehicleAd, isLoading, error } = useVehicleAd(adId);
  const { data: existingMedia = [] } = useVehicleMedia(adId);
  const updateMutation = useUpdateVehicleAd();

  // Combine vehicle data with media
  const vehicleWithMedia = useMemo(() => {
    if (!vehicleAd) return null;
    return {
      ...vehicleAd,
      media: existingMedia,
    };
  }, [vehicleAd, existingMedia]);

  const handleSubmit = async (data: any, media: MediaItem[]) => {
    updateMutation.mutate(
      { id: adId, data },
      {
        onSuccess: async () => {
          // Handle media updates
          try {
            const existingIds = existingMedia.map((m) => m.id);
            const currentIds = media.filter((m) => m.id).map((m) => m.id!);
            
            // Delete removed media
            const toDelete = existingIds.filter((id) => !currentIds.includes(id));
            await Promise.all(toDelete.map((id) => vehicleAdsApi.deleteMedia(id)));

            // Add new media
            const newMedia = media.filter((m) => m.isNew);
            await Promise.all(
              newMedia.map((item) =>
                vehicleAdsApi.addMedia({
                  adId,
                  url: item.url,
                  mediaType: item.mediaType,
                  mediaView: item.mediaView,
                  sortOrder: item.sortOrder,
                })
              )
            );
            
            toast.success('Vehicle ad updated successfully!');
          } catch (error) {
            toast.error('Ad updated but some media changes failed');
          }
          // Invalidate queries to refresh data
          await queryClient.invalidateQueries({ queryKey: ['vehicle-media', adId] });
          await queryClient.invalidateQueries({ queryKey: ['vehicle-ad', adId] });
          await queryClient.invalidateQueries({ queryKey: ['vehicle-ads'] });
          router.push(`/vehicles/${adId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !vehicleWithMedia) {
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
              initialData={vehicleWithMedia}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
