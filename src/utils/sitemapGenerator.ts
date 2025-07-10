import { Business } from '../types';
import businessesData from '../data/businesses.json';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface SitemapData {
  categories: string[];
  cities: string[];
  combinations: Array<{ category: string; city: string; state: string }>;
  businesses: Business[];
}

export class SitemapGenerator {
  private baseUrl = 'https://near-me.us';
  private businesses: Business[] = businessesData.map(b => ({
    ...b,
    website: b.website ?? null
  }));

  // City-state mapping for generating combinations
  private cityStateMap: Record<string, string> = {
    'dallas': 'Texas',
    'garland': 'Texas',
    'denver': 'Colorado',
    'austin': 'Texas',
    'houston': 'Texas',
    'phoenix': 'Arizona',
    'chicago': 'Illinois',
    'atlanta': 'Georgia',
    'miami': 'Florida',
    'seattle': 'Washington',
    'portland': 'Oregon'
  };

  /**
   * Get all unique categories from business data
   */
  private getCategories(): string[] {
    const categories = new Set<string>();
    this.businesses.forEach(business => {
      const displayCategory = this.formatForDisplay(business.category);
      categories.add(displayCategory);
    });
    return Array.from(categories).sort();
  }

  /**
   * Get all unique cities from business data
   */
  private getCities(): string[] {
    const cities = new Set<string>();
    this.businesses.forEach(business => {
      const displayCity = this.formatForDisplay(business.city);
      cities.add(displayCity);
    });
    return Array.from(cities).sort();
  }

  /**
   * Get all valid category-city combinations
   */
  private getCombinations(): Array<{ category: string; city: string; state: string }> {
    const combinations = new Set<string>();
    const result: Array<{ category: string; city: string; state: string }> = [];

    this.businesses.forEach(business => {
      const key = `${business.category}-${business.city}`;
      if (!combinations.has(key)) {
        combinations.add(key);
        result.push({
          category: this.formatForDisplay(business.category),
          city: this.formatForDisplay(business.city),
          state: this.cityStateMap[business.city] || 'Unknown'
        });
      }
    });

    return result.sort((a, b) => 
      a.category.localeCompare(b.category) || a.city.localeCompare(b.city)
    );
  }

