import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '../types';
import { DataProviderFactory } from '../providers/DataProviderFactory';
import { MapPin, Star, ExternalLink, Search } from 'lucide-react';

interface ServicesHomePageProps {
  subdomainInfo: SubdomainInfo;
}

interface ServiceCategory {
  name: string;
  slug: string;
  count: number;
  description: string;
  icon: string;
}

interface CityData {
  name: string;
  slug: string;
  state: string;
  count: number;
}

const ServicesHomePage: React.FC<ServicesHomePageProps> = ({ subdomainInfo }) => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    const loadData = async () => {
      try {
        const businesses = await dataProvider.getAllBusinesses();
        
        // Extract unique categories with counts
        const categoryMap = new Map<string, number>();
        businesses.forEach(business => {
          const category = business.category;
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const serviceCategories: ServiceCategory[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          count,
          description: `Find the best ${name.toLowerCase()} near you`,
          icon: '🏪' // Default icon, can be customized per service
        }));

        // Extract unique cities with counts
        const cityMap = new Map<string, { count: number; state: string }>();
        businesses.forEach(business => {
          const city = business.city;
          const state = business.state;
          const existing = cityMap.get(city);
          cityMap.set(city, {
            count: (existing?.count || 0) + 1,
            state: existing?.state || state
          });
        });

        const cityData: CityData[] = Array.from(cityMap.entries()).map(([name, { count, state }]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          state,
          count
        }));

        setServices(serviceCategories.sort((a, b) => b.count - a.count));
        setCities(cityData.sort((a, b) => b.count - a.count));
      } catch (error) {
        console.error('Error loading services data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataProvider]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Local Services Near You
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the best local businesses across all categories and cities
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Services Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Browse by Service
              <span className="block text-lg font-normal text-gray-600 mt-2">
                {filteredServices.length} service categories available
              </span>
            </h2>
            
            <div className="grid gap-4">
              {filteredServices.map((service) => (
                <a
                  key={service.slug}
                  href={`https://${service.slug}.near-me.us`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{service.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="w-4 h-4" />
                      <span>{service.count} businesses</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Cities Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Browse by City
              <span className="block text-lg font-normal text-gray-600 mt-2">
                {filteredCities.length} cities available
              </span>
            </h2>
            
            <div className="grid gap-4">
              {filteredCities.map((city) => (
                <a
                  key={city.slug}
                  href={`https://nail-salons.${city.slug}.near-me.us`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {city.name}, {city.state}
                        </h3>
                        <p className="text-gray-600">
                          Discover local services in {city.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="w-4 h-4" />
                      <span>{city.count} businesses</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {services.length}
              </div>
              <div className="text-gray-600">Service Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {cities.length}
              </div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {services.reduce((sum, service) => sum + service.count, 0)}
              </div>
              <div className="text-gray-600">Total Businesses</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesHomePage;
