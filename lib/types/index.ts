export interface VehicleAd {
  id: number;
  ownerId: string;
  storeId?: number;
  title: string;
  description: string;
  brandId: number;
  modelId: number;
  bodyTypeId: number;
  categoryId: number;
  brand?: VehicleBrand;
  model?: VehicleModel;
  bodyType?: BodyType;
  category?: AdCategory;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  status: string;
  isBiddingEnabled?: boolean;
  isPreorderEnabled?: boolean;
}

export interface Store {
  id: number;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  status: string;
}

export interface VehicleBrand {
  id: number;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface VehicleModel {
  id: number;
  brandId: number;
  name: string;
  description?: string;
}

export interface BodyType {
  id: number;
  name: string;
  description?: string;
}

export interface AdCategory {
  id: number;
  name: string;
  description?: string;
}

export interface StoreMedia {
  id: number;
  storeId: number;
  mediaType: string;
  mediaUrl: string;
  displayOrder: number;
}

export interface VehicleMedia {
  id: number;
  vehicleAdId: number;
  mediaType: string;
  mediaUrl: string;
  displayOrder: number;
}

export interface StorePageConfig {
  id: number;
  storeId: number;
  bannerImageUrl?: string;
  logoUrl?: string;
  themeColor?: string;
  customCss?: string;
  aboutSection?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: string;
}

export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
