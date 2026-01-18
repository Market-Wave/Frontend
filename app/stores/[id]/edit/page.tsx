'use client';

import { useRouter, useParams } from 'next/navigation';
import { StoreForm } from '@/components/store/store-form';
import { useStore, useUpdateStore, useStoreMedia } from '@/lib/hooks/use-stores';
import { storesApi } from '@/lib/api';
import { MediaItem } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function EditStorePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const storeId = Number(params.id);
  
  const { data: store, isLoading, error } = useStore(storeId);
  const { data: existingMedia = [] } = useStoreMedia(storeId);
  const updateMutation = useUpdateStore();

  // Combine store data with media
  const storeWithMedia = useMemo(() => {
    if (!store) return null;
    return {
      ...store,
      media: existingMedia,
    };
  }, [store, existingMedia]);

  const handleSubmit = async (data: any, media: MediaItem[]) => {
    updateMutation.mutate(
      { id: storeId, data },
      {
        onSuccess: async () => {
          // Handle media updates
          try {
            const existingIds = existingMedia.map((m) => m.id);
            const currentIds = media.filter((m) => m.id).map((m) => m.id!);
            
            // Delete removed media
            const toDelete = existingIds.filter((id) => !currentIds.includes(id));
            await Promise.all(toDelete.map((id) => storesApi.deleteMedia(id)));

            // Add new media
            const newMedia = media.filter((m) => m.isNew);
            await Promise.all(
              newMedia.map((item) =>
                storesApi.addMedia({
                  storeId,
                  url: item.url,
                  mediaType: item.mediaType,
                  mediaView: item.mediaView,
                  sortOrder: item.sortOrder,
                })
              )
            );
            
            toast.success('Store updated successfully!');
          } catch (error) {
            toast.error('Store updated but some media changes failed');
          }
          // Invalidate queries to refresh data
          await queryClient.invalidateQueries({ queryKey: ['store-media', storeId] });
          await queryClient.invalidateQueries({ queryKey: ['store', storeId] });
          await queryClient.invalidateQueries({ queryKey: ['stores'] });
          router.push(`/stores/${storeId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !storeWithMedia) {
    return (
      <ErrorState
        title="Store Not Found"
        message="The store you're trying to edit could not be found."
        actionLabel="Back to Stores"
        onAction={() => router.push('/stores')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/stores/${storeId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Store</CardTitle>
            <p className="text-gray-500 mt-1">
              Update your dealership information
            </p>
          </CardHeader>
          <CardContent>
            <StoreForm
              initialData={storeWithMedia}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
