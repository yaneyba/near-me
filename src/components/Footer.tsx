import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import businessesData from '../data/businesses.json';
import { Business } from '../types';

interface FooterProps {
  category: string;
  city: string;
  state: string;
}

const Footer: React.FC<FooterProps> = ({ category, city, state }) => {
  const currentYear = new Date().getFullYear();
  const businesses: Business[] = businessesData;

  // Get unique categories that actually exist in the data
  const getExistingCategories = (): string[] => {
    const categorySet = new Set<string>();
    businesses.forEach(business => {
      // Convert kebab-case to Title Case for display
      const displayCategory = business.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      categorySet.add(displayCategory);
    });
    return Array.from(categorySet).sort();
  };

  // Get unique cities that actually exist in the data
  const getExistingCities = (): string[] => {
    const citySet = new Set<string>();
    businesses.forEach(business => {
      // Convert kebab-case to Title Case for display
      const displayCity = business.city
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      citySet.add(displayCity);
    });
    return Array.from(citySet).sort();
  };

  const existingCategories = getExistingCategories();
  const existingCities = getExistingCities();

  const formatForUrl = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">
              {city} {category}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted directory for finding the best {category.toLowerCase()} in {city}, {state}. 
              We connect you with top-rated local businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Popular Categories - Only show existing ones */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Available Categories</h4>
            <ul className="space-y-2">
              {existingCategories.map((cat) => (
                <li key={cat}>
                  <a
                    href={`https://${formatForUrl(cat)}.${formatForUrl(city)}.near-me.us`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {cat} in {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities - Only show existing ones */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Available Cities</h4>
            <ul className="space-y-2">
              {existingCities.map((cityName) => (
                <li key={cityName}>
                  <a
                    href={`https://${formatForUrl(category)}.${formatForUrl(cityName)}.near-me.us`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {category} in {cityName}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>Serving {city}, {state}</div>
                  <div>and surrounding areas</div>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition-colors text-sm">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@near-me.us" className="text-gray-300 hover:text-white transition-colors text-sm">
                  info@near-me.us
                </a>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>Mon-Fri: 9:00 AM - 6:00 PM</div>
                  <div>Sat-Sun: 10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Near Me Directory. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </a>
              <a href="#business-owners" className="text-gray-400 hover:text-white transition-colors">
                For Business Owners
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;