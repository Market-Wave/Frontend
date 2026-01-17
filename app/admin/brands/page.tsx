'use client';

import { useState } from 'react';
import { useBrands, useCreateBrand } from '@/lib/hooks/use-brands';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Plus, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function AdminBrandsPage() {
  const { data: brands = [], isLoading, error, refetch } = useBrands();
  const createMutation = useCreateBrand();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateModal(false);
        reset();
      },
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Tag className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vehicle Brands</h1>
                <p className="text-gray-500 mt-1">
                  Manage {brands.length} vehicle brands
                </p>
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {brands.length === 0 ? (
          <EmptyState
            title="No brands found"
            description="Get started by creating your first vehicle brand"
            action={
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Brand
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Tag className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{brand.name}</h3>
                  </div>
                  {brand.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Brand"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Brand Name *</Label>
            <Input
              {...register('name', { required: true })}
              placeholder="e.g., Toyota"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              {...register('description')}
              placeholder="Brief description"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input
              {...register('logoUrl')}
              placeholder="https://example.com/logo.png"
              className="mt-2"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
