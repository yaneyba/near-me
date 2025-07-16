import { useMemo } from 'react';
import subdomainConfig from '../../config/subdomain-generation.json';

interface FooterLink {
  label: string;
  url: string;
  category: string;
}

interface FooterConfig {
  serviceLinks: FooterLink[];
  waterLinks: FooterLink[];
  allCategories: string[];
}

/**
 * Hook that provides footer links based on the subdomain generation configuration
 * This ensures the footer stays in sync with the actual generated subdomains
 */
export const useFooterConfig = (): FooterConfig => {
  return useMemo(() => {
    const serviceLinks: FooterLink[] = [];
    const waterLinks: FooterLink[] = [];
    const allCategories: string[] = [];

    // Helper function to process categories
    const processCategories = (categories: string[], isWaterCategory = false) => {
      categories.forEach(category => {
        allCategories.push(category);
        const link: FooterLink = {
          label: formatCategoryLabel(category),
          url: `https://${category}.near-me.us`,
          category
        };
        
        if (isWaterCategory) {
          waterLinks.push(link);
        } else {
          serviceLinks.push(link);
        }
      });
    };

    // Process all layouts dynamically
    Object.entries(subdomainConfig.layouts).forEach(([layoutKey, layout]) => {
      if (layout?.generateHTML && layout.categories) {
        const isWaterCategory = layoutKey === 'water';
        processCategories(layout.categories, isWaterCategory);
      }
    });

    return {
      serviceLinks,
      waterLinks,
      allCategories
    };
  }, []);
};

/**
 * Convert category slug to display label
 * e.g., "nail-salons" -> "Nail Salons"
 */
function formatCategoryLabel(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
