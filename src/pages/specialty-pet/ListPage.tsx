/**
 * Specialty Pet List Page
 * 
 * Full product listing page for specialty pet products marketplace
 */

import React, { useEffect, useState } from 'react';
import { SpecialtyPetLayout } from '@/components/layouts/specialty-pet';
import { SubdomainInfo, Product } from '@/types';

interface SpecialtyPetListPageProps {
  subdomainInfo: SubdomainInfo;
}

const SpecialtyPetListPage: React.FC<SpecialtyPetListPageProps> = ({ subdomainInfo }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Apply simplified city filtering pattern
      // Use empty string for non-city paths like "Products", "All Cities", etc.
      const cityToUse = (subdomainInfo.city === 'All Cities' || subdomainInfo.city === 'Products') ? '' : subdomainInfo.city;
      
      // Build API URL
      const params = new URLSearchParams({
        category: 'specialty-pet'
      });
      
      // Only add city parameter if we have a specific city
      if (cityToUse && cityToUse.trim() !== '') {
        params.append('city', cityToUse);
      }
      
      if (selectedCategory) {
        params.append('product_category', selectedCategory);
      }
      
      let response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      let data = await response.json();
      
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load specialty pet products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // TODO: Reset search results
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    searchQuery === '' || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique product categories for filtering
  const productCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  if (loading) {
    return (
      <SpecialtyPetLayout 
        subdomainInfo={subdomainInfo}
        showSearchBar={true}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading specialty pet products...</p>
          </div>
        </div>
      </SpecialtyPetLayout>
    );
  }

  if (error) {
    return (
      <SpecialtyPetLayout 
        subdomainInfo={subdomainInfo}
        showSearchBar={true}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={loadProducts}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </SpecialtyPetLayout>
    );
  }

  return (
    <SpecialtyPetLayout 
      subdomainInfo={subdomainInfo}
      showSearchBar={true}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      currentSearchQuery={searchQuery}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        {productCategories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {productCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category || '')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedCategory === category 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {subdomainInfo.city && !subdomainInfo.city.includes('All')
              ? `Specialty Pet Products in ${subdomainInfo.city}, ${subdomainInfo.state}`
              : 'Specialty Pet Products'
            }
          </h2>
          <p className="text-gray-600">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Product Listings */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No specialty pet products match "${searchQuery}" in this area.`
                : 'No specialty pet products are currently listed in this area.'
              }
            </p>
            {(searchQuery || selectedCategory) && (
              <button 
                onClick={() => {
                  handleClearSearch();
                  setSelectedCategory('');
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {product.images && (
                  <div className="w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={product.images} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  
                  {product.category && (
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full capitalize">
                      {product.category}
                    </span>
                  )}
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm">
                      {product.description}
                    </p>
                  )}
                  
                  {product.price && (
                    <p className="text-xl font-bold text-emerald-600">
                      ${product.price}
                    </p>
                  )}
                  
                  {product.vendor && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm text-gray-500">Sold by:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {product.vendor.name}
                      </p>
                      {product.vendor.website && (
                        <a 
                          href={product.vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 text-sm inline-block mt-1"
                        >
                          Visit Store →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SpecialtyPetLayout>
  );
};

export default SpecialtyPetListPage;
