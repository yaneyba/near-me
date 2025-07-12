import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Building, Info, Phone } from 'lucide-react';
import { SubdomainInfo } from '@/types';

interface BreadcrumbProps {
  subdomainInfo: SubdomainInfo;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ subdomainInfo }) => {
  const location = useLocation();
  const { category, city, state } = subdomainInfo;

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Current subdomain home (this is the actual homepage)
    breadcrumbs.push({
      label: `${category} in ${city}`,
      href: location.pathname === '/' ? undefined : '/',
      icon: <Home className="w-4 h-4" />
    });

    // Add current page if not home
    if (location.pathname !== '/') {
      switch (location.pathname) {
        case '/about':
          breadcrumbs.push({
            label: 'About',
            icon: <Info className="w-4 h-4" />,
            current: true
          });
          break;
        case '/contact':
          breadcrumbs.push({
            label: 'Contact',
            icon: <Phone className="w-4 h-4" />,
            current: true
          });
          break;
        case '/add-business':
          breadcrumbs.push({
            label: 'Add Your Business',
            icon: <Building className="w-4 h-4" />,
            current: true
          });
          break;
        case '/sitemap-generator':
          breadcrumbs.push({
            label: 'Sitemap Generator',
            icon: <MapPin className="w-4 h-4" />,
            current: true
          });
          break;
        default:
          // Handle dynamic routes like business pages
          if (location.pathname.startsWith('/business/')) {
            breadcrumbs.push({
              label: 'Business Details',
              icon: <Building className="w-4 h-4" />,
              current: true
            });
          } else if (location.pathname.startsWith('/services/')) {
            const serviceName = location.pathname.split('/services/')[1]
              ?.replace(/-/g, ' ')
              ?.replace(/\b\w/g, l => l.toUpperCase());
            breadcrumbs.push({
              label: serviceName || 'Service',
              current: true
            });
          } else if (location.pathname.startsWith('/neighborhoods/')) {
            const neighborhoodName = location.pathname.split('/neighborhoods/')[1]
              ?.replace(/-/g, ' ')
              ?.replace(/\b\w/g, l => l.toUpperCase());
            breadcrumbs.push({
              label: neighborhoodName || 'Neighborhood',
              icon: <MapPin className="w-4 h-4" />,
              current: true
            });
          }
          break;
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs if there's only one item and it's the current page
  if (breadcrumbs.length <= 1 && location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                )}
                
                {item.current ? (
                  <span className="flex items-center text-gray-900 font-medium">
                    {item.icon && <span className="mr-2 text-gray-500">{item.icon}</span>}
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    to={item.href}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center text-gray-600">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
          
          {/* Location indicator */}
          <div className="ml-auto hidden sm:flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{city}, {state}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;