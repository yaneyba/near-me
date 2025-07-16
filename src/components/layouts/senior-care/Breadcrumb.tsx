/**
 * Senior Care Breadcrumb Component
 * 
 * Reusable breadcrumb navigation for senior care pages
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Heart, Info, Phone, Building } from 'lucide-react';

interface SeniorCareBreadcrumbProps {
  /** Custom page title override */
  pageTitle?: string;
  /** Custom icon for the current page */
  pageIcon?: React.ReactNode;
}

const SeniorCareBreadcrumb: React.FC<SeniorCareBreadcrumbProps> = ({ 
  pageTitle, 
  pageIcon 
}) => {
  const location = useLocation();

  const getPageInfo = () => {
    if (pageTitle && pageIcon) {
      return { title: pageTitle, icon: pageIcon };
    }

    // Auto-detect page based on URL
    switch (location.pathname) {
      case '/':
        return { title: 'Senior Care Services', icon: <Heart className="w-4 h-4" /> };
      case '/about':
        return { title: 'About', icon: <Info className="w-4 h-4" /> };
      case '/contact':
        return { title: 'Contact', icon: <Phone className="w-4 h-4" /> };
      case '/add-business':
        return { title: 'Add Your Business', icon: <Building className="w-4 h-4" /> };
      default:
        if (location.pathname.startsWith('/services/')) {
          const serviceName = location.pathname.split('/services/')[1]
            ?.replace(/-/g, ' ')
            ?.replace(/\b\w/g, l => l.toUpperCase());
          return { title: serviceName || 'Service', icon: <Heart className="w-4 h-4" /> };
        }
        return { title: 'Senior Care Services', icon: <Heart className="w-4 h-4" /> };
    }
  };

  const pageInfo = getPageInfo();
  const isHomePage = location.pathname === '/';

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex flex-wrap items-center text-sm text-gray-500 gap-1" aria-label="Breadcrumb">
          {!isHomePage && (
            <>
              <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            </>
          )}
          <span className="flex items-center text-gray-900 font-medium">
            {pageInfo.icon && <span className="mr-1">{pageInfo.icon}</span>}
            {pageInfo.title}
          </span>
        </nav>
      </div>
    </div>
  );
};

export default SeniorCareBreadcrumb;
