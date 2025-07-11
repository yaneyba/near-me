import React, { useState } from 'react';
import { SubdomainInfo } from '@/types';
import Footer from '@/components/Footer';
import DevPanel from '@/components/DevPanel';
import { Link } from 'react-router-dom';
import { Droplets, Search, MapPin, Filter } from 'lucide-react';

interface WaterRefillLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  showSearchBar?: boolean;
}

const WaterRefillLayout: React.FC<WaterRefillLayoutProps> = ({ children, subdomainInfo, showSearchBar = false }) => {
  const [devPanelVisible, setDevPanelVisible] = useState(false);

  const handleDevSubdomainChange = (_category: string, city: string) => {
    const newUrl = `water-refill.near-me.us/${city.toLowerCase().replace(/\s+/g, '-')}`;
    console.log('Would navigate to:', newUrl);
    window.location.reload();
  };

  // Custom header for water refill stations (like AquaFinder)
  const renderHeader = () => {
    return (
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Droplets className="w-8 h-8 mr-3 text-blue-200" />
              <div>
                <h1 className="text-xl font-bold">
                  AquaFinder
                </h1>
                <p className="text-blue-200 text-sm">Find Water Stations</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-200">Find Stations</Link>
              <Link to="/for-business" className="hover:text-blue-200">For Business</Link>
              <Link to="/about" className="hover:text-blue-200">About</Link>
              <Link to="/contact" className="hover:text-blue-200">Contact</Link>
              <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded">
                Sign In
              </button>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded font-medium">
                Get Started
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white hover:text-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Hero section like AquaFinder
  const renderHeroSection = () => {
    return (
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Quality Water Refill Stations Near You
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover clean, affordable water refill locations in your area. Save money and reduce plastic waste with our comprehensive directory.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city, zip code, or station name..."
                className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Search Stations
            </button>
          </div>
          
          <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg border border-blue-400 transition-colors">
            <MapPin className="w-5 h-5 mr-2" />
            Find Stations Near Me
          </button>
        </div>
      </section>
    );
  };

  // Stats section like AquaFinder
  const renderStatsSection = () => {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Verified Stations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$0.25</div>
              <div className="text-gray-600">Average Price/Gallon</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Search bar for stations page
  const renderSearchBar = () => {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, station name, or zip code..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              Search
            </button>
            <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Near Me
            </button>
            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </button>
            <button className="text-blue-600 hover:text-blue-800">
              List View
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {renderHeader()}
      {showSearchBar ? renderSearchBar() : (
        <>
          {renderHeroSection()}
          {renderStatsSection()}
        </>
      )}
      
      {/* Main Content Area - This will contain the sidebar + map layout */}
      <div className="flex-grow">
        {children}
      </div>

      <Footer
        category="water-refill"
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />

      {/* Development Panel - Only visible in development */}
      {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('stackblitz')) && (
        <DevPanel
          onSubdomainChange={handleDevSubdomainChange}
          currentCategory="water-refill"
          currentCity={subdomainInfo.city}
          isVisible={devPanelVisible}
          onToggleVisibility={() => setDevPanelVisible(!devPanelVisible)}
        />
      )}
    </div>
  );
};

export default WaterRefillLayout;
