import React, { useState } from 'react';
import { SubdomainInfo } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Breadcrumb } from '@/components/shared/ui';
import DevPanel from '@/components/DevPanel';

interface LayoutProps {
  children: React.ReactNode;
  subdomainInfo: SubdomainInfo;
}

const Layout: React.FC<LayoutProps> = ({ children, subdomainInfo }) => {
  const [devPanelVisible, setDevPanelVisible] = useState(false);

  const handleDevSubdomainChange = () => {
    // In a real app, this would update the URL/subdomain
    // For now, we'll just reload the page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
      
      <Breadcrumb subdomainInfo={subdomainInfo} />
      
      <div className="flex-grow flex">
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