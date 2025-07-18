import React from 'react';
import { MapPin } from 'lucide-react';
import { SearchWithLiveResults } from '@/components/shared/ui';
import { Business } from '@/types';

interface HeroConfig {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  searchTip?: string;
  gradient?: string;
  showStats?: boolean;
  stats?: Array<{ label: string; value: string; icon?: string }>;
  showLocation?: boolean;
}

interface ConfigurableHeroProps {
  category: string;
  city: string;
  state: string;
  businesses: Business[];
  onSearch: (query: string) => void;
  config: HeroConfig;
}

const ConfigurableHero: React.FC<ConfigurableHeroProps> = ({ 
  category, 
  city, 
  state, 
  businesses, 
  onSearch, 
  config 
}) => {
  const gradientClass = config.gradient || "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800";
  
  return (
    <div className={`relative ${gradientClass} text-white`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {config.title}
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-2">
            {config.subtitle}
          </p>
          {config.showLocation !== false && (
            <div className="flex items-center justify-center text-blue-200 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{city}, {state}</span>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <SearchWithLiveResults
            businesses={businesses}
            category={category}
            city={city}
            onSearch={onSearch}
            className="mb-4"
            placeholder={config.searchPlaceholder}
          />
          
          {/* Search Tips */}
          {config.searchTip && (
            <div className="text-center text-blue-200 text-sm">
              <p>{config.searchTip}</p>
            </div>
          )}
        </div>

        {config.showStats && config.stats && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {config.stats.map((stat: { label: string; value: string; icon?: string }) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurableHero;
