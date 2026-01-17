'use client';

import { useState } from 'react';
import { useModels, useBrands, useCreateModel } from '@/lib/hooks/use-brands';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Plus, Car } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function AdminModelsPage() {
  const { data: models = [], isLoading, error, refetch } = useModels();
  const { data: brands = [] } = useBrands();
  const createMutation = useCreateModel();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    createMutation.mutate(
      {
        ...data,
        brandId: Number(data.brandId),
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          reset();
        },
      }
    );
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
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vehicle Models</h1>
                <p className="text-gray-500 mt-1">
                  Manage {models.length} vehicle models
                </p>
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Model
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {models.length === 0 ? (
          <EmptyState
            title="No models found"
            description="Get started by creating your first vehicle model"
            action={
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Model
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {models.map((model) => {
              const brand = brands.find((b) => b.id === model.brandId);
              return (
                <Card key={model.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Car className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{model.name}</h3>
                        {brand && (
                          <p className="text-xs text-gray-500">{brand.name}</p>
                        )}
                      </div>
                    </div>
                    {model.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {model.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Model"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Brand *</Label>
            <Select {...register('brandId', { required: true })} className="mt-2">
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Model Name *</Label>
            <Input
              {...register('name', { required: true })}
              placeholder="e.g., Corolla"
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
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Model'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
