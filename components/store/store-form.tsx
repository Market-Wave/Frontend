'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Store } from '@/lib/types';

const storeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type StoreFormData = z.infer<typeof storeSchema>;

interface StoreFormProps {
  initialData?: Store;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function StoreForm({ initialData, onSubmit, isLoading }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description,
      country: initialData.country,
      city: initialData.city,
      address: initialData.address,
      status: initialData.status as 'ACTIVE' | 'INACTIVE',
    } : {
      status: 'ACTIVE' as const,
    },
  });

  const name = watch('name');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setValue('slug', slug);
  };

  const onFormSubmit = (data: StoreFormData) => {
    onSubmit({
      ...data,
      ownerId: '550e8400-e29b-41d4-a716-446655440000', // Mock owner ID
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label>Store Name *</Label>
          <Input
            {...register('name')}
            onChange={(e) => {
              register('name').onChange(e);
              handleNameChange(e);
            }}
            placeholder="e.g., Premium Auto Sales"
            className="mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label>Slug *</Label>
          <Input
            {...register('slug')}
            placeholder="premium-auto-sales"
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be used in your store URL
          </p>
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea
            {...register('description')}
            placeholder="Describe your store..."
            className="mt-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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

        <div>
          <Label>Status *</Label>
          <Select {...register('status')} className="mt-2">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Store' : 'Create Store'}
        </Button>
      </div>
    </form>
  );
}
