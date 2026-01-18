'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageUpload, MediaItem } from '@/components/ui/image-upload';
import { VehicleAd } from '@/lib/types';
import { useBrands, useModelsByBrand } from '@/lib/hooks/use-brands';
import { useCategories, useBodyTypes } from '@/lib/hooks/use-categories';
import { useState } from 'react';

const vehicleAdSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  brandId: z.string().min(1, 'Brand is required'),
  modelId: z.string().min(1, 'Model is required'),
  bodyTypeId: z.string().min(1, 'Body type is required'),
  categoryId: z.string().min(1, 'Category is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  condition: z.string().min(1, 'Condition is required'),
  price: z.number().min(0),
  currency: z.string(),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  status: z.string(),
});

type VehicleAdFormData = z.infer<typeof vehicleAdSchema>;

interface VehicleAdFormProps {
  initialData?: VehicleAd;
  onSubmit: (data: any, media: MediaItem[]) => void;
  isLoading?: boolean;
}

export function VehicleAdForm({ initialData, onSubmit, isLoading }: VehicleAdFormProps) {
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(
    initialData?.brandId || null
  );
  const [media, setMedia] = useState<MediaItem[]>(
    initialData?.media?.map((m) => ({
      id: m.id,
      url: m.url,
      mediaType: m.mediaType,
      mediaView: m.mediaView,
      sortOrder: m.sortOrder,
      isNew: false,
    })) || []
  );

  const vehicleMediaViews = [
    { value: 'EXTERIOR', label: 'Exterior' },
    { value: 'INTERIOR', label: 'Interior' },
    { value: 'DASHBOARD', label: 'Dashboard' },
    { value: 'ENGINE', label: 'Engine' },
    { value: 'TRUNK', label: 'Trunk' },
    { value: 'WHEELS', label: 'Wheels' },
  ];

  const { data: brands = [] } = useBrands();
  const { data: models = [] } = useModelsByBrand(selectedBrandId!);
  const { data: categories = [] } = useCategories();
  const { data: bodyTypes = [] } = useBodyTypes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VehicleAdFormData>({
    resolver: zodResolver(vehicleAdSchema),
    defaultValues: initialData ? {
      ...initialData,
      brandId: initialData.brandId.toString(),
      modelId: initialData.modelId.toString(),
      bodyTypeId: initialData.bodyTypeId.toString(),
      categoryId: initialData.categoryId.toString(),
    } : {
      currency: 'USD',
      status: 'ACTIVE',
    },
  });

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrandId(Number(e.target.value) || null);
  };

  const onFormSubmit = (data: VehicleAdFormData) => {
    onSubmit({
      ...data,
      brandId: Number(data.brandId),
      modelId: Number(data.modelId),
      bodyTypeId: Number(data.bodyTypeId),
      categoryId: Number(data.categoryId),
      ownerId: '550e8400-e29b-41d4-a716-446655440000', // Mock owner ID
    }, media);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label>Title *</Label>
          <Input
            {...register('title')}
            placeholder="e.g., 2020 Toyota Corolla XLE - Low Mileage"
            className="mt-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label>Description *</Label>
          <Textarea
            {...register('description')}
            placeholder="Describe your vehicle..."
            className="mt-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label>Brand *</Label>
          <Select
            {...register('brandId')}
            onChange={handleBrandChange}
            className="mt-2"
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          {errors.brandId && (
            <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>
          )}
        </div>

        <div>
          <Label>Model *</Label>
          <Select
            {...register('modelId')}
            disabled={!selectedBrandId}
            className="mt-2"
          >
            <option value="">Select a model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </Select>
          {errors.modelId && (
            <p className="text-red-500 text-sm mt-1">{errors.modelId.message}</p>
          )}
        </div>

        <div>
          <Label>Body Type *</Label>
          <Select {...register('bodyTypeId')} className="mt-2">
            <option value="">Select a body type</option>
            {bodyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Select>
          {errors.bodyTypeId && (
            <p className="text-red-500 text-sm mt-1">{errors.bodyTypeId.message}</p>
          )}
        </div>

        <div>
          <Label>Category *</Label>
          <Select {...register('categoryId')} className="mt-2">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <Label>Year *</Label>
          <Input
            type="number"
            {...register('year', { valueAsNumber: true })}
            placeholder="2020"
            className="mt-2"
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <Label>Mileage (km) *</Label>
          <Input
            type="number"
            {...register('mileage', { valueAsNumber: true })}
            placeholder="50000"
            className="mt-2"
          />
          {errors.mileage && (
            <p className="text-red-500 text-sm mt-1">{errors.mileage.message}</p>
          )}
        </div>

        <div>
          <Label>Fuel Type *</Label>
          <Select {...register('fuelType')} className="mt-2">
            <option value="">Select fuel type</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
          {errors.fuelType && (
            <p className="text-red-500 text-sm mt-1">{errors.fuelType.message}</p>
          )}
        </div>

        <div>
          <Label>Transmission *</Label>
          <Select {...register('transmission')} className="mt-2">
            <option value="">Select transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </Select>
          {errors.transmission && (
            <p className="text-red-500 text-sm mt-1">{errors.transmission.message}</p>
          )}
        </div>

        <div>
          <Label>Condition *</Label>
          <Select {...register('condition')} className="mt-2">
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Certified Pre-Owned">Certified Pre-Owned</option>
          </Select>
          {errors.condition && (
            <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
          )}
        </div>

        <div>
          <Label>Price *</Label>
          <Input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="25000"
            className="mt-2"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label>Country *</Label>
          <Input
            {...register('country')}
            placeholder="USA"
            className="mt-2"
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>

        <div>
          <Label>City *</Label>
          <Input
            {...register('city')}
            placeholder="New York"
            className="mt-2"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label>Address</Label>
          <Input
            {...register('address')}
            placeholder="123 Main St"
            className="mt-2"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <ImageUpload
          value={media}
          onChange={setMedia}
          mediaViews={vehicleMediaViews}
          maxFiles={10}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Ad' : 'Create Ad'}
        </Button>
      </div>
    </form>
  );
}
