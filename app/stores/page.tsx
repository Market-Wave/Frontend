'use client';

import { useState } from 'react';
import { useStores } from '@/lib/hooks/use-stores';
import { StoreCard } from '@/components/store/store-card';
import { SearchInput } from '@/components/ui/search-input';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Store } from 'lucide-react';
import { Store as StoreType } from '@/lib/types';
import { useQueries } from '@tanstack/react-query';
import { storesApi } from '@/lib/api';

export default function StoresPage() {
  const { data: stores = [], isLoading, error, refetch } = useStores();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch media for all stores
  const mediaQueries = useQueries({
    queries: stores.map((store) => ({
      queryKey: ['store-media', store.id],
      queryFn: () => storesApi.getMediaForStore(store.id),
      enabled: !!store.id,
    })),
  });

  // Combine stores with their media
  const storesWithMedia: StoreType[] = stores.map((store, index) => ({
    ...store,
    media: mediaQueries[index]?.data || [],
  }));

  const filteredStores = storesWithMedia.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dealerships</h1>
                <p className="text-gray-500 mt-1">
                  Browse {stores.length} registered dealerships
                </p>
              </div>
            </div>
            <Link href="/stores/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </Link>
          </div>
          <SearchInput
            placeholder="Search stores..."
            onSearch={setSearchQuery}
            className="max-w-2xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredStores.length === 0 ? (
          <EmptyState
            title="No stores found"
            description="Try adjusting your search or create a new store"
            action={
              <Link href="/stores/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Store
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
