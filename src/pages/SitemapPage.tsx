import React, { useEffect } from 'react';
import SitemapGenerator from '../components/SitemapGenerator';

const SitemapPage: React.FC = () => {
  useEffect(() => {
    document.title = 'SEO Sitemap Generator - Dynamic Subdomain System';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <SitemapGenerator />
    </div>
  );
};

export default SitemapPage;