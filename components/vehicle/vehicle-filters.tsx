'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useBrands, useModelsByBrand } from '@/lib/hooks/use-brands';
import { useBodyTypes, useCategories } from '@/lib/hooks/use-categories';

interface VehicleFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function VehicleFilters({ onFilterChange }: VehicleFiltersProps) {
  const { data: brands = [] } = useBrands();
  const { data: bodyTypes = [] } = useBodyTypes();
  const { data: categories = [] } = useCategories();
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    year: '',
    brandId: '',
    modelId: '',
    bodyTypeId: '',
    categoryId: '',
    fuelType: '',
    transmission: '',
    condition: '',
  });
  
  const { data: models = [] } = useModelsByBrand(filters.brandId ? Number(filters.brandId) : undefined);

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: '',
      maxPrice: '',
      year: '',
      brandId: '',
      modelId: '',
      bodyTypeId: '',
      categoryId: '',
      fuelType: '',
      transmission: '',
      condition: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Brand</Label>
          <Select
            value={filters.brandId}
            onChange={(e) => {
              const newBrandId = e.target.value;
              const newFilters = { 
                ...filters, 
                brandId: newBrandId,
                modelId: '' // Reset model when brand changes
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="mt-2"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Model</Label>
          <Select
            value={filters.modelId}
            onChange={(e) => handleChange('modelId', e.target.value)}
            className="mt-2"
            disabled={!filters.brandId}
          >
            <option value="">All Models</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Body Type</Label>
          <Select
            value={filters.bodyTypeId}
            onChange={(e) => handleChange('bodyTypeId', e.target.value)}
            className="mt-2"
          >
            <option value="">All Body Types</option>
            {bodyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Select
            value={filters.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="mt-2"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Year</Label>
          <Input
            type="number"
            placeholder="e.g., 2020"
            value={filters.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Fuel Type</Label>
          <Select
            value={filters.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="mt-2"
          >
            <option value="">All</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
        </div>

        <div>
          <Label>Transmission</Label>
          <Select
            value={filters.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="mt-2"
          >
            <option value="">All</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </Select>
        </div>

        <div>
          <Label>Condition</Label>
          <Select
            value={filters.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="mt-2"
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Certified Pre-Owned">Certified Pre-Owned</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
