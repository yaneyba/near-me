// src/config/subdomainExceptions.ts

export interface SpecialService {
  subdomain: string;
  category: string;
  isPathBased?: boolean;
  isWaterRefill?: boolean;
  isSeniorCare?: boolean;
  isServices?: boolean;
  description: string;
}

export interface CityStateMapping {
  city: string;
  state: string;
  aliases?: string[]; // Alternative spellings or names
}

// List of special services that bypass normal validation
export const specialServices: SpecialService[] = [
  {
    subdomain: 'services.near-me.us',
    category: 'All Services',
    isServices: true,
    description: 'Main services directory and fallback page'
  },
  {
    subdomain: 'water-refill.near-me.us',
    category: 'Water Refill Stations',
    isPathBased: true,
    isWaterRefill: true,
    description: 'Water refill stations service (new service type)'
  },
  {
    subdomain: 'senior-care.near-me.us',
    category: 'Senior Care Services',
    isPathBased: true,
    isSeniorCare: true,
    description: 'Senior care services directory with CareFinder branding'
  }
];

// List of domains that should always redirect to services
export const blockedSubdomains: string[] = [
  'admin.near-me.us',
  'api.near-me.us',
  'www.near-me.us',
  'mail.near-me.us',
  'ftp.near-me.us',
  'test.near-me.us',
  'dev.near-me.us',
  'staging.near-me.us'
];

