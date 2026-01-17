import { apiClient } from './client';
import { AdCategory, BodyType } from '../types';

export const categoriesApi = {
  getAll: async (): Promise<AdCategory[]> => {
    const { data } = await apiClient.get('/ad-categories');
    return data;
  },

  getById: async (id: number): Promise<AdCategory> => {
    const { data } = await apiClient.get(`/ad-categories/${id}`);
    return data;
  },

  create: async (category: Omit<AdCategory, 'id'>): Promise<AdCategory> => {
    const { data } = await apiClient.post('/ad-categories', category);
    return data;
  },

  update: async (id: number, category: Partial<AdCategory>): Promise<AdCategory> => {
    const { data } = await apiClient.put(`/ad-categories/${id}`, category);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ad-categories/${id}`);
  },
};

export const bodyTypesApi = {
  getAll: async (): Promise<BodyType[]> => {
    const { data } = await apiClient.get('/body-types');
    return data;
  },

  getById: async (id: number): Promise<BodyType> => {
    const { data } = await apiClient.get(`/body-types/${id}`);
    return data;
  },

  create: async (bodyType: Omit<BodyType, 'id'>): Promise<BodyType> => {
    const { data } = await apiClient.post('/body-types', bodyType);
    return data;
  },

  update: async (id: number, bodyType: Partial<BodyType>): Promise<BodyType> => {
    const { data } = await apiClient.put(`/body-types/${id}`, bodyType);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/body-types/${id}`);
  },
};
