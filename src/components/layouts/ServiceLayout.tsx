import React, { useState } from 'react';
import { SubdomainInfo } from '@/types';
import Footer from '@/components/Footer';
import DevPanel from '@/components/DevPanel';
import { Link } from 'react-router-dom';
import { MapPin, Search, LucideIcon } from 'lucide-react';

interface ServiceLayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
  serviceConfig: {
    name: string;
    icon: LucideIcon;
    color: string;
    slug: string;
  };
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({ children, subdomainInfo, serviceConfig }) => {
  const [devPanelVisible, setDevPanelVisible] = useState(false);

  const handleDevSubdomainChange = (_category: string, city: string) => {
    // Construct the appropriate URL based on service config
    const newUrl = `${serviceConfig.slug}.near-me.us/${city.toLowerCase().replace(/\s+/g, '-')}`;
    console.log('Would navigate to:', newUrl);
    window.location.reload();
  };

  // Custom breadcrumb for any service
  const renderServiceBreadcrumb = () => {
    const ServiceIcon = serviceConfig.icon;
    return (
      <nav className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
              <ServiceIcon className="w-4 h-4 mr-1" />
              {serviceConfig.name}
            </Link>
            {subdomainInfo.city && !subdomainInfo.city.includes('All') && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {subdomainInfo.city}, {subdomainInfo.state}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  };

  // Custom header for any service
  const renderServiceHeader = () => {
    const ServiceIcon = serviceConfig.icon;
    return (
      <header className={`${serviceConfig.color} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <ServiceIcon className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-xl font-bold">
                  {subdomainInfo.city && !subdomainInfo.city.includes('All')
                    ? `${serviceConfig.name} in ${subdomainInfo.city}`
                    : serviceConfig.name
                  }
                </h1>
                {subdomainInfo.city && !subdomainInfo.city.includes('All') && (
                  <p className="text-blue-100 text-sm">{subdomainInfo.state}</p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-200 flex items-center">
                <Search className="w-4 h-4 mr-1" />
                Find {serviceConfig.name}
              </Link>
              <Link to="/about" className="hover:text-blue-200">About</Link>
              <Link to="/contact" className="hover:text-blue-200">Contact</Link>
              <Link to="/add-business" className="hover:text-blue-200 bg-blue-700 px-3 py-1 rounded">
                Add Your Business
              </Link>
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {renderServiceHeader()}
      {renderServiceBreadcrumb()}
      
      <div className="flex-grow flex">
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      <Footer />

      {/* Development Panel - Only visible in development */}
      {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('stackblitz')) && (
        <DevPanel
          onSubdomainChange={handleDevSubdomainChange}
          currentCategory={subdomainInfo.category}
          currentCity={subdomainInfo.city}
          isVisible={devPanelVisible}
          onToggleVisibility={() => setDevPanelVisible(!devPanelVisible)}
        />
      )}
    </div>
  );
};

export default ServiceLayout;
