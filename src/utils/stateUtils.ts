/**
 * Utility functions for handling US state names and abbreviations
 */

/**
 * Map of state abbreviations to full names
 * Single source of truth for state data
 */
const STATE_MAP: Record<string, string> = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
};

/**
 * Reverse map: Full state names to abbreviations
 * Generated from STATE_MAP to avoid duplication
 */
const REVERSE_STATE_MAP: Record<string, string> = Object.entries(STATE_MAP).reduce(
  (acc, [abbr, fullName]) => {
    acc[fullName] = abbr;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Normalizes state names to their standard abbreviations
 * @param state - The state name (full name or abbreviation)
 * @returns The standardized state abbreviation
 */
export function normalizeStateName(state: string): string {
  // If it's already an abbreviation (2 chars and exists in map), return it
  if (state.length === 2 && STATE_MAP[state.toUpperCase()]) {
    return state.toUpperCase();
  }

  // Check if it's a full name
  const normalized = REVERSE_STATE_MAP[state];
  if (normalized) {
    return normalized;
  }

  // If not found, return original (might be invalid, but preserve it)
  return state;
}

/**
 * Gets the full state name from abbreviation
 * @param abbreviation - The state abbreviation
 * @returns The full state name or the abbreviation if not found
 */
export function getFullStateName(abbreviation: string): string {
  const fullName = STATE_MAP[abbreviation.toUpperCase()];
  return fullName || abbreviation;
}

/**
 * Check if a string is a valid US state abbreviation
 * @param abbreviation - The string to check
 * @returns True if valid state abbreviation
 */
export function isValidStateAbbreviation(abbreviation: string): boolean {
  return abbreviation.length === 2 && STATE_MAP[abbreviation.toUpperCase()] !== undefined;
}

/**
 * Check if a string is a valid US state full name
 * @param stateName - The string to check
 * @returns True if valid state name
 */
export function isValidStateName(stateName: string): boolean {
  return REVERSE_STATE_MAP[stateName] !== undefined;
}

/**
 * Get all state abbreviations
 * @returns Array of all state abbreviations
 */
export function getAllStateAbbreviations(): string[] {
  return Object.keys(STATE_MAP);
}

/**
 * Get all state full names
 * @returns Array of all state full names
 */
export function getAllStateNames(): string[] {
  return Object.values(STATE_MAP);
}
