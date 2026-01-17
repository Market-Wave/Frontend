import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, bodyTypesApi } from '../api';
import { toast } from 'sonner';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });
}

export function useBodyTypes() {
  return useQuery({
    queryKey: ['body-types'],
    queryFn: bodyTypesApi.getAll,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
}

export function useCreateBodyType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bodyTypesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-types'] });
      toast.success('Body type created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create body type');
    },
  });
}
