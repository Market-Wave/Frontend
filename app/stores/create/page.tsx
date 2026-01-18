'use client';

import { useRouter } from 'next/navigation';
import { StoreForm } from '@/components/store/store-form';
import { useCreateStore } from '@/lib/hooks/use-stores';
import { storesApi } from '@/lib/api';
import { MediaItem } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateStorePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useCreateStore();

  const handleSubmit = async (data: any, media: MediaItem[]) => {
    createMutation.mutate(data, {
      onSuccess: async (createdStore) => {
        // Upload media after store is created
        if (media.length > 0) {
          try {
            await Promise.all(
              media.map((item) =>
                storesApi.addMedia({
                  storeId: createdStore.id,
                  url: item.url,
                  mediaType: item.mediaType,
                  mediaView: item.mediaView,
                  sortOrder: item.sortOrder,
                })
              )
            );
            // Invalidate queries to refresh data
            await queryClient.invalidateQueries({ queryKey: ['store-media', createdStore.id] });
            await queryClient.invalidateQueries({ queryKey: ['store', createdStore.id] });
            toast.success('Store and media uploaded successfully!');
          } catch (error) {
            toast.error('Store created but some media failed to upload');
          }
        }
        // Invalidate all store queries
        await queryClient.invalidateQueries({ queryKey: ['stores'] });
        router.push('/stores');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/stores"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stores
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Store</CardTitle>
            <p className="text-gray-500 mt-1">
              Fill in the details below to register your dealership
            </p>
          </CardHeader>
          <CardContent>
            <StoreForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
