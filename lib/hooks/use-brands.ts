import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi, modelsApi } from '../api';
import { toast } from 'sonner';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.getAll,
  });
}

export function useBrand(id: number) {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandsApi.getById(id),
    enabled: !!id,
  });
}

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: modelsApi.getAll,
  });
}

export function useModel(id: number) {
  return useQuery({
    queryKey: ['model', id],
    queryFn: () => modelsApi.getById(id),
    enabled: !!id,
  });
}

export function useModelsByBrand(brandId: number | undefined) {
  return useQuery({
    queryKey: ['models', 'brand', brandId],
    queryFn: () => modelsApi.getByBrand(brandId!),
    enabled: !!brandId,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create brand');
    },
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modelsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Model created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create model');
    },
  });
}
