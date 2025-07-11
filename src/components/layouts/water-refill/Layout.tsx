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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Droplets className="w-8 h-8 mr-3 text-blue-200" />
              <div>
                <h1 className="text-xl font-bold">
                  AquaFinder
                </h1>
                <p className="text-blue-200 text-sm">Find Water Stations</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-200">Find Stations</Link>
              <Link to="/for-business" className="hover:text-blue-200">For Business</Link>
              <Link to="/about" className="hover:text-blue-200">About</Link>
              <Link to="/contact" className="hover:text-blue-200">Contact</Link>
              <Link to="/login" className="hover:text-blue-200">Sign In</Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="text-white hover:text-blue-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-blue-700 border-t border-blue-500">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  to="/" 
                  className="block px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Stations
                </Link>
                <Link 
                  to="/for-business" 
                  className="block px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Business
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="block px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-md mx-3 mt-2 text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  };

  // Hero section like AquaFinder
  const renderHeroSection = () => {
    return (
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Find Quality Water Refill Stations Near You
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover clean, affordable water refill locations in your area. Save money and reduce plastic waste with our comprehensive directory.
          </p>
          
          {/* Responsive search section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by city, zip code, or station name..."
                  className="w-full pl-10 pr-4 py-3.5 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 transition-all text-base placeholder:text-gray-500"
                />
              </div>
              <button className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 sm:px-8 py-3.5 rounded-lg font-medium transition-colors whitespace-nowrap min-h-[52px] touch-manipulation">
                Search Stations
              </button>
            </div>
          </div>
          
          <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg border border-blue-400 transition-colors font-medium gap-2 touch-manipulation">
            <MapPin className="w-5 h-5" />
            Find Stations Near Me
          </button>
        </div>
      </section>
    );
  };

  // Stats section like AquaFinder
  const renderStatsSection = () => {
    return (
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600 text-sm sm:text-base">Verified Stations</div>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 text-sm sm:text-base">Cities Covered</div>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">$0.25</div>
              <div className="text-gray-600 text-sm sm:text-base">Average Price/Gallon</div>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600 text-sm sm:text-base">Customer Satisfaction</div>
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
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
            {/* Search input - full width on mobile, flexible on desktop */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by location, station name, or zip code..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
              />
            </div>
            
            {/* Button group - stacked on mobile, inline on desktop */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 sm:flex-shrink-0">
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm sm:text-base min-h-[44px] touch-manipulation">
                Search
              </button>
              
              <div className="flex gap-2 xs:gap-3">
                <button className="bg-blue-100 text-blue-600 px-3 sm:px-4 py-2.5 rounded-lg hover:bg-blue-200 active:bg-blue-300 transition-colors flex items-center justify-center gap-1 text-sm font-medium min-h-[44px] touch-manipulation flex-1 xs:flex-initial">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden xs:inline">Near Me</span>
                  <span className="xs:hidden">Near</span>
                </button>
                
                <button className="bg-gray-100 text-gray-600 px-3 sm:px-4 py-2.5 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center gap-1 text-sm font-medium min-h-[44px] touch-manipulation flex-1 xs:flex-initial">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>
            
            {/* List view toggle - hidden on mobile, visible on larger screens */}
            <button className="hidden lg:block text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm whitespace-nowrap">
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
