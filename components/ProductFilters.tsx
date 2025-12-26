"use client";

import { useState } from 'react';
import { getColorHex, isLightColor } from '@/lib/colors';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterProps {
  categories: string[];
  colors: string[];
  collections: string[];
  onFilterChange: (filters: {
    category: string;
    color: string;
    gender: string;
    size: string;
    minPrice: string;
    maxPrice: string;
    collection: string;
  }) => void;
  hideCollectionFilter?: boolean;
  hideCategoryFilter?: boolean; 
}

const sizes = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function ProductFilters({ 
  categories, 
  colors, 
  collections, 
  onFilterChange,
  hideCategoryFilter = false,
  hideCollectionFilter = false
}: FilterProps) {
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    gender: '',
    size: '',
    collection: '',
    minPrice: '',
    maxPrice: ''
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      color: '',
      gender: '',
      size: '',
      collection: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.color) count++;
    if (filters.gender) count++;
    if (filters.size) count++;
    if (filters.collection) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    return count;
  };

  return (
    <>
      {/* Bouton mobile pour ouvrir les filtres */}
      <Button
        variant="outline"
        className="lg:hidden mb-4 w-full"
        onClick={() => setIsMobileFiltersOpen(true)}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {getActiveFiltersCount() > 0 && (
          <span className="ml-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {getActiveFiltersCount()}
          </span>
        )}
      </Button>

      {/* Overlay mobile */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterContent
              categories={categories}
              colors={colors}
              collections={collections}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              hideCollectionFilter={hideCollectionFilter} // CHANGÉ ICI
            />
          </div>
        </div>
      )}

      {/* Filtres desktop */}
      <div className="hidden lg:block bg-white p-6 rounded-lg border shadow-sm h-fit sticky top-6">
        <FilterContent
          categories={categories}
          colors={colors}
          collections={collections}
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          hideCollectionFilter={hideCollectionFilter} // CHANGÉ ICI
        />
      </div>
    </>
  );
}

// Composant de contenu des filtres réutilisable pour mobile et desktop
function FilterContent({
  categories,
  colors,
  collections,
  filters,
  handleFilterChange,
  clearFilters,
  hideCollectionFilter // CHANGÉ ICI
}: {
  categories: string[];
  colors: string[];
  collections: string[];
  filters: any;
  handleFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
  hideCollectionFilter: boolean; // CHANGÉ ICI
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm rgb(52_58_64_/_95%) hover:text-amber-700 flex items-center"
        >
          <X className="h-3 w-3 mr-1" />
          Clear all
        </button>
      </div>

      <div className="space-y-8">
        {/* Filtre par genre */}
        <div>
          <h4 className="font-medium mb-4 text-gray-900">Gender</h4>
          <div className="space-y-3">
            {['boy', 'girl', 'unisex'].map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={filters.gender === gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm capitalize text-gray-700">
                  {gender === 'boy' ? 'Boys' : gender === 'girl' ? 'Girls' : 'Unisexe'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtre par collection - MASQUÉ quand hideCollectionFilter est true */}
        {!hideCollectionFilter && collections.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Collection</h4>
            <select
              value={filters.collection}
              onChange={(e) => handleFilterChange('collection', e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="">All collections</option>
              {collections.map(collection => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtre par catégorie - TOUJOURS VISIBLE maintenant */}
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Category</h4>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtre par couleur */}
        {colors.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Colour</h4>
            <div className="space-y-2">
              {colors.map(color => {
                const colorHex = getColorHex(color);
                const isLight = isLightColor(colorHex);
                const borderColor = isLight ? '#D1D5DB' : 'transparent';
                
                return (
                  <label key={color} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={filters.color === color}
                      onChange={(e) => handleFilterChange('color', e.target.value)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 shadow-sm"
                      style={{ 
                        backgroundColor: colorHex,
                        borderColor: borderColor
                      }}
                      title={color}
                    />
                    <span className="text-sm text-gray-700 capitalize">{color}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtre par taille */}
        <div>
          <h4 className="font-medium mb-4 text-gray-900">Size</h4>
          <select
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            className="w-full border rounded-md px-3 py-2.5 text-sm border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>
                Size {size}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par prix */}
        <div>
          <h4 className="font-medium mb-4 text-gray-900">Price (AED)</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton pour effacer tous les filtres - visible seulement s'il y a des filtres actifs */}
      {(filters.category || filters.color || filters.gender || filters.size || filters.collection || filters.minPrice || filters.maxPrice) && (
        <div className="mt-8 pt-6 border-t">
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );
}