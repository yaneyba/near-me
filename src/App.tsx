import React, { useEffect, useState } from 'react';
import { parseSubdomain, generateTitle } from './utils/subdomainParser';
import { JsonDataProvider } from './providers/JsonDataProvider';
import { Business, SubdomainInfo } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import BusinessListings from './components/BusinessListings';
import ServicesSection from './components/ServicesSection';
import Footer from './components/Footer';
import DevPanel from './components/DevPanel';

function App() {
  const [subdomainInfo, setSubdomainInfo] = useState<SubdomainInfo>({
    category: '',
    city: '',
    state: ''
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [devPanelVisible, setDevPanelVisible] = useState(false);
  
  const dataProvider = new JsonDataProvider();

  // Initialize subdomain info
  useEffect(() => {
    const info = parseSubdomain();
    setSubdomainInfo(info);
    updateDocumentTitle(info.category, info.city, info.state);
  }, []);

  // Load data when subdomain info changes
  useEffect(() => {
    if (subdomainInfo.category && subdomainInfo.city) {
      loadData(subdomainInfo.category, subdomainInfo.city);
    }
  }, [subdomainInfo]);

  const updateDocumentTitle = (category: string, city: string, state: string) => {
    document.title = generateTitle(category, city, state);
  };

  const loadData = async (category: string, city: string) => {
    setLoading(true);
    try {
      const [businessData, serviceData] = await Promise.all([
        dataProvider.getBusinesses(category, city),
        dataProvider.getServices(category)
      ]);
      
      setBusinesses(businessData);
      setServices(serviceData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDevSubdomainChange = (category: string, city: string) => {
    const state = getStateForCity(city);
    const newInfo = { category, city, state };
    setSubdomainInfo(newInfo);
    updateDocumentTitle(category, city, state);
    setSearchQuery(''); // Reset search when changing subdomain
  };

  const getStateForCity = (city: string): string => {
    const cityStateMap: Record<string, string> = {
      'Dallas': 'Texas',
      'Denver': 'Colorado',
      'Austin': 'Texas',
      'Houston': 'Texas',
      'Phoenix': 'Arizona',
      'Chicago': 'Illinois',
      'Atlanta': 'Georgia',
      'Miami': 'Florida',
      'Seattle': 'Washington',
      'Portland': 'Oregon'
    };
    return cityStateMap[city] || 'Unknown State';
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to business listings section
    const businessSection = document.getElementById('businesses');
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {subdomainInfo.category} in {subdomainInfo.city}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
        onSearch={handleSearch}
      />
      
      <main className="flex-grow">
        <Hero
          category={subdomainInfo.category}
          city={subdomainInfo.city}
          state={subdomainInfo.state}
          onSearch={handleSearch}
        />
        
        <div id="businesses">
          <BusinessListings
            businesses={businesses}
            category={subdomainInfo.category}
            city={subdomainInfo.city}
            searchQuery={searchQuery}
          />
        </div>
        
        <div id="services">
          <ServicesSection
            services={services}
            category={subdomainInfo.category}
            city={subdomainInfo.city}
          />
        </div>
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
}

export default App;