// Comprehensive city-to-state mapping
// This replaces the hard-coded cityStateMap in subdomainParser.ts
export const cityStateMappings: CityStateMapping[] = [
  // Texas
  { city: 'dallas', state: 'Texas' },
  { city: 'garland', state: 'Texas' },
  { city: 'austin', state: 'Texas' },
  { city: 'houston', state: 'Texas' },
  { city: 'frisco', state: 'Texas' },
  { city: 'san-antonio', state: 'Texas', aliases: ['san-antonio', 'sanantonio'] },
  { city: 'fort-worth', state: 'Texas', aliases: ['fort-worth', 'fortworth'] },
  { city: 'el-paso', state: 'Texas', aliases: ['el-paso', 'elpaso'] },
  { city: 'arlington', state: 'Texas' },
  { city: 'corpus-christi', state: 'Texas', aliases: ['corpus-christi', 'corpuschristi'] },
  
  // California
  { city: 'san-francisco', state: 'California', aliases: ['san-francisco', 'sanfrancisco', 'sf'] },
  { city: 'los-angeles', state: 'California', aliases: ['los-angeles', 'losangeles', 'la'] },
  { city: 'san-diego', state: 'California', aliases: ['san-diego', 'sandiego'] },
  { city: 'san-jose', state: 'California', aliases: ['san-jose', 'sanjose'] },
  { city: 'fresno', state: 'California' },
  { city: 'sacramento', state: 'California' },
  { city: 'long-beach', state: 'California', aliases: ['long-beach', 'longbeach'] },
  { city: 'oakland', state: 'California' },
  { city: 'bakersfield', state: 'California' },
  { city: 'anaheim', state: 'California' },
  
  // New York
  { city: 'new-york', state: 'New York', aliases: ['new-york', 'newyork', 'nyc'] },
  { city: 'buffalo', state: 'New York' },
  { city: 'rochester', state: 'New York' },
  { city: 'yonkers', state: 'New York' },
  { city: 'syracuse', state: 'New York' },
  { city: 'albany', state: 'New York' },
  
  // Florida
  { city: 'miami', state: 'Florida' },
  { city: 'tampa', state: 'Florida' },
  { city: 'orlando', state: 'Florida' },
  { city: 'jacksonville', state: 'Florida' },
  { city: 'st-petersburg', state: 'Florida', aliases: ['st-petersburg', 'stpetersburg'] },
  { city: 'hialeah', state: 'Florida' },
  { city: 'tallahassee', state: 'Florida' },
  { city: 'fort-lauderdale', state: 'Florida', aliases: ['fort-lauderdale', 'fortlauderdale'] },
  
  // Illinois
  { city: 'chicago', state: 'Illinois' },
  { city: 'aurora', state: 'Illinois' },
  { city: 'rockford', state: 'Illinois' },
  { city: 'joliet', state: 'Illinois' },
  { city: 'naperville', state: 'Illinois' },
  { city: 'springfield', state: 'Illinois' },
  { city: 'peoria', state: 'Illinois' },
  { city: 'elgin', state: 'Illinois' },
  
  // Pennsylvania
  { city: 'philadelphia', state: 'Pennsylvania' },
  { city: 'pittsburgh', state: 'Pennsylvania' },
  { city: 'allentown', state: 'Pennsylvania' },
  { city: 'erie', state: 'Pennsylvania' },
  { city: 'reading', state: 'Pennsylvania' },
  { city: 'scranton', state: 'Pennsylvania' },
  
  // Ohio
  { city: 'columbus', state: 'Ohio' },
  { city: 'cleveland', state: 'Ohio' },
  { city: 'cincinnati', state: 'Ohio' },
  { city: 'toledo', state: 'Ohio' },
  { city: 'akron', state: 'Ohio' },
  { city: 'dayton', state: 'Ohio' },
  
  // Georgia
  { city: 'atlanta', state: 'Georgia' },
  { city: 'augusta', state: 'Georgia' },
  { city: 'columbus', state: 'Georgia' }, // Note: Different from Ohio Columbus
  { city: 'macon', state: 'Georgia' },
  { city: 'savannah', state: 'Georgia' },
  { city: 'athens', state: 'Georgia' },
  
  // North Carolina
  { city: 'charlotte', state: 'North Carolina' },
  { city: 'raleigh', state: 'North Carolina' },
  { city: 'greensboro', state: 'North Carolina' },
  { city: 'durham', state: 'North Carolina' },
  { city: 'winston-salem', state: 'North Carolina', aliases: ['winston-salem', 'winstonsalem'] },
  { city: 'fayetteville', state: 'North Carolina' },
  
  // Michigan
  { city: 'detroit', state: 'Michigan' },
  { city: 'grand-rapids', state: 'Michigan', aliases: ['grand-rapids', 'grandrapids'] },
  { city: 'warren', state: 'Michigan' },
  { city: 'sterling-heights', state: 'Michigan', aliases: ['sterling-heights', 'sterlingheights'] },
  { city: 'lansing', state: 'Michigan' },
  { city: 'ann-arbor', state: 'Michigan', aliases: ['ann-arbor', 'annarbor'] },
  
  // Other major cities
  { city: 'denver', state: 'Colorado' },
  { city: 'phoenix', state: 'Arizona' },
  { city: 'seattle', state: 'Washington' },
  { city: 'portland', state: 'Oregon' },
  { city: 'boston', state: 'Massachusetts' },
  { city: 'las-vegas', state: 'Nevada', aliases: ['las-vegas', 'lasvegas'] },
  { city: 'baltimore', state: 'Maryland' },
  { city: 'milwaukee', state: 'Wisconsin' },
  { city: 'kansas-city', state: 'Missouri', aliases: ['kansas-city', 'kansascity'] },
  { city: 'nashville', state: 'Tennessee' },
  { city: 'memphis', state: 'Tennessee' },
  { city: 'louisville', state: 'Kentucky' },
  { city: 'oklahoma-city', state: 'Oklahoma', aliases: ['oklahoma-city', 'oklahomacity'] },
  { city: 'tucson', state: 'Arizona' },
  { city: 'mesa', state: 'Arizona' },
  { city: 'virginia-beach', state: 'Virginia', aliases: ['virginia-beach', 'virginiabeach'] },
  { city: 'atlanta', state: 'Georgia' },
  { city: 'colorado-springs', state: 'Colorado', aliases: ['colorado-springs', 'coloradosprings'] },
  { city: 'omaha', state: 'Nebraska' },
  { city: 'raleigh', state: 'North Carolina' },
  { city: 'miami', state: 'Florida' },
  { city: 'minneapolis', state: 'Minnesota' },
  { city: 'tulsa', state: 'Oklahoma' },
  { city: 'cleveland', state: 'Ohio' },
  { city: 'wichita', state: 'Kansas' },
  { city: 'new-orleans', state: 'Louisiana', aliases: ['new-orleans', 'neworleans'] }
];

