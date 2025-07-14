// Hero configurations for different page types

interface HeroConfig {
  title: string | ((category: string, city: string) => string);
  subtitle: string | ((category: string, city: string, state: string) => string);
  searchPlaceholder: string;
  searchTip: string;
  gradient: string;
  showStats: boolean;
  showLocation: boolean;
  stats?: Array<{ label: string; value: string; icon?: string }>;
}

export const heroConfigs: Record<string, HeroConfig> = {
  // Default business listing configuration
  business: {
    title: (category: string, city: string) => `Best ${category} in ${city}`,
    subtitle: (category: string, city: string, state: string) => 
      `Discover top-rated ${category.toLowerCase()} in ${city}, ${state}`,
    searchPlaceholder: "Search by business name, service, or neighborhood...",
    searchTip: "💡 Try searching by business name, service, or neighborhood",
    gradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
    showStats: true,
    showLocation: true
  },

  // Water refill station configuration
  'water-refill': {
    title: () => "Find Quality Water Refill Stations Near You",
    subtitle: () => "Discover clean, affordable water refill locations in your area. Save money and reduce plastic waste with our comprehensive directory.",
    searchPlaceholder: "Search by city, zip code, or station name...",
    searchTip: "💡 Try searching by business name, service, or neighborhood",
    gradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
    showStats: true,
    showLocation: false,
    stats: [
      { label: "Stations", value: "500+" },
      { label: "Cities Covered", value: "50+" },
      { label: "Average Price/Gallon", value: "$0.25" },
      { label: "Customer Satisfaction", value: "98%" }
    ]
  },

  // Food delivery configuration (example for future use)
  'food-delivery': {
    title: (_category: string, city: string) => `Fast Food Delivery in ${city}`,
    subtitle: (_category: string, city: string, state: string) => 
      `Get your favorite meals delivered fast in ${city}, ${state}`,
    searchPlaceholder: "Search restaurants, cuisines, or dishes...",
    searchTip: "🍕 Search by restaurant name, cuisine type, or specific dishes",
    gradient: "bg-gradient-to-br from-orange-600 via-red-700 to-pink-800",
    showStats: true,
    showLocation: true
  },

  // Healthcare configuration (example for future use)
  healthcare: {
    title: (_category: string, city: string) => `Healthcare Services in ${city}`,
    subtitle: (_category: string, city: string, state: string) => 
      `Find trusted healthcare providers in ${city}, ${state}`,
    searchPlaceholder: "Search by specialty, doctor name, or condition...",
    searchTip: "🏥 Search by medical specialty, doctor name, or health condition",
    gradient: "bg-gradient-to-br from-green-600 via-teal-700 to-blue-800",
    showStats: true,
    showLocation: true
  }
};

// Helper function to get hero config for a category
export const getHeroConfig = (category: string, customConfig?: Partial<HeroConfig>) => {
  // Get base config, fallback to business config if category not found
  const baseConfig = heroConfigs[category] || heroConfigs.business;
  
  // Merge with custom config if provided
  if (customConfig) {
    return { ...baseConfig, ...customConfig };
  }
  
  return baseConfig;
};
