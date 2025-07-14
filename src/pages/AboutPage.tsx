import React, { useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { generateTitle } from '@/utils/subdomainParser';
import { SmartAboutSection } from '@/components/shared/content';

interface AboutPageProps {
  subdomainInfo: SubdomainInfo;
}

const AboutPage: React.FC<AboutPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `About - ${generateTitle(subdomainInfo.category, subdomainInfo.city, subdomainInfo.state)}`;
  }, [subdomainInfo]);

  return (
    <div className="pt-8">
      <SmartAboutSection
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
    </div>
  );
};

export default AboutPage;