// Create a fast lookup map for city-to-state resolution
const cityStateLookup: Record<string, string> = {};
cityStateMappings.forEach(mapping => {
  // Add primary city name
  cityStateLookup[mapping.city.toLowerCase()] = mapping.state;
  
  // Add aliases if they exist
  if (mapping.aliases) {
    mapping.aliases.forEach(alias => {
      cityStateLookup[alias.toLowerCase()] = mapping.state;
    });
  }
});

// Helper function to check if a subdomain is a special service
export const isSpecialService = (hostname: string): SpecialService | null => {
  return specialServices.find(service => 
    hostname === service.subdomain || hostname.includes(service.subdomain)
  ) || null;
};

// Helper function to check if a subdomain should be blocked
export const isBlockedSubdomain = (hostname: string): boolean => {
  return blockedSubdomains.some(blocked => 
    hostname === blocked || hostname.includes(blocked)
  );
};

// Helper function to get state from city name (with alias support)
export const getCityState = (city: string): string => {
  const normalizedCity = city.toLowerCase().trim();
  return cityStateLookup[normalizedCity] || 'Unknown State';
};

// Helper function to check if a city is supported
export const isSupportedCity = (city: string): boolean => {
  const normalizedCity = city.toLowerCase().trim();
  return normalizedCity in cityStateLookup;
};

// Helper function to add new city-state mapping
export const addCityStateMapping = (mapping: CityStateMapping): void => {
  // Add to the main array
  const existingIndex = cityStateMappings.findIndex(m => m.city.toLowerCase() === mapping.city.toLowerCase());
  if (existingIndex >= 0) {
    // Update existing mapping
    cityStateMappings[existingIndex] = mapping;
  } else {
    // Add new mapping
    cityStateMappings.push(mapping);
  }
  
  // Update the lookup map
  cityStateLookup[mapping.city.toLowerCase()] = mapping.state;
  if (mapping.aliases) {
    mapping.aliases.forEach(alias => {
      cityStateLookup[alias.toLowerCase()] = mapping.state;
    });
  }
};

// Helper function to add new special services programmatically
export const addSpecialService = (service: SpecialService): void => {
  if (!specialServices.find(s => s.subdomain === service.subdomain)) {
    specialServices.push(service);
  }
};

// Helper function to add blocked subdomains programmatically
export const addBlockedSubdomain = (subdomain: string): void => {
  if (!blockedSubdomains.includes(subdomain)) {
    blockedSubdomains.push(subdomain);
  }
};

// Helper function to get all supported cities for a given state
export const getCitiesForState = (state: string): string[] => {
  return cityStateMappings
    .filter(mapping => mapping.state === state)
    .map(mapping => mapping.city);
};

// Helper function to get all supported states
export const getAllStates = (): string[] => {
  return Array.from(new Set(cityStateMappings.map(mapping => mapping.state))).sort();
};

// Helper function to get all supported cities
export const getAllCities = (): string[] => {
  return cityStateMappings.map(mapping => mapping.city).sort();
};

// Helper function to search cities by partial name
export const searchCities = (query: string): CityStateMapping[] => {
  const normalizedQuery = query.toLowerCase().trim();
  return cityStateMappings.filter(mapping => 
    mapping.city.toLowerCase().includes(normalizedQuery) ||
    (mapping.aliases && mapping.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery)))
  );
};

// Export the lookup map for backward compatibility with subdomainParser.ts
export const cityStateMap = cityStateLookup;
