import React from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';

interface WaterRefillPrivacyPolicyPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillPrivacyPolicyPage: React.FC<WaterRefillPrivacyPolicyPageProps> = ({ subdomainInfo }) => {
  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} hideAllBelowHeader={true}>
      <PrivacyPolicyPage />
    </WaterRefillLayout>
  );
};

export default WaterRefillPrivacyPolicyPage;
