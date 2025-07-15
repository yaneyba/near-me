/**
 * Generic Custom Layout Component
 * 
 * This is a configurable layout for specialized business categories that need
 * unique branding, messaging, and UI elements. Unlike the default services layout,
 * this layout allows for:
 * - Custom branding and logos
 * - Specialized color schemes and messaging
 * - Category-specific UI elements and features
 * - Tailored hero sections and statistics
 * 
 * Examples of categories that might use custom layouts:
 * - Water refill stations (AquaFinder branding)
 * - EV charging stations
 * - Public WiFi hotspots
 * - Food delivery services
 * - Any service requiring unique branding/experience
 */

import React, { useState } from 'react';
import { SubdomainInfo } from '@/types';
import Footer from '@/components/Footer';
import DevPanel from '@/components/DevPanel';
import { Link } from 'react-router-dom';
import { MapPin, Filter, Search as SearchIcon, X } from 'lucide-react';
import Search from '@/components/shared/Search';

// Configuration interface for customizing the layout
export interface CustomLayoutConfig {
  // Branding
  brandName: string;
  logoComponent?: React.ComponentType<any>;
  
  // Colors and theming
  primaryColor: string;     // e.g., 'blue-600'
  gradientFrom: string;     // e.g., 'blue-500'
  gradientTo: string;       // e.g., 'blue-700'
  accentColor: string;      // e.g., 'blue-100'
  
  // Hero section content
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  searchPlaceholder: string;
  
  // Navigation items
  navItems: Array<{
    label: string;
    href: string;
  }>;
  
  // Statistics to display
  stats: Array<{
    value: string;
    label: string;
  }>;
  
  // Popular search suggestions
  popularSuggestions: string[];
  
  // Category identifier for dev panel
  categoryKey: string;
}

interface CustomLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  config: CustomLayoutConfig;
  showSearchBar?: boolean;
  hideAllBelowHeader?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  currentSearchQuery?: string;
}

