import React from 'react';
import { Business } from '@/types';
import ConfigurableHero from './ConfigurableHero';
import { getHeroConfig } from '@/config/heroConfigs';

interface SmartHeroProps {
  category: string;
  city: string;
  state: string;
  businesses: Business[];
  onSearch: (query: string) => void;
  customConfig?: any;
}

const SmartHero: React.FC<SmartHeroProps> = ({ 
  category, 
  city, 
  state, 
  businesses, 
  onSearch,
  customConfig 
}) => {
  const heroConfig = getHeroConfig(category, customConfig);
  
  // Build the configuration object with resolved functions
  const resolvedConfig = {
    title: typeof heroConfig.title === 'function' 
      ? heroConfig.title(category, city) 
      : heroConfig.title,
    subtitle: typeof heroConfig.subtitle === 'function' 
      ? heroConfig.subtitle(category, city, state) 
      : heroConfig.subtitle,
    searchPlaceholder: heroConfig.searchPlaceholder,
    searchTip: heroConfig.searchTip,
    gradient: heroConfig.gradient,
    showStats: heroConfig.showStats,
    showLocation: heroConfig.showLocation,
    stats: heroConfig.stats || []
  };

  return (
    <ConfigurableHero
      category={category}
      city={city}
      state={state}
      businesses={businesses}
      onSearch={onSearch}
      config={resolvedConfig}
    />
  );
};

export default SmartHero;
