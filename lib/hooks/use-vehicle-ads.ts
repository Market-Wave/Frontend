import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleAdsApi } from '../api';
import { VehicleAd } from '../types';
import { toast } from 'sonner';

export function useVehicleAds() {
  return useQuery({
    queryKey: ['vehicle-ads'],
    queryFn: vehicleAdsApi.getAll,
  });
}

export function useVehicleAd(id: number) {
  return useQuery({
    queryKey: ['vehicle-ad', id],
    queryFn: () => vehicleAdsApi.getById(id),
    enabled: !!id,
  });
}

export function useVehicleMedia(adId: number) {
  return useQuery({
    queryKey: ['vehicle-media', adId],
    queryFn: () => vehicleAdsApi.getMediaForAd(adId),
    enabled: !!adId,
  });
}

export function useVehicleAdsByOwner(ownerId: string) {
  return useQuery({
    queryKey: ['vehicle-ads', 'owner', ownerId],
    queryFn: () => vehicleAdsApi.getByOwner(ownerId),
    enabled: !!ownerId,
  });
}

export function useVehicleAdsByStore(storeId: number) {
  return useQuery({
    queryKey: ['vehicle-ads', 'store', storeId],
    queryFn: () => vehicleAdsApi.getByStore(storeId),
    enabled: !!storeId,
  });
}

export function useCreateVehicleAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleAdsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-ads'] });
      toast.success('Vehicle ad created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create vehicle ad');
    },
  });
}

export function useUpdateVehicleAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VehicleAd> }) =>
      vehicleAdsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-ads'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-ad', variables.id] });
      toast.success('Vehicle ad updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update vehicle ad');
    },
  });
}

export function useDeleteVehicleAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleAdsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-ads'] });
      toast.success('Vehicle ad deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle ad');
    },
  });
}
