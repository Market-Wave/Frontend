import { apiClient } from './client';
import { Store } from '../types';

export const storesApi = {
  getAll: async (): Promise<Store[]> => {
    const { data } = await apiClient.get('/stores');
    return data;
  },

  getById: async (id: number): Promise<Store> => {
    const { data } = await apiClient.get(`/stores/${id}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Store> => {
    const { data } = await apiClient.get(`/stores/slug/${slug}`);
    return data;
  },

  getByOwner: async (ownerId: string): Promise<Store[]> => {
    const { data } = await apiClient.get(`/stores/owner/${ownerId}`);
    return data;
  },

  searchByName: async (query: string): Promise<Store[]> => {
    const { data } = await apiClient.get(`/stores/search`, {
      params: { name: query },
    });
    return data;
  },

  create: async (store: Omit<Store, 'id'>): Promise<Store> => {
    const { data } = await apiClient.post('/stores', store);
    return data;
  },

  update: async (id: number, store: Partial<Store>): Promise<Store> => {
    const { data } = await apiClient.put(`/stores/${id}`, store);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/stores/${id}`);
  },
};
