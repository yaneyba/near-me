import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { SmartAboutSection } from '@/components/shared/content';
import { Home, ChevronRight, Droplets } from 'lucide-react';

interface AboutPageProps {
  subdomainInfo: SubdomainInfo;
}

const AboutPage: React.FC<AboutPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `About - Water Refill Stations in ${subdomainInfo.city}, ${subdomainInfo.state}`;
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
              About
            </span>
          </nav>
        </div>
      </div>

      <SmartAboutSection
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
    </WaterRefillLayout>
  );
};

export default AboutPage;