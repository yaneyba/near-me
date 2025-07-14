import React from 'react';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import SitemapPage from '@/pages/SitemapPage';

interface WaterRefillSitemapPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillSitemapPage: React.FC<WaterRefillSitemapPageProps> = ({ subdomainInfo }) => {
  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} hideAllBelowHeader={true}>
      <SitemapPage subdomainInfo={subdomainInfo} />
    </WaterRefillLayout>
  );
};

export default WaterRefillSitemapPage;
