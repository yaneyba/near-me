import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { SmartBusinessSection, SmartPricingSection } from '@/components/shared/content';
import { Home, ChevronRight, Droplets } from 'lucide-react';

interface ForBusinessPageProps {
  subdomainInfo: SubdomainInfo;
}

const ForBusinessPage: React.FC<ForBusinessPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `For Business - Water Refill Stations in ${subdomainInfo.city}, ${subdomainInfo.state}`;
  }, [subdomainInfo]);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} hideAllBelowHeader={true}>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
            <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <span className="flex items-center text-gray-900">
              <Droplets className="w-4 h-4 mr-1" />
              For Business
            </span>
          </nav>
        </div>
      </div>

      <SmartBusinessSection
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
      
      <SmartPricingSection
        category={subdomainInfo.category}
      />
    </WaterRefillLayout>
  );
};

export default ForBusinessPage;