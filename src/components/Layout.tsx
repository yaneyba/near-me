import React, { useState, useEffect } from 'react';
import { getDataProvider } from '../providers';
import { Business, SubdomainInfo } from '../types';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import DevPanel from './DevPanel';

interface LayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
}

const Layout: React.FC<LayoutProps> = ({ children, subdomainInfo }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [devPanelVisible, setDevPanelVisible] = useState(false);
  
  const dataProvider = getDataProvider();

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
      <Header
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
        businesses={businesses}
        onSearch={handleSearch}
      />
      
      <Breadcrumb subdomainInfo={subdomainInfo} />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />

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