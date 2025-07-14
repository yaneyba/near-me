import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Simple, Static Footer Component - ZERO API calls, instant rendering
 * 
 * PHILOSOPHY: Footer should be the same on every page
 * - Static links that don't change based on current route
 * - No data fetching or complex business logic
 * - Instant rendering, fully cacheable
 * - SEO-friendly with consistent internal linking
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Popular Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Popular Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/nail-salons" className="text-gray-400 hover:text-white transition-colors">
                  Nail Salons
                </Link>
              </li>
              <li>
                <Link to="/barbershops" className="text-gray-400 hover:text-white transition-colors">
                  Barbershops
                </Link>
              </li>
              <li>
                <Link to="/auto-repair" className="text-gray-400 hover:text-white transition-colors">
                  Auto Repair
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/hair-salons" className="text-gray-400 hover:text-white transition-colors">
                  Hair Salons
                </Link>
              </li>
              <li>
                <Link to="/dentists" className="text-gray-400 hover:text-white transition-colors">
                  Dentists
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Popular Cities</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/san-francisco" className="text-gray-400 hover:text-white transition-colors">
                  San Francisco
                </Link>
              </li>
              <li>
                <Link to="/los-angeles" className="text-gray-400 hover:text-white transition-colors">
                  Los Angeles
                </Link>
              </li>
              <li>
                <Link to="/chicago" className="text-gray-400 hover:text-white transition-colors">
                  Chicago
                </Link>
              </li>
              <li>
                <Link to="/dallas" className="text-gray-400 hover:text-white transition-colors">
                  Dallas
                </Link>
              </li>
              <li>
                <Link to="/miami" className="text-gray-400 hover:text-white transition-colors">
                  Miami
                </Link>
              </li>
              <li>
                <Link to="/seattle" className="text-gray-400 hover:text-white transition-colors">
                  Seattle
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business-owners" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
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