import React from 'react';
import { MapPin, Phone, Clock, Facebook, Twitter, Instagram, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFooterConfig } from '../hooks/useFooterConfig';

/**
 * Configuration-Driven Footer Component
 * 
 * PHILOSOPHY: Footer links are generated from subdomain-generation.json
 * - Dynamic links based on actual configuration
 * - No hardcoded category or subdomain links
 * - Stays in sync with generated HTML pages
 * - SEO-friendly with consistent internal linking
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { serviceLinks, waterLinks } = useFooterConfig();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Near Me Directory</h3>
            <p className="text-gray-400">
              Find trusted local businesses across the United States. 
              Connecting you with verified services in your area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Popular Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Popular Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.category}>
                  <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Water Refill Stations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Water Refill Stations</h4>
            <ul className="space-y-2">
              {waterLinks.map((link) => (
                <li key={link.category}>
                  <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business-owners" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  For Business Owners
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Sitemap
                </Link>
              </li>
              <li>
                <div className="text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  24/7 Online Directory
                </div>
              </li>
            </ul>
            
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Business Hours Vary by Location
              </p>
              <p className="text-sm text-gray-400">
                Contact businesses directly for current information.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Near Me Directory. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link to="/business-owners" className="text-gray-400 hover:text-white transition-colors">
                For Business Owners
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;