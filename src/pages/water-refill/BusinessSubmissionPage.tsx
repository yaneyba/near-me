import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { BusinessSubmissionForm } from '@/components/water-refill';
import { Home, ChevronRight, Droplets } from 'lucide-react';

interface BusinessSubmissionPageProps {
  subdomainInfo: SubdomainInfo;
}

const BusinessSubmissionPage: React.FC<BusinessSubmissionPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = `Submit Your Business - Water Refill Stations in ${subdomainInfo.city}, ${subdomainInfo.state}`;
  }, [subdomainInfo]);

  const handleSubmissionSuccess = () => {
    // Could add analytics tracking here
    console.log('Business submission successful');
  };

  const handleSubmissionError = (error: string) => {
    // Could add error tracking here
    console.error('Business submission error:', error);
  };

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
            <Link to="/for-business" className="flex items-center hover:text-blue-600 transition-colors">
              <Droplets className="w-4 h-4 mr-1" />
              For Business
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <span className="text-gray-900">Submit Business</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BusinessSubmissionForm 
            onSuccess={handleSubmissionSuccess}
            onError={handleSubmissionError}
          />
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default BusinessSubmissionPage;
