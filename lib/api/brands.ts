import { apiClient } from './client';
import { VehicleBrand, VehicleModel } from '../types';

export const brandsApi = {
  getAll: async (): Promise<VehicleBrand[]> => {
    const { data } = await apiClient.get('/vehicle-brands');
    return data;
  },

  getById: async (id: number): Promise<VehicleBrand> => {
    const { data } = await apiClient.get(`/vehicle-brands/${id}`);
    return data;
  },

  create: async (brand: Omit<VehicleBrand, 'id'>): Promise<VehicleBrand> => {
    const { data } = await apiClient.post('/vehicle-brands', brand);
    return data;
  },

  update: async (id: number, brand: Partial<VehicleBrand>): Promise<VehicleBrand> => {
    const { data } = await apiClient.put(`/vehicle-brands/${id}`, brand);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicle-brands/${id}`);
  },
};

export const modelsApi = {
  getAll: async (): Promise<VehicleModel[]> => {
    const { data } = await apiClient.get('/vehicle-models');
    return data;
  },

  getById: async (id: number): Promise<VehicleModel> => {
    const { data } = await apiClient.get(`/vehicle-models/${id}`);
    return data;
  },

  getByBrand: async (brandId: number): Promise<VehicleModel[]> => {
    const { data } = await apiClient.get(`/vehicle-models/brand/${brandId}`);
    return data;
  },

  create: async (model: Omit<VehicleModel, 'id'>): Promise<VehicleModel> => {
    const { data } = await apiClient.post('/vehicle-models', model);
    return data;
  },

  update: async (id: number, model: Partial<VehicleModel>): Promise<VehicleModel> => {
    const { data } = await apiClient.put(`/vehicle-models/${id}`, model);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicle-models/${id}`);
  },
};
