import { Business } from '@/types';
import { DataProviderFactory } from '@/providers';

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
  private businesses: Business[] = []; // Will be populated when needed
  private dataProvider = DataProviderFactory.getProvider();

  /**
   * Get all unique categories from DataProvider
   */
  private async getCategories(): Promise<string[]> {
    try {
      const categories = await this.dataProvider.getCategories();
      return categories.map(category => this.formatForDisplay(category)).sort();
    } catch (error) {
      console.error('Failed to load categories from DataProvider:', error);
      return [];
    }
  }

  /**
   * Get all unique cities from DataProvider
   */
  private async getCities(): Promise<string[]> {
    try {
      const cities = await this.dataProvider.getCities();
      return cities.map(city => this.formatForDisplay(city)).sort();
    } catch (error) {
      console.error('Failed to load cities from DataProvider:', error);
      return [];
    }
  }

  /**
   * Get all valid category-city combinations from DataProvider
   */
  private async getCombinations(): Promise<Array<{ category: string; city: string; state: string }>> {
    try {
      const knownCombinations = await this.dataProvider.getKnownCombinations();
      const cityStateMap = await this.dataProvider.getCityStateMap();
      
      return knownCombinations.map(combo => ({
        category: this.formatForDisplay(combo.category),
        city: this.formatForDisplay(combo.city),
        state: cityStateMap[combo.city] || 'Unknown'
      })).sort((a, b) => 
        a.category.localeCompare(b.category) || a.city.localeCompare(b.city)
      );
    } catch (error) {
      console.error('Failed to load combinations from DataProvider:', error);
      return [];
    }
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
  async generateCategoriesSitemap(): Promise<string> {
    const categories = await this.getCategories();
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
  async generateCitiesSitemap(): Promise<string> {
    const cities = await this.getCities();
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
  async generateCombinationsSitemap(): Promise<string> {
    const combinations = await this.getCombinations();
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
    const urls: SitemapUrl[] = this.businesses
      .filter(business => business.category && business.city) // Only include businesses with valid data
      .map(business => {
        const categoryUrl = this.formatForUrl(this.formatForDisplay(business.category!));
        const cityUrl = this.formatForUrl(this.formatForDisplay(business.city!));
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
      if (business.services) {
        business.services.forEach(service => services.add(service));
      }
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

    // Add neighborhood pages would go here if Business type had neighborhood property
    // Currently Business type doesn't have neighborhood, so this section is commented out
    /*
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
    */

    return this.generateXmlSitemap(urls);
  }

  /**
   * Generate robots.txt content
   */
  async generateRobotsTxt(): Promise<string> {
    const combinations = await this.getCombinations();
    
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
  async getSitemapData(): Promise<SitemapData> {
    const [categories, cities, combinations] = await Promise.all([
      this.getCategories(),
      this.getCities(),
      this.getCombinations()
    ]);

    return {
      categories,
      cities,
      combinations,
      businesses: this.businesses
    };
  }

  /**
   * Generate all sitemaps and return as object
   */
  async generateAllSitemaps(): Promise<Record<string, string>> {
    const [combinations, categoriesSitemap, citiesSitemap, combinationsSitemap, robotsTxt] = await Promise.all([
      this.getCombinations(),
      this.generateCategoriesSitemap(),
      this.generateCitiesSitemap(),
      this.generateCombinationsSitemap(),
      this.generateRobotsTxt()
    ]);

    const sitemaps: Record<string, string> = {
      'sitemap.xml': this.generateMasterSitemap(),
      'sitemap-categories.xml': categoriesSitemap,
      'sitemap-cities.xml': citiesSitemap,
      'sitemap-combinations.xml': combinationsSitemap,
      'sitemap-businesses.xml': this.generateBusinessesSitemap(),
      'robots.txt': robotsTxt
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