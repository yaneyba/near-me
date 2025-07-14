// Single Source of Truth for contact information across subdomains

export interface ContactInfo {
  email: string;
}

// Default contact information
export const defaultContactInfo: ContactInfo = {
  email: 'legal@near-me.us'
};

// Water refill specific contact information
export const waterRefillContactInfo: ContactInfo = {
  email: 'legal@aquafinder.near-me.us'
};

// Function to get contact info based on subdomain
export const getContactInfo = (category?: string): ContactInfo => {
  switch (category) {
    case 'water-refill':
      return waterRefillContactInfo;
    default:
      return defaultContactInfo;
  }
};
