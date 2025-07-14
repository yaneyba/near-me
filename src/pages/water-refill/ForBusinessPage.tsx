import React, { useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { SmartBusinessSection, SmartPricingSection } from '@/components/shared/content';

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