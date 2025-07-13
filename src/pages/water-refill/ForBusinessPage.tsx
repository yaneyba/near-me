import React, { useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { PricingSection } from '@/components/shared/content';

interface ForBusinessPageProps {
  subdomainInfo: SubdomainInfo;
}

const ForBusinessPage: React.FC<ForBusinessPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `For Business - Water Refill Stations in ${subdomainInfo.city}, ${subdomainInfo.state}`;
  }, [subdomainInfo]);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo}>
      <div className="pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              List Your Water Refill Station
            </h1>
            <p className="text-xl text-gray-600">
              Connect with customers looking for clean, affordable water in {subdomainInfo.city}, {subdomainInfo.state}
            </p>
          </div>
        </div>
        
        <PricingSection />
      </div>
    </WaterRefillLayout>
  );
};

export default ForBusinessPage;