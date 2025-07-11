import React from 'react';
import { MapPin, Star } from 'lucide-react';
import SearchWithLiveResults from '@/components/SearchWithLiveResults';
import { Business } from '@/types';
import stats from '@/data/stats.json';

interface HeroProps {
  category: string;
  city: string;
  state: string;
  businesses: Business[];
  onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ category, city, state, businesses, onSearch }) => {
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
          <SearchWithLiveResults
            businesses={businesses}
            category={category}
            city={city}
            onSearch={onSearch}
            className="mb-4"
          />
          
          {/* Search Tips */}
          <div className="text-center text-blue-200 text-sm">
            <p>💡 Try searching by business name, service, or neighborhood</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat: { label: string; value: string; icon?: string }) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              {stat.icon === 'star' ? (
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-yellow-400 fill-current" />
                  <span className="text-3xl font-bold ml-2">{stat.value}</span>
                </div>
              ) : (
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
              )}
              <div className="text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;