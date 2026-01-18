import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storesApi } from '../api';
import { Store } from '../types';
import { toast } from 'sonner';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: storesApi.getAll,
  });
}

export function useStore(id: number) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => storesApi.getById(id),
    enabled: !!id,
  });
}

export function useStoreMedia(storeId: number) {
  return useQuery({
    queryKey: ['store-media', storeId],
    queryFn: () => storesApi.getMediaForStore(storeId),
    enabled: !!storeId,
  });
}

export function useStoreBySlug(slug: string) {
  return useQuery({
    queryKey: ['store', 'slug', slug],
    queryFn: () => storesApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useStoresByOwner(ownerId: string) {
  return useQuery({
    queryKey: ['stores', 'owner', ownerId],
    queryFn: () => storesApi.getByOwner(ownerId),
    enabled: !!ownerId,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create store');
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Store> }) =>
      storesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.id] });
      toast.success('Store updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update store');
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete store');
    },
  });
}
