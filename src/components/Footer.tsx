import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataProviderFactory } from '@/providers';

interface FooterProps {
  category: string;
  city: string;
  state: string;
}

const Footer: React.FC<FooterProps> = ({ category, city, state }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [businessCount, setBusinessCount] = useState<number>(0);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataProvider = DataProviderFactory.getProvider();
        const [categoriesData, citiesData] = await Promise.all([
          dataProvider.getCategories(),
          dataProvider.getCities()
        ]);
        setCategories(categoriesData);
        setCities(citiesData);
        
        // Get business count for current category and city
        try {
          let businesses;
          if (city === 'All Cities' || !city) {
            // Use category-wide search for all cities
            businesses = await dataProvider.getBusinessesByCategory(category);
          } else {
            // Use specific city search
            businesses = await dataProvider.getBusinesses(category, city);
          }
          setBusinessCount(businesses.length);
        } catch (error) {
          console.warn('Failed to load business count, using fallback:', error);
          // Get fallback from data provider statistics
          try {
            const stats = await dataProvider.getStatistics();
            setBusinessCount(stats.general?.defaultBusinessCount);
          } catch (statsError) {
            console.warn('Failed to load statistics, using configuration fallback:', statsError);
            // This will use the fallback defined in the data provider's getStatistics method
            const fallbackStats = await dataProvider.getStatistics();
            setBusinessCount(fallbackStats.general?.defaultBusinessCount);
          }
        }
      } catch (error) {
        console.error('Failed to load footer data:', error);
        // Fallback to centralized static data
        try {
          const dataProvider = DataProviderFactory.getProvider();
          const [fallbackCategories, fallbackCities, stats] = await Promise.all([
            dataProvider.getFallbackCategories(),
            dataProvider.getFallbackCities(),
            dataProvider.getStatistics()
          ]);
          setCategories(fallbackCategories);
          setCities(fallbackCities);
          setBusinessCount(stats.general?.defaultBusinessCount);
        } catch (statsError) {
          console.error('Critical: Failed to load any fallback data, contact system admin:', statsError);
          setBusinessCount(0); // Explicit failure state
        }
      }
    };

    loadData();
  }, [category, city]);

  // Get categories that exist (using DataProvider)
  const getExistingCategoriesInCurrentCity = (): string[] => {
    return categories;
  };

  // Get cities that actually exist for the CURRENT CATEGORY
  const getExistingCitiesForCurrentCategory = (): string[] => {
    return cities;
  };

  const existingCategoriesInCity = getExistingCategoriesInCurrentCity();
  const existingCitiesForCategory = getExistingCitiesForCurrentCategory();

  const formatForUrl = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  const formatCityForDisplay = (citySlug: string) => {
    if (!citySlug || citySlug === 'All Cities') return 'All Cities';
    return citySlug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCategoryForDisplay = (categorySlug: string) => {
    if (!categorySlug) return 'Services';
    return categorySlug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const cityDisplayName = formatCityForDisplay(city || 'All Cities');
  const categoryDisplayName = formatCategoryForDisplay(category || 'services');
  const stateDisplayName = state || 'Nationwide';

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Near Me Directory</h3>
            <p className="text-gray-400">
              Find trusted local businesses in {cityDisplayName}, {stateDisplayName}. 
              Connecting you with {businessCount}+ verified {categoryDisplayName.toLowerCase()} and other services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Business Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Services in {cityDisplayName}</h4>
            <ul className="space-y-2">
              {existingCategoriesInCity.slice(0, 8).map((cat) => {
                const linkPath = city === 'All Cities' 
                  ? `/${formatForUrl(cat)}` 
                  : `/${formatForUrl(cat)}-${city}`;
                
                return (
                  <li key={cat}>
                    <Link 
                      to={linkPath}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {formatCategoryForDisplay(cat)} in {cityDisplayName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">{categoryDisplayName} in Other Cities</h4>
            <ul className="space-y-2">
              {existingCitiesForCategory.slice(0, 8).map((citySlug) => {
                const linkPath = citySlug === 'All Cities' 
                  ? `/${category}` 
                  : `/${category}-${citySlug}`;
                
                return (
                  <li key={citySlug}>
                    <Link 
                      to={linkPath}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {formatCityForDisplay(citySlug)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact & Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business-owners" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  For Business Owners
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Sitemap
                </Link>
              </li>
              <li>
                <div className="text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  24/7 Online Directory
                </div>
              </li>
            </ul>
            
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Business Hours Vary by Location
              </p>
              <p className="text-sm text-gray-400">
                Contact businesses directly for current hours and availability.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Near Me Directory. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link to="/business-owners" className="text-gray-400 hover:text-white transition-colors">
                For Business Owners
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;