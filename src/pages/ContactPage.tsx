import React, { useEffect } from 'react';
import { SubdomainInfo } from '@/types';
import { generateTitle } from '@/utils/subdomainParser';
import ContactSection from '@/components/ContactSection';

interface ContactPageProps {
  subdomainInfo: SubdomainInfo;
}

const ContactPage: React.FC<ContactPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `Contact - ${generateTitle(subdomainInfo.category, subdomainInfo.city, subdomainInfo.state)}`;
  }, [subdomainInfo]);

  return (
    <div className="pt-8">
      <ContactSection
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
      />
    </div>
  );
};

export default ContactPage;