  /**
   * Format kebab-case to display format
   */
  private formatForDisplay(text: string): string {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Format display text to URL format
   */
  private formatForUrl(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Get current date in ISO format
   */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Generate master sitemap index
   */
  generateMasterSitemap(): string {
    const sitemaps = [
      'sitemap-categories.xml',
      'sitemap-cities.xml',
      'sitemap-combinations.xml',
      'sitemap-businesses.xml'
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${this.baseUrl}/${sitemap}</loc>
    <lastmod>${this.getCurrentDate()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return xml;
  }

  /**
   * Generate categories sitemap
   */
  generateCategoriesSitemap(): string {
    const categories = this.getCategories();
    const urls: SitemapUrl[] = categories.map(category => ({
      loc: `${this.baseUrl}/categories/${this.formatForUrl(category)}`,
      lastmod: this.getCurrentDate(),
      changefreq: 'weekly',
      priority: 0.8
    }));

    return this.generateXmlSitemap(urls);
  }

  /**
   * Generate cities sitemap
   */
  generateCitiesSitemap(): string {
    const cities = this.getCities();
    const urls: SitemapUrl[] = cities.map(city => ({
      loc: `${this.baseUrl}/cities/${this.formatForUrl(city)}`,
      lastmod: this.getCurrentDate(),
      changefreq: 'weekly',
      priority: 0.8
    }));

    return this.generateXmlSitemap(urls);
  }

  /**
   * Generate category-city combinations sitemap
   */
  generateCombinationsSitemap(): string {
    const combinations = this.getCombinations();
    const urls: SitemapUrl[] = combinations.map(combo => {
      const categoryUrl = this.formatForUrl(combo.category);
      const cityUrl = this.formatForUrl(combo.city);
      
      return {
        loc: `https://${categoryUrl}.${cityUrl}.near-me.us/`,
        lastmod: this.getCurrentDate(),
        changefreq: 'daily',
        priority: 0.9
      };
    });

    // Add main pages for each combination
    combinations.forEach(combo => {
      const categoryUrl = this.formatForUrl(combo.category);
      const cityUrl = this.formatForUrl(combo.city);
      const baseUrl = `https://${categoryUrl}.${cityUrl}.near-me.us`;

      urls.push(
        {
          loc: `${baseUrl}/about`,
          lastmod: this.getCurrentDate(),
          changefreq: 'monthly',
          priority: 0.5
        },
        {
          loc: `${baseUrl}/contact`,
          lastmod: this.getCurrentDate(),
          changefreq: 'monthly',
          priority: 0.5
        }
      );
    });

    return this.generateXmlSitemap(urls);
  }

  /**
   * Generate businesses sitemap
   */
  generateBusinessesSitemap(): string {
    const urls: SitemapUrl[] = this.businesses.map(business => {
      const categoryUrl = this.formatForUrl(this.formatForDisplay(business.category));
      const cityUrl = this.formatForUrl(this.formatForDisplay(business.city));
      const businessUrl = this.formatForUrl(business.name);
      
      return {
        loc: `https://${categoryUrl}.${cityUrl}.near-me.us/business/${businessUrl}-${business.id}`,
        lastmod: this.getCurrentDate(),
        changefreq: 'weekly',
        priority: 0.7
      };
    });

    return this.generateXmlSitemap(urls);
  }

  /**
   * Generate subdomain-specific sitemap
   */
  generateSubdomainSitemap(category: string, city: string): string {
    const categoryUrl = this.formatForUrl(category);
    const cityUrl = this.formatForUrl(city);
    const baseUrl = `https://${categoryUrl}.${cityUrl}.near-me.us`;

    // Get businesses for this subdomain
    const subdomainBusinesses = this.businesses.filter(
      business => 
        business.category === this.formatForUrl(category) && 
        business.city === this.formatForUrl(city)
    );

    const urls: SitemapUrl[] = [
      // Main pages
      {
        loc: `${baseUrl}/`,
        lastmod: this.getCurrentDate(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: this.getCurrentDate(),
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: this.getCurrentDate(),
        changefreq: 'monthly',
        priority: 0.5
      }
    ];

    // Add business pages
    subdomainBusinesses.forEach(business => {
      const businessUrl = this.formatForUrl(business.name);
      urls.push({
        loc: `${baseUrl}/business/${businessUrl}-${business.id}`,
        lastmod: this.getCurrentDate(),
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Add service pages
    const services = new Set<string>();
    subdomainBusinesses.forEach(business => {
      business.services.forEach(service => services.add(service));
    });

    Array.from(services).forEach(service => {
      const serviceUrl = this.formatForUrl(service);
      urls.push({
        loc: `${baseUrl}/services/${serviceUrl}`,
        lastmod: this.getCurrentDate(),
        changefreq: 'weekly',
        priority: 0.6
      });
    });

    // Add neighborhood pages (only if not null)
    const neighborhoods = new Set<string>();
    subdomainBusinesses.forEach(business => {
      if (business.neighborhood) {
        neighborhoods.add(business.neighborhood);
      }
    });

    Array.from(neighborhoods).forEach(neighborhood => {
      const neighborhoodUrl = this.formatForUrl(neighborhood);
      urls.push({
        loc: `${baseUrl}/neighborhoods/${neighborhoodUrl}`,
        lastmod: this.getCurrentDate(),
        changefreq: 'weekly',
        priority: 0.6
      });
    });

    return this.generateXmlSitemap(urls);
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    const combinations = this.getCombinations();
    
    let robotsTxt = `User-agent: *
Allow: /

# Main sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Category-specific sitemaps
`;

    combinations.forEach(combo => {
      const categoryUrl = this.formatForUrl(combo.category);
      const cityUrl = this.formatForUrl(combo.city);
      robotsTxt += `Sitemap: https://${categoryUrl}.${cityUrl}.near-me.us/sitemap.xml\n`;
    });

    robotsTxt += `
# Block development and admin resources
Disallow: /dev/
Disallow: /_next/
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$

# Allow important files
Allow: /sitemap.xml
Allow: /robots.txt
Allow: /favicon.ico
`;

    return robotsTxt;
  }

  /**
   * Generate XML sitemap from URLs array
   */
  private generateXmlSitemap(urls: SitemapUrl[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }

  /**
   * Get all sitemap data for analysis
   */
  getSitemapData(): SitemapData {
    return {
      categories: this.getCategories(),
      cities: this.getCities(),
      combinations: this.getCombinations(),
      businesses: this.businesses
    };
  }

  /**
   * Generate all sitemaps and return as object
   */
  generateAllSitemaps(): Record<string, string> {
    const combinations = this.getCombinations();
    const sitemaps: Record<string, string> = {
      'sitemap.xml': this.generateMasterSitemap(),
      'sitemap-categories.xml': this.generateCategoriesSitemap(),
      'sitemap-cities.xml': this.generateCitiesSitemap(),
      'sitemap-combinations.xml': this.generateCombinationsSitemap(),
      'sitemap-businesses.xml': this.generateBusinessesSitemap(),
      'robots.txt': this.generateRobotsTxt()
    };

    // Generate subdomain-specific sitemaps
    combinations.forEach(combo => {
      const categoryUrl = this.formatForUrl(combo.category);
      const cityUrl = this.formatForUrl(combo.city);
      const filename = `sitemap-${categoryUrl}-${cityUrl}.xml`;
      sitemaps[filename] = this.generateSubdomainSitemap(combo.category, combo.city);
    });

    return sitemaps;
  }
}

// Export singleton instance
export const sitemapGenerator = new SitemapGenerator();