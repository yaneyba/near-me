import React, { useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { SmartContactSection } from '@/components/shared/content';

interface ContactPageProps {
  subdomainInfo: SubdomainInfo;
}

const ContactPage: React.FC<ContactPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `Contact - Water Refill Stations in ${subdomainInfo.city}, ${subdomainInfo.state}`;
  }, [subdomainInfo]);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo}>
      <SmartContactSection
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
    </WaterRefillLayout>
  );
};

export default ContactPage;