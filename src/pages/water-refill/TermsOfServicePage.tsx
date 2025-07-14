import React from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import TermsOfServicePage from '@/pages/TermsOfServicePage';

interface WaterRefillTermsOfServicePageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillTermsOfServicePage: React.FC<WaterRefillTermsOfServicePageProps> = ({ subdomainInfo }) => {
  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} hideAllBelowHeader={true}>
      <TermsOfServicePage />
    </WaterRefillLayout>
  );
};

export default WaterRefillTermsOfServicePage;
