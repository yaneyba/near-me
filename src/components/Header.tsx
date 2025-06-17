import React, { useState } from 'react';
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react';
import SearchWithLiveResults from './SearchWithLiveResults';
import { Business } from '../types';

interface HeaderProps {
  category: string;
  city: string;
  state: string;
  businesses: Business[];
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ category, city, state, businesses, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Serving {city}, {state}</span>
              </div>
              <div className="hidden sm:flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span>(555) 123-4567</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>info@near-me.us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">{city}</span>
                <span className="text-gray-600 ml-1 text-lg">{category}</span>
              </h1>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#businesses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Browse {category}
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Search bar - Desktop */}
          <div className="hidden lg:block">
            <SearchWithLiveResults
              businesses={businesses}
              category={category}
              city={city}
              onSearch={onSearch}
              className="w-80"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile search */}
            <div className="mb-4">
              <SearchWithLiveResults
                businesses={businesses}
                category={category}
                city={city}
                onSearch={onSearch}
              />
            </div>

            {/* Mobile navigation */}
            <a
              href="#businesses"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse {category}
            </a>
            <a
              href="#services"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOne(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;