import React, { useState, useEffect } from 'react';
import { DataProviderFactory } from '../providers';
import { Business, SubdomainInfo } from '../types';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import DevPanel from './DevPanel';
import { AdUnit } from './ads';

interface LayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
}

const Layout: React.FC<LayoutProps> = ({ children, subdomainInfo }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [devPanelVisible, setDevPanelVisible] = useState(false);
  
  const dataProvider = DataProviderFactory.getProvider();

  // Load businesses for search functionality
  useEffect(() => {
    if (subdomainInfo.category && subdomainInfo.city) {
      loadBusinesses(subdomainInfo.category, subdomainInfo.city);
    }
  }, [subdomainInfo]);

  const loadBusinesses = async (category: string, city: string) => {
    setLoading(true);
    try {
      const businessData = await dataProvider.getBusinesses(category, city);
      setBusinesses(businessData);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDevSubdomainChange = (category: string, city: string) => {
    // In a real app, this would update the URL/subdomain
    // For now, we'll just reload the page with new data
    window.location.reload();
  };

  const handleSearch = (query: string) => {
    // Navigate to home page with search
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Ad */}
      {import.meta.env.VITE_ENABLE_ADS === 'true' && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <AdUnit
              slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_HEADER || ''}
              size="leaderboard"
              className="flex justify-center"
              label="Advertisement"
            />
          </div>
        </div>
      )}

      <Header
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
        businesses={businesses}
        onSearch={handleSearch}
      />
      
      <Breadcrumb subdomainInfo={subdomainInfo} />
      
      <div className="flex-grow flex">
        {/* Sidebar Ad */}
        {import.meta.env.VITE_ENABLE_ADS === 'true' && (
          <aside className="hidden xl:block w-80 bg-gray-50 border-r border-gray-200">
            <div className="sticky top-20 p-4">
              <AdUnit
                slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_SIDEBAR || ''}
                size="sidebar"
                label="Sponsored"
              />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      <Footer
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />

      {/* Footer Ad */}
      {import.meta.env.VITE_ENABLE_ADS === 'true' && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AdUnit
              slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_FOOTER || ''}
              size="leaderboard"
              className="flex justify-center"
              label="Advertisement"
            />
          </div>
        </div>
      )}

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

export default Layout;