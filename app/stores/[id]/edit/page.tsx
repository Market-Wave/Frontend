'use client';

import { useRouter, useParams } from 'next/navigation';
import { StoreForm } from '@/components/store/store-form';
import { useStore, useUpdateStore } from '@/lib/hooks/use-stores';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = Number(params.id);
  
  const { data: store, isLoading, error } = useStore(storeId);
  const updateMutation = useUpdateStore();

  const handleSubmit = (data: any) => {
    updateMutation.mutate(
      { id: storeId, data },
      {
        onSuccess: () => {
          router.push(`/stores/${storeId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !store) {
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
              initialData={store}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
