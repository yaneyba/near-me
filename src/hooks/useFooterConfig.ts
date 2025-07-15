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

    // Process services layout
    if (subdomainConfig.layouts.services?.generateHTML) {
      subdomainConfig.layouts.services.categories.forEach(category => {
        allCategories.push(category);
        serviceLinks.push({
          label: formatCategoryLabel(category),
          url: `https://${category}.near-me.us`,
          category
        });
      });
    }

    // Process water layout
    if (subdomainConfig.layouts.water?.generateHTML) {
      subdomainConfig.layouts.water.categories.forEach(category => {
        allCategories.push(category);
        waterLinks.push({
          label: formatCategoryLabel(category),
          url: `https://${category}.near-me.us`,
          category
        });
      });
    }

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
