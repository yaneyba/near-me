import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail, Plus, User, LogIn, LogOut } from 'lucide-react';
import { SITE_INFO } from '../siteInfo';
import { signOut, useAuth } from '../lib/auth';
// Force refresh

interface HeaderProps {
  category: string;
  city: string;
  state: string;
}

const Header: React.FC<HeaderProps> = ({ category, city, state }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  // Check if we're on the add-business page
  const isAddBusinessPage = location.pathname === '/add-business';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if user is admin
  const isAdmin = user?.isAdmin;

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
                <span>{SITE_INFO.phone}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>{SITE_INFO.email}</span>
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
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                <span className="text-blue-600">{city}</span>
                <span className="text-gray-600 ml-1 text-lg">{category}</span>
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActivePage('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse {category}
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                isActivePage('/about') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${
                isActivePage('/contact') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
            {/* Hide Add Business button when on add-business page */}
            {!isAddBusinessPage && (
              <Link 
                to="/add-business" 
                className="flex items-center font-medium transition-all duration-200 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your Business
              </Link>
            )}
            
            {/* Auth links */}
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center font-semibold transition-all duration-200 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/business/dashboard" 
                    className="flex items-center font-medium transition-all duration-200 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center font-medium transition-all duration-200 px-3 py-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50"
                  title="Sign out of current account"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center font-medium transition-colors px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Sign In
              </Link>
            )}
          </nav>

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
            {/* Mobile navigation */}
            <Link
              to="/"
              className={`block px-3 py-2 font-medium ${
                isActivePage('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Browse {category}
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 font-medium ${
                isActivePage('/about') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 font-medium ${
                isActivePage('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {/* Hide Add Business button when on add-business page */}
            {!isAddBusinessPage && (
              <Link
                to="/add-business"
                className="flex items-center px-3 py-3 mb-2 font-medium bg-blue-600 text-white rounded-lg mx-2 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="w-4 h-4 mr-3" />
                Add Your Business
              </Link>
            )}
            
            {/* Auth links for mobile */}
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-3 mb-2 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/business/dashboard"
                    className="flex items-center px-3 py-3 mb-2 font-medium bg-emerald-50 text-emerald-700 rounded-lg mx-2 border border-emerald-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                )}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-2 font-medium text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;