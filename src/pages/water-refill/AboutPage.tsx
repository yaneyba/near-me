import React, { useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { SmartAboutSection } from '@/components/shared/content';

interface AboutPageProps {
  subdomainInfo: SubdomainInfo;
}

const AboutPage: React.FC<AboutPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `About - Water Refill Stations in ${subdomainInfo.city}, ${subdomainInfo.state}`;
  }, [subdomainInfo]);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo}>
      <SmartAboutSection
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
    </WaterRefillLayout>
  );
};

export default AboutPage;