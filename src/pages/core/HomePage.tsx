import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { MapPin, ExternalLink, Search } from 'lucide-react';

interface HomePageProps {
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

const HomePage: React.FC<HomePageProps> = ({ subdomainInfo }) => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = `Find Local Services - ${subdomainInfo.category} Directory`;
  }, [subdomainInfo]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dataProvider = DataProviderFactory.getProvider();
        
        // Get aggregated homepage data from single API endpoint
        const homePageData = await dataProvider.getHomePageData();
        setServices(homePageData.services);
        setCities(homePageData.cities);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
        setError('Failed to load data');
        setServices([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Unable to load data</div>
          <p className="text-gray-600">{error}</p>
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
                      <ExternalLink className="w-4 h-4" />
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
              {filteredCities.map((city) => {
                // Handle URL generation based on subdomain type
                let cityUrl: string;
                
                if (subdomainInfo.isServices || !subdomainInfo.rawCategory) {
                  // For main services page, link to main site with city parameter
                  cityUrl = `https://near-me.us/?city=${encodeURIComponent(city.slug)}`;
                } else {
                  // For category-specific pages, use the rawCategory slug
                  cityUrl = `https://${subdomainInfo.rawCategory}.${city.slug}.near-me.us`;
                }
                
                return (
                  <a
                    key={city.slug}
                    href={cityUrl}
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
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </a>
                );
              })}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