const CustomLayout: React.FC<CustomLayoutProps> = ({ 
  children, 
  subdomainInfo, 
  config,
  showSearchBar = false, 
  hideAllBelowHeader = false, 
  onSearch,
  onClearSearch,
  currentSearchQuery = ''
}) => {
  const [devPanelVisible, setDevPanelVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDevSubdomainChange = (_category: string, city: string) => {
    const newUrl = `${config.categoryKey}.near-me.us/${city.toLowerCase().replace(/\s+/g, '-')}`;
    console.log('Would navigate to:', newUrl);
    window.location.reload();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentSearchQuery.trim() && onSearch) {
      onSearch(currentSearchQuery.trim());
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Dynamic CSS classes based on config - using safe class generation
  const getColorClasses = () => {
    // Safe class mapping for Tailwind CSS purging
    const colorMapping = {
      'blue-600': {
        headerBg: 'bg-blue-600',
        headerHover: 'hover:text-blue-100',
        mobileBg: 'bg-blue-700',
        mobileHover: 'hover:bg-blue-800',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-blue-700',
        buttonBg: 'bg-blue-600',
        buttonHover: 'hover:bg-blue-700',
        buttonActive: 'active:bg-blue-800',
        accentBg: 'bg-blue-100',
        accentHover: 'hover:bg-blue-200',
        accentActive: 'active:bg-blue-300',
        textPrimary: 'text-blue-600',
        borderAccent: 'border-blue-400'
      },
      'green-600': {
        headerBg: 'bg-green-600',
        headerHover: 'hover:text-green-100',
        mobileBg: 'bg-green-700',
        mobileHover: 'hover:bg-green-800',
        gradientFrom: 'from-green-500',
        gradientTo: 'to-green-700',
        buttonBg: 'bg-green-600',
        buttonHover: 'hover:bg-green-700',
        buttonActive: 'active:bg-green-800',
        accentBg: 'bg-green-100',
        accentHover: 'hover:bg-green-200',
        accentActive: 'active:bg-green-300',
        textPrimary: 'text-green-600',
        borderAccent: 'border-green-400'
      },
      'orange-600': {
        headerBg: 'bg-orange-600',
        headerHover: 'hover:text-orange-100',
        mobileBg: 'bg-orange-700',
        mobileHover: 'hover:bg-orange-800',
        gradientFrom: 'from-orange-500',
        gradientTo: 'to-red-600',
        buttonBg: 'bg-orange-600',
        buttonHover: 'hover:bg-orange-700',
        buttonActive: 'active:bg-orange-800',
        accentBg: 'bg-orange-100',
        accentHover: 'hover:bg-orange-200',
        accentActive: 'active:bg-orange-300',
        textPrimary: 'text-orange-600',
        borderAccent: 'border-orange-400'
      }
    };

    return colorMapping[config.primaryColor as keyof typeof colorMapping] || colorMapping['blue-600'];
  };

  const colorClasses = getColorClasses();

  // Header with configurable branding
  const renderHeader = () => {
    const LogoComponent = config.logoComponent;
    
    return (
      <header className={`${colorClasses.headerBg} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
              {LogoComponent ? (
                <LogoComponent 
                  size="md" 
                  variant="full" 
                  theme="dark"
                />
              ) : (
                <div className="text-xl font-bold">{config.brandName}</div>
              )}
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              {config.navItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href} 
                  className={colorClasses.headerHover}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className={`text-white ${colorClasses.headerHover}`}
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
            <div className={`md:hidden ${colorClasses.mobileBg} border-t border-opacity-50`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {config.navItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.href} 
                    className={`block px-3 py-2 text-white ${colorClasses.mobileHover} rounded-md`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    );
  };

  // Hero section with configurable content
  const renderHeroSection = () => {
    const handleSearchSelect = (result: string) => {
      if (onSearch) {
        onSearch(result);
      }
    };

    return (
      <section className={`bg-gradient-to-br ${colorClasses.gradientFrom} ${colorClasses.gradientTo} text-white py-12 sm:py-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {config.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {config.heroSubtitle}
          </p>
          
          {/* Search section */}
          <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
            <Search
              value={currentSearchQuery}
              onChange={onSearch || (() => {})}
              onSelect={handleSearchSelect}
              onSubmit={handleSearchSelect}
              placeholder={config.searchPlaceholder}
              variant="hero"
              className="w-full"
              showRecentSearches={true}
              showPopularSuggestions={true}
              popularSuggestions={config.popularSuggestions}
              city={subdomainInfo.city}
            />
          </div>
          
          <button className={`inline-flex items-center ${colorClasses.buttonBg} ${colorClasses.buttonHover} ${colorClasses.buttonActive} text-white px-6 py-3 rounded-lg ${colorClasses.borderAccent} border transition-colors font-medium gap-2 touch-manipulation`}>
            <MapPin className="w-5 h-5" />
            {config.ctaText}
          </button>
        </div>
      </section>
    );
  };

  // Stats section with configurable statistics
  const renderStatsSection = () => {
    return (
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-2 ${config.stats.length >= 4 ? 'md:grid-cols-4' : `md:grid-cols-${config.stats.length}`} gap-6 sm:gap-8 text-center`}>
            {config.stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className={`text-2xl sm:text-3xl font-bold ${colorClasses.textPrimary} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Search bar for listing pages
  const renderSearchBar = () => {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
            {/* Search input */}
            <div className="flex-1 relative min-w-0">
              <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={currentSearchQuery}
                onChange={handleSearchInputChange}
                placeholder={config.searchPlaceholder}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
              />
              {currentSearchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-3 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 sm:flex-shrink-0">
              <button 
                type="submit"
                className={`${colorClasses.buttonBg} text-white px-4 sm:px-6 py-2.5 rounded-lg ${colorClasses.buttonHover} ${colorClasses.buttonActive} transition-colors font-medium text-sm sm:text-base min-h-[44px] touch-manipulation`}
              >
                Search
              </button>
              
              <div className="flex gap-2 xs:gap-3">
                <button className={`${colorClasses.accentBg} ${colorClasses.textPrimary} px-3 sm:px-4 py-2.5 rounded-lg ${colorClasses.accentHover} ${colorClasses.accentActive} transition-colors flex items-center justify-center gap-1 text-sm font-medium min-h-[44px] touch-manipulation flex-1 xs:flex-initial`}>
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
            
            {/* List view toggle */}
            <button className={`hidden lg:block ${colorClasses.textPrimary} hover:opacity-80 transition-colors font-medium text-sm whitespace-nowrap`}>
              List View
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {renderHeader()}
      {!hideAllBelowHeader && (
        showSearchBar ? renderSearchBar() : (
          <>
            {renderHeroSection()}
            {renderStatsSection()}
          </>
        )
      )}
      
      {/* Main Content Area */}
      <div className="flex-grow">
        {children}
      </div>

      <Footer />

      {/* Development Panel */}
      {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('stackblitz')) && (
        <DevPanel
          onSubdomainChange={handleDevSubdomainChange}
          currentCategory={config.categoryKey}
          currentCity={subdomainInfo.city}
          isVisible={devPanelVisible}
          onToggleVisibility={() => setDevPanelVisible(!devPanelVisible)}
        />
      )}
    </div>
  );
};

export default CustomLayout;
