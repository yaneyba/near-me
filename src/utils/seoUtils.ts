import { Business, SubdomainInfo } from '../types';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  structuredData: any;
}

export class SEOUtils {
  private baseUrl = 'https://near-me.us';

  /**
   * Generate comprehensive SEO metadata for a subdomain
   */
  generateSEOMetadata(
    subdomainInfo: SubdomainInfo,
    businesses: Business[] = [],
    currentPath: string = '/'
  ): SEOMetadata {
    const { category, city, state, isServices } = subdomainInfo;
    const businessCount = businesses.length;
    
    // Generate URLs - use services.near-me.us for services homepage
    let subdomainUrl: string;
    let canonicalUrl: string;
    
    if (isServices) {
      subdomainUrl = 'https://services.near-me.us';
      canonicalUrl = `${subdomainUrl}${currentPath}`;
    } else {
      const categoryUrl = this.formatForUrl(category);
      const cityUrl = this.formatForUrl(city);
      subdomainUrl = `https://${categoryUrl}.${cityUrl}.near-me.us`;
      canonicalUrl = `${subdomainUrl}${currentPath}`;
    }

    // Generate title based on page type
    let title: string;
    let description: string;
    
    switch (currentPath) {
      case '/about':
        title = `About ${category} in ${city}, ${state} - Local Business Directory`;
        description = `Learn about our ${category.toLowerCase()} directory for ${city}, ${state}. Find trusted local businesses, read reviews, and connect with quality service providers in your area.`;
        break;
      case '/contact':
        title = `Contact Us - ${category} in ${city}, ${state}`;
        description = `Get in touch with our ${city} ${category.toLowerCase()} directory team. Questions about local businesses, listings, or services? We're here to help.`;
        break;
      default:
        title = `Best ${category} in ${city}, ${state} (${businessCount}+ Options)`;
        description = `Find the top-rated ${category.toLowerCase()} in ${city}, ${state}. Compare ${businessCount}+ local businesses, read reviews, get contact info, and book services online.`;
    }

    // Generate keywords
    const keywords = this.generateKeywords(category, city, state, businesses);

    // Generate Open Graph data
    const ogTitle = title.length > 60 ? `${category} in ${city}, ${state}` : title;
    const ogDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
    const ogImage = this.generateOGImage(category, city, isServices);

    // Generate structured data
    const structuredData = this.generateStructuredData(subdomainInfo, businesses, currentPath);

    return {
      title,
      description,
      keywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      structuredData
    };
  }

  /**
   * Generate relevant keywords for SEO
   */
  private generateKeywords(
    category: string,
    city: string,
    state: string,
    businesses: Business[]
  ): string[] {
    const baseKeywords = [
      `${category.toLowerCase()} ${city.toLowerCase()}`,
      `${city.toLowerCase()} ${category.toLowerCase()}`,
      `best ${category.toLowerCase()} ${city.toLowerCase()}`,
      `${category.toLowerCase()} near me`,
      `${city.toLowerCase()} ${state.toLowerCase()} ${category.toLowerCase()}`,
      `top ${category.toLowerCase()} ${city.toLowerCase()}`,
      `${category.toLowerCase()} services ${city.toLowerCase()}`,
      `local ${category.toLowerCase()} ${city.toLowerCase()}`
    ];

    // Add service-based keywords
    const services = new Set<string>();
    businesses.forEach(business => {
      business.services.forEach(service => {
        services.add(service.toLowerCase());
        baseKeywords.push(`${service.toLowerCase()} ${city.toLowerCase()}`);
      });
    });

    // Add neighborhood keywords (only if not null)
    const neighborhoods = new Set<string>();
    businesses.forEach(business => {
      if (business.neighborhood) {
        neighborhoods.add(business.neighborhood.toLowerCase());
        baseKeywords.push(`${category.toLowerCase()} ${business.neighborhood.toLowerCase()}`);
      }
    });

    return [...new Set(baseKeywords)].slice(0, 20); // Limit to 20 keywords
  }

  /**
   * Generate Open Graph image URL
   */
  private generateOGImage(category: string, city: string, isServices?: boolean): string {
    // In production, this would generate dynamic OG images
    // For now, return a placeholder that could be replaced with actual image generation
    if (isServices) {
      return `${this.baseUrl}/og-images/services-homepage.jpg`;
    }
    
    const categoryUrl = this.formatForUrl(category);
    const cityUrl = this.formatForUrl(city);
    return `${this.baseUrl}/og-images/${categoryUrl}-${cityUrl}.jpg`;
  }

