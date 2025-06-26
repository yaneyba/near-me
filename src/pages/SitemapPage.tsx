import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  MapPin, 
  Building, 
  FileText, 
  ExternalLink, 
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Home,
  Info,
  Phone,
  Plus,
  Shield,
  Scale
} from 'lucide-react';
import businessesData from '../data/businesses.json';
import { Business } from '../types';

interface SitemapCategory {
  name: string;
  slug: string;
  count: number;
}

interface SitemapCity {
  name: string;
  slug: string;
  state: string;
  count: number;
}

interface SitemapCombination {
  category: string;
  categorySlug: string;
  city: string;
  citySlug: string;
  state: string;
  businessCount: number;
  url: string;
}

const SitemapPage: React.FC = () => {
  const [businesses] = useState<Business[]>(businessesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    document.title = 'Sitemap - Near Me Directory';
  }, []);

  // City-state mapping
  const cityStateMap: Record<string, string> = {
    'dallas': 'Texas',
    'garland': 'Texas',
    'denver': 'Colorado',
    'austin': 'Texas',
    'houston': 'Texas',
    'frisco': 'Texas',
    'phoenix': 'Arizona',
    'chicago': 'Illinois',
    'atlanta': 'Georgia',
    'miami': 'Florida',
    'seattle': 'Washington',
    'portland': 'Oregon'
  };

  // Helper functions
  const formatForDisplay = (text: string): string => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatForUrl = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  // Get unique categories
  const getCategories = (): SitemapCategory[] => {
    const categoryMap = new Map<string, number>();
    
    businesses.forEach(business => {
      const count = categoryMap.get(business.category) || 0;
      categoryMap.set(business.category, count + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([slug, count]) => ({
        name: formatForDisplay(slug),
        slug,
        count
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get unique cities
  const getCities = (): SitemapCity[] => {
    const cityMap = new Map<string, number>();
    
    businesses.forEach(business => {
      const count = cityMap.get(business.city) || 0;
      cityMap.set(business.city, count + 1);
    });

    return Array.from(cityMap.entries())
      .map(([slug, count]) => ({
        name: formatForDisplay(slug),
        slug,
        state: cityStateMap[slug] || 'Unknown',
        count
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get all category-city combinations
  const getCombinations = (): SitemapCombination[] => {
    const combinationMap = new Map<string, SitemapCombination>();
    
    businesses.forEach(business => {
      const key = `${business.category}-${business.city}`;
      const existing = combinationMap.get(key);
      
      if (existing) {
        existing.businessCount++;
      } else {
        const categoryName = formatForDisplay(business.category);
        const cityName = formatForDisplay(business.city);
        const state = cityStateMap[business.city] || 'Unknown';
        
        combinationMap.set(key, {
          category: categoryName,
          categorySlug: business.category,
          city: cityName,
          citySlug: business.city,
          state,
          businessCount: 1,
          url: `https://${business.category}.${business.city}.near-me.us`
        });
      }
    });

    return Array.from(combinationMap.values())
      .sort((a, b) => a.category.localeCompare(b.category) || a.city.localeCompare(b.city));
  };

  const categories = getCategories();
  const cities = getCities();
  const combinations = getCombinations();

  // Filter combinations based on search and filters
  const filteredCombinations = combinations.filter(combo => {
    const matchesSearch = searchQuery === '' || 
      combo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || combo.categorySlug === selectedCategory;
    const matchesState = selectedState === 'all' || combo.state === selectedState;
    
    return matchesSearch && matchesCategory && matchesState;
  });

  // Get unique states for filter
  const states = Array.from(new Set(combinations.map(c => c.state))).sort();

  // Statistics
  const totalBusinesses = businesses.length;
  const totalCombinations = combinations.length;
  const totalCategories = categories.length;
  const totalCities = cities.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
            <p className="text-lg text-gray-600 mb-6">
              Explore all available pages and business directories across our platform
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{totalBusinesses}</div>
                <div className="text-sm text-blue-800">Total Businesses</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{totalCategories}</div>
                <div className="text-sm text-green-800">Categories</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{totalCities}</div>
                <div className="text-sm text-purple-800">Cities</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{totalCombinations}</div>
                <div className="text-sm text-orange-800">Directories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Pages */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Home className="w-6 h-6 mr-3 text-blue-600" />
            Main Pages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Home className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-900">Home</div>
                <div className="text-sm text-gray-500">Main directory page</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
            </Link>

            <Link
              to="/about"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Info className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-900">About</div>
                <div className="text-sm text-gray-500">Learn about our platform</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
            </Link>

            <Link
              to="/contact"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Phone className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-900">Contact</div>
                <div className="text-sm text-gray-500">Get in touch with us</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
            </Link>

            <Link
              to="/add-business"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-900">Add Business</div>
                <div className="text-sm text-gray-500">List your business</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
            </Link>

            <Link
              to="/privacy-policy"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Shield className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-900">Privacy Policy</div>
                <div className="text-sm text-gray-500">Data protection info</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
            </Link>

            <Link
              to="/terms-of-service"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Scale className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-900">Terms of Service</div>
                <div className="text-sm text-gray-500">Usage terms & conditions</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Building className="w-6 h-6 mr-3 text-blue-600" />
            Business Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.count} businesses</div>
                  </div>
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cities Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-blue-600" />
            Cities & Locations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city.slug}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{city.name}, {city.state}</div>
                    <div className="text-sm text-gray-500">{city.count} businesses</div>
                  </div>
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Directories */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Business Directories
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search directories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCombinations.length} of {totalCombinations} directories
            </p>
          </div>

          {/* Directory Listings */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCombinations.map((combo) => (
                <a
                  key={`${combo.categorySlug}-${combo.citySlug}`}
                  href={combo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 mb-1">
                        {combo.category} in {combo.city}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{combo.state}</p>
                      <p className="text-sm text-blue-600">
                        {combo.businessCount} business{combo.businessCount !== 1 ? 'es' : ''}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </div>
                  
                  <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                    {combo.url}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCombinations.map((combo) => (
                <a
                  key={`${combo.categorySlug}-${combo.citySlug}`}
                  href={combo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-900">
                        {combo.category} in {combo.city}, {combo.state}
                      </div>
                      <div className="text-sm text-gray-500">
                        {combo.businessCount} business{combo.businessCount !== 1 ? 'es' : ''} • {combo.url}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredCombinations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No directories found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;