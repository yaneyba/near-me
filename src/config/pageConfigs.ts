// Page section configurations for different page types
interface SectionConfig {
  about?: {
    title: string | ((category: string, city: string) => string);
    description: string | ((category: string, city: string, state: string) => string);
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    ctaText?: string;
    showTestimonials?: boolean;
  };
  contact?: {
    title: string | ((category: string, city: string) => string);
    description: string | ((category: string, city: string, state: string) => string);
    supportEmail?: string;
    businessHours?: string;
    showBusinessForm?: boolean;
    formFields?: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'select' | 'textarea';
      required: boolean;
      options?: string[];
    }>;
  };
  pricing?: {
    title: string;
    description: string;
    showPlans?: boolean;
    customPlans?: Array<{
      name: string;
      price: string;
      features: string[];
      highlighted?: boolean;
    }>;
  };
  business?: {
    title: string | ((category: string, city: string) => string);
    subtitle: string | ((category: string, city: string, state: string) => string);
    benefits: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    ctaText?: string;
    showPricing?: boolean;
  };
}

export const pageConfigs: Record<string, SectionConfig> = {
  // Default business listing configuration
  business: {
    about: {
      title: (category: string, city: string) => `About ${city} ${category}`,
      description: (category: string, city: string, state: string) => 
        `Your trusted directory for finding quality ${category.toLowerCase()} in ${city}, ${state}. We connect customers with verified local businesses.`,
      features: [
        {
          icon: 'Users',
          title: 'Local Focus',
          description: 'We specialize in connecting you with local businesses in your community.'
        },
        {
          icon: 'Target',
          title: 'Quality Verified',
          description: 'All listed businesses are verified and reviewed for quality and reliability.'
        },
        {
          icon: 'Award',
          title: 'Top Rated',
          description: 'Only the highest-rated businesses make it to our featured listings.'
        }
      ],
      showTestimonials: true
    },
    contact: {
      title: (category: string, city: string) => `Contact ${city} ${category} Directory`,
      description: (category: string, city: string, state: string) => 
        `Get in touch with us about ${category.toLowerCase()} in ${city}, ${state}. We're here to help connect you with the right business.`,
      showBusinessForm: true,
      formFields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'business', label: 'Business Name', type: 'text', required: false },
        { name: 'subject', label: 'Subject', type: 'select', required: true, 
          options: ['General Inquiry', 'List My Business', 'Report Issue', 'Partnership'] },
        { name: 'message', label: 'Message', type: 'textarea', required: true }
      ]
    },
    business: {
      title: (category: string, city: string) => `Grow Your ${category} Business in ${city}`,
      subtitle: (category: string, city: string, state: string) => 
        `Join our directory and connect with customers looking for ${category.toLowerCase()} in ${city}, ${state}.`,
      benefits: [
        {
          icon: 'TrendingUp',
          title: 'Increase Visibility',
          description: 'Get discovered by customers actively searching for your services.'
        },
        {
          icon: 'Star',
          title: 'Build Reputation',
          description: 'Showcase your reviews and build trust with potential customers.'
        },
        {
          icon: 'Shield',
          title: 'Verified Listing',
          description: 'Stand out with our verified business badge and quality assurance.'
        }
      ],
      ctaText: 'List Your Business',
      showPricing: true
    },
    pricing: {
      title: 'Simple, Transparent Pricing',
      description: 'Choose the plan that works best for your business growth.',
      showPlans: true
    }
  },

  // Water refill station configuration
  'water-refill': {
    about: {
      title: () => 'About Our Water Refill Station Directory',
      description: () => 
        'The most comprehensive directory of water refill stations nationwide. Find clean, affordable water sources while reducing plastic waste.',
      features: [
        {
          icon: 'Droplets',
          title: 'Quality Water',
          description: 'All stations provide filtered, purified water that meets safety standards.'
        },
        {
          icon: 'DollarSign',
          title: 'Affordable Pricing',
          description: 'Save money with competitive refill prices, typically under $0.50 per gallon.'
        },
        {
          icon: 'Recycle',
          title: 'Eco-Friendly',
          description: 'Reduce plastic waste by refilling your own containers instead of buying bottles.'
        }
      ],
      showTestimonials: true
    },
    contact: {
      title: () => 'Contact Water Refill Directory',
      description: () => 
        'Have questions about water refill stations or want to list your station? We\'re here to help.',
      showBusinessForm: true,
      formFields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'station', label: 'Station Name', type: 'text', required: false },
        { name: 'subject', label: 'Subject', type: 'select', required: true, 
          options: ['General Inquiry', 'List My Station', 'Report Station Issue', 'Water Quality Concern', 'Partnership'] },
        { name: 'location', label: 'Station Location (if applicable)', type: 'text', required: false },
        { name: 'message', label: 'Message', type: 'textarea', required: true }
      ]
    },
    business: {
      title: () => 'List Your Water Refill Station',
      subtitle: () => 
        'Connect with customers looking for clean, affordable water refill options in their area.',
      benefits: [
        {
          icon: 'MapPin',
          title: 'Local Discovery',
          description: 'Help customers find your station when they need water refills nearby.'
        },
        {
          icon: 'Users',
          title: 'Growing Community',
          description: 'Join a community of eco-conscious businesses reducing plastic waste.'
        },
        {
          icon: 'BarChart',
          title: 'Business Analytics',
          description: 'Track visits and engagement to understand your customer base better.'
        }
      ],
      ctaText: 'List Your Station',
      showPricing: true
    },
    pricing: {
      title: 'Water Station Listing Plans',
      description: 'Affordable plans to help your water refill station reach more customers.',
      showPlans: true,
      customPlans: [
        {
          name: 'Basic Listing',
          price: 'Free',
          features: ['Basic station information', 'Location on map', 'Operating hours', 'Contact details'],
          highlighted: false
        },
        {
          name: 'Premium Station',
          price: '$19/month',
          features: ['Everything in Basic', 'Featured placement', 'Photos gallery', 'Customer reviews', 'Priority support'],
          highlighted: true
        },
        {
          name: 'Enterprise',
          price: '$49/month',
          features: ['Everything in Premium', 'Multiple locations', 'Analytics dashboard', 'Custom branding', 'API access'],
          highlighted: false
        }
      ]
    }
  }
};

// Helper function to get page config
export const getPageConfig = (category: string): SectionConfig => {
  return pageConfigs[category] || pageConfigs.business;
};