  /**
   * Generate structured data (JSON-LD) for better SEO
   */
  private generateStructuredData(
    subdomainInfo: SubdomainInfo,
    businesses: Business[],
    currentPath: string
  ): any {
    const { category, city, state, isServices } = subdomainInfo;
    
    // Generate base URL - use services.near-me.us for services homepage
    let baseUrl: string;
    if (isServices) {
      baseUrl = 'https://services.near-me.us';
    } else {
      const categoryUrl = this.formatForUrl(category);
      const cityUrl = this.formatForUrl(city);
      baseUrl = `https://${categoryUrl}.${cityUrl}.near-me.us`;
    }

    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": `${category} in ${city}, ${state}`,
      "url": baseUrl,
      "description": `Directory of ${category.toLowerCase()} in ${city}, ${state}`,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    if (currentPath === '/' && businesses.length > 0) {
      // Add LocalBusiness structured data for homepage
      return [
        baseStructuredData,
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${category} in ${city}, ${state}`,
          "description": `List of ${category.toLowerCase()} businesses in ${city}, ${state}`,
          "numberOfItems": businesses.length,
          "itemListElement": businesses.slice(0, 10).map((business, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": this.generateBusinessStructuredData(business, subdomainInfo)
          }))
        }
      ];
    }

    return baseStructuredData;
  }

  /**
   * Generate structured data for individual business
   */
  generateBusinessStructuredData(business: Business, subdomainInfo: SubdomainInfo): any {
    const { category, city, isServices } = subdomainInfo;
    
    // Generate business URL - use services.near-me.us for services homepage
    let businessUrl: string;
    if (isServices) {
      businessUrl = `https://services.near-me.us/business/${this.formatForUrl(business.name)}-${business.id}`;
    } else {
      const categoryUrl = this.formatForUrl(category);
      const cityUrl = this.formatForUrl(city);
      businessUrl = `https://${categoryUrl}.${cityUrl}.near-me.us/business/${this.formatForUrl(business.name)}-${business.id}`;
    }

    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": business.name,
      "description": business.description,
      "url": businessUrl,
      "telephone": business.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address,
        "addressLocality": city,
        "addressRegion": business.state,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        // In production, you'd have actual coordinates
        "latitude": "0",
        "longitude": "0"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": business.rating,
        "reviewCount": business.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "priceRange": "$$", // Could be dynamic based on business data
      "image": business.image,
      "openingHours": Object.entries(business.hours).map(([day, hours]) => 
        `${day.substring(0, 2)} ${hours}`
      ),
      "serviceArea": {
        "@type": "City",
        "name": city
      }
    };
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbStructuredData(
    subdomainInfo: SubdomainInfo,
    currentPath: string,
    businessName?: string
  ): any {
    const { category, city, isServices } = subdomainInfo;
    
    // Generate base URL - use services.near-me.us for services homepage
    let baseUrl: string;
    if (isServices) {
      baseUrl = 'https://services.near-me.us';
    } else {
      const categoryUrl = this.formatForUrl(category);
      const cityUrl = this.formatForUrl(city);
      baseUrl = `https://${categoryUrl}.${cityUrl}.near-me.us`;
    }

    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": this.baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${category} in ${city}`,
        "item": baseUrl
      }
    ];

    if (currentPath === '/about') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": "About",
        "item": `${baseUrl}/about`
      });
    } else if (currentPath === '/contact') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": "Contact",
        "item": `${baseUrl}/contact`
      });
    } else if (businessName) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": businessName,
        "item": `${baseUrl}${currentPath}`
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };
  }

  /**
   * Format text for URL usage
   */
  private formatForUrl(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Generate meta tags HTML string
   */
  generateMetaTagsHTML(metadata: SEOMetadata): string {
    return `
<!-- Primary Meta Tags -->
<title>${metadata.title}</title>
<meta name="title" content="${metadata.title}">
<meta name="description" content="${metadata.description}">
<meta name="keywords" content="${metadata.keywords.join(', ')}">
<link rel="canonical" href="${metadata.canonicalUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${metadata.canonicalUrl}">
<meta property="og:title" content="${metadata.ogTitle}">
<meta property="og:description" content="${metadata.ogDescription}">
<meta property="og:image" content="${metadata.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${metadata.canonicalUrl}">
<meta property="twitter:title" content="${metadata.ogTitle}">
<meta property="twitter:description" content="${metadata.ogDescription}">
<meta property="twitter:image" content="${metadata.ogImage}">

<!-- Structured Data -->
<script type="application/ld+json">
${JSON.stringify(metadata.structuredData, null, 2)}
</script>
    `.trim();
  }
}

// Export singleton instance
export const seoUtils = new SEOUtils();