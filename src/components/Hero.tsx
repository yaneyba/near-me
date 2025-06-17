import React from 'react';
import { Search, MapPin, Star } from 'lucide-react';

interface HeroProps {
  category: string;
  city: string;
  state: string;
  onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ category, city, state, onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Best {category} in <span className="text-blue-300">{city}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-2">
            Discover top-rated {category.toLowerCase()} in {city}, {state}
          </p>
          <div className="flex items-center justify-center text-blue-200 text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{city}, {state}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${category.toLowerCase()} in ${city}...`}
                className="w-full pl-12 pr-32 py-4 text-lg rounded-full border-0 shadow-lg focus:ring-4 focus:ring-blue-300/50 focus:outline-none text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-emerald-300/50 focus:outline-none"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Local Businesses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              <span className="text-3xl font-bold ml-2">4.8</span>
            </div>
            <div className="text-blue-200">Average Rating</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;