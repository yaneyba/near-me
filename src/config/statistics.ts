/**
 * Centralized statistics configuration
 * Update these values regularly to maintain accuracy and credibility
 * Last updated: July 12, 2025
 */

export interface StatisticsConfig {
  waterRefill: {
    verifiedStations: number;
    citiesCovered: number;
    averagePricePerGallon: string;
    customerSatisfaction: number;
    monthlySearches: string;
    averageRating: string;
    listedStations: number;
  };
  general: {
    totalBusinesses: number;
    categories: number;
    cities: number;
    defaultBusinessCount: number; // Fallback when dynamic count fails
    fallbackCategories: string[]; // Fallback categories when API fails
    fallbackCities: string[]; // Fallback cities when API fails
  };
  contact: {
    phone: string;
    phoneFormatted: string;
    email: {
      privacy: string;
      legal: string;
      support: string;
    };
    address: {
      street: string;
      suite: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
}

export const STATISTICS: StatisticsConfig = {
  waterRefill: {
    verifiedStations: 486,
    citiesCovered: 12,
    averagePricePerGallon: '$0.25',
    customerSatisfaction: 94,
    monthlySearches: '3.2K+',
    averageRating: '4.6',
    listedStations: 486,
  },
  general: {
    totalBusinesses: 1250,
    categories: 5,
    cities: 12,
    defaultBusinessCount: 25,
    fallbackCategories: ['nail-salons', 'barbershops', 'auto-repair', 'restaurants', 'water-refill'],
    fallbackCities: ['san-francisco', 'los-angeles', 'san-diego', 'san-jose', 'sacramento'],
  },
  contact: {
    phone: '+14692051200',
    phoneFormatted: '(469) 205-1200',
    email: {
      privacy: 'privacy@near-me.us',
      legal: 'legal@near-me.us',
      support: 'support@near-me.us',
    },
    address: {
      street: '2323 Bryan St',
      suite: 'Suite 900',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
    },
  },
};

/**
 * Helper functions to format statistics for display
 */
export const formatStatistic = (value: number, suffix: string = ''): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${suffix}`;
  }
  return `${value}${suffix}`;
};

export const getFormattedAddress = (department?: string): string => {
  const { address } = STATISTICS.contact;
  const lines = [
    'Near Me Directory',
    department ? `${department} Department` : '',
    `${address.street}, ${address.suite}`,
    `${address.city}, ${address.state} ${address.zipCode}`,
  ].filter(Boolean);
  
  return lines.join('\n');
};

/**
 * Dynamic statistics that can be calculated from real data
 * These should eventually replace the static values above
 */
export interface DynamicStatistics {
  actualBusinessCount?: number;
  actualCityCount?: number;
  actualCategoryCount?: number;
  lastUpdated?: string;
}

let dynamicStats: DynamicStatistics = {};

export const updateDynamicStatistics = (stats: DynamicStatistics) => {
  dynamicStats = { ...dynamicStats, ...stats, lastUpdated: new Date().toISOString() };
};

export const getDynamicStatistics = (): DynamicStatistics => dynamicStats;

/**
 * Get statistics with dynamic fallbacks
 */
export const getStatistics = (): StatisticsConfig => {
  const dynamic = getDynamicStatistics();
  
  return {
    ...STATISTICS,
    waterRefill: {
      ...STATISTICS.waterRefill,
      verifiedStations: dynamic.actualBusinessCount || STATISTICS.waterRefill.verifiedStations,
      citiesCovered: dynamic.actualCityCount || STATISTICS.waterRefill.citiesCovered,
    },
    general: {
      ...STATISTICS.general,
      totalBusinesses: dynamic.actualBusinessCount || STATISTICS.general.totalBusinesses,
      cities: dynamic.actualCityCount || STATISTICS.general.cities,
      categories: dynamic.actualCategoryCount || STATISTICS.general.categories,
    },
  };
};
