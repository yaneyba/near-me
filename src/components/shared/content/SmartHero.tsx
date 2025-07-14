import React from 'react';
import { Business } from '@/types';
import Hero from './Hero';

interface SmartHeroProps {
  category: string;
  city: string;
  state: string;
  businesses: Business[];
  onSearch: (query: string) => void;
  customConfig?: any;
  dbStats?: {
    totalBusinesses: number;
    totalCategories: number;
    totalCities: number;
    premiumBusinesses: number;
    averageRating: string;
  } | null;
}

const SmartHero: React.FC<SmartHeroProps> = ({ 
  category, 
  city, 
  state, 
  businesses, 
  onSearch,
  dbStats 
}) => {
  return (
    <Hero
      category={category}
      city={city}
      state={state}
      businesses={businesses}
      onSearch={onSearch}
      dbStats={dbStats || undefined}
    />
  );
};

export default SmartHero;
