import { apiClient } from './client';
import { VehicleAd } from '../types';

export const vehicleAdsApi = {
  getAll: async (): Promise<VehicleAd[]> => {
    const { data } = await apiClient.get('/vehicle-ads');
    return data;
  },

  getById: async (id: number): Promise<VehicleAd> => {
    const { data } = await apiClient.get(`/vehicle-ads/${id}`);
    return data;
  },

  getByOwner: async (ownerId: string): Promise<VehicleAd[]> => {
    const { data } = await apiClient.get(`/vehicle-ads/owner/${ownerId}`);
    return data;
  },

  getByStore: async (storeId: number): Promise<VehicleAd[]> => {
    const { data } = await apiClient.get(`/vehicle-ads/store/${storeId}`);
    return data;
  },

  searchByTitle: async (query: string): Promise<VehicleAd[]> => {
    const { data } = await apiClient.get(`/vehicle-ads/search`, {
      params: { title: query },
    });
    return data;
  },

  filterByPrice: async (minPrice: number, maxPrice: number): Promise<VehicleAd[]> => {
    const { data } = await apiClient.get(`/vehicle-ads/filter/price`, {
      params: { minPrice, maxPrice },
    });
    return data;
  },

  create: async (vehicleAd: Omit<VehicleAd, 'id'>): Promise<VehicleAd> => {
    const { data } = await apiClient.post('/vehicle-ads', vehicleAd);
    return data;
  },

  update: async (id: number, vehicleAd: Partial<VehicleAd>): Promise<VehicleAd> => {
    const { data } = await apiClient.put(`/vehicle-ads/${id}`, vehicleAd);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicle-ads/${id}`);
  },
};
