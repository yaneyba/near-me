#!/usr/bin/env node

/**
 * Manage subdomains for different business categories
 * Usage: node scripts/manage-subdomains.js <action> <category> [city]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SubdomainManager {
  constructor() {
    this.configFile = path.join(__dirname, '..', 'src', 'config', 'subdomains.json');
    this.siteInfoFile = path.join(__dirname, '..', 'src', 'siteInfo.ts');
    this.config = this.loadConfig();
  }

  loadConfig() {
    if (fs.existsSync(this.configFile)) {
      return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
    }
    return { subdomains: {} };
  }

  saveConfig() {
    const configDir = path.dirname(this.configFile);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
  }

  addSubdomain(category, city = null) {
    const subdomain = city ? `${category}-${city}` : category;
    
    if (this.config.subdomains[subdomain]) {
      console.log(`⚠️  Subdomain ${subdomain} already exists`);
      return false;
    }

    this.config.subdomains[subdomain] = {
      category,
      city,
      enabled: true,
      title: this.generateTitle(category, city),
      description: this.generateDescription(category, city),
      keywords: this.generateKeywords(category, city),
      created: new Date().toISOString()
    };

    this.saveConfig();
    this.updateSiteInfo();
    
    console.log(`✅ Added subdomain: ${subdomain}.near-me.us`);
    return true;
  }

  removeSubdomain(subdomain) {
    if (!this.config.subdomains[subdomain]) {
      console.log(`⚠️  Subdomain ${subdomain} does not exist`);
      return false;
    }

    delete this.config.subdomains[subdomain];
    this.saveConfig();
    this.updateSiteInfo();
    
    console.log(`✅ Removed subdomain: ${subdomain}.near-me.us`);
    return true;
  }

  listSubdomains() {
    console.log('\n📋 Current Subdomains:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    Object.entries(this.config.subdomains).forEach(([subdomain, config]) => {
      const status = config.enabled ? '🟢' : '🔴';
      const url = `https://${subdomain}.near-me.us`;
      console.log(`${status} ${subdomain.padEnd(25)} | ${config.category.padEnd(15)} | ${config.city || 'All cities'}`);
      console.log(`   ${url}`);
      console.log('');
    });
  }

  generateTitle(category, city) {
    const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (city) {
      const cityName = city.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `Best ${categoryName} in ${cityName} | Find Local ${categoryName} Near You`;
    }
    return `Best ${categoryName} | Find Local ${categoryName} Near You`;
  }

  generateDescription(category, city) {
    const categoryName = category.replace('-', ' ');
    if (city) {
      const cityName = city.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `Discover the best ${categoryName} in ${cityName}. Read reviews, get directions, and find the perfect ${categoryName} near you.`;
    }
    return `Discover the best ${categoryName} in your area. Read reviews, get directions, and find the perfect ${categoryName} near you.`;
  }

  generateKeywords(category, city) {
    const categoryName = category.replace('-', ' ');
    const baseKeywords = [
      categoryName,
      `${categoryName} near me`,
      `best ${categoryName}`,
      `local ${categoryName}`,
      `${categoryName} directory`,
      `${categoryName} reviews`
    ];

    if (city) {
      const cityName = city.replace('-', ' ');
      baseKeywords.push(
        `${categoryName} ${cityName}`,
        `${categoryName} in ${cityName}`,
        `${cityName} ${categoryName}`
      );
    }

    return baseKeywords;
  }

  updateSiteInfo() {
    // Update the siteInfo.ts file with subdomain configurations
    const siteInfoTemplate = `// Auto-generated subdomain configuration
// Last updated: ${new Date().toISOString()}

export interface SubdomainConfig {
  category: string;
  city: string | null;
  enabled: boolean;
  title: string;
  description: string;
  keywords: string[];
  created: string;
}

export const subdomainConfigs: Record<string, SubdomainConfig> = ${JSON.stringify(this.config.subdomains, null, 2)};

export function getSubdomainConfig(subdomain: string): SubdomainConfig | null {
  return subdomainConfigs[subdomain] || null;
}

export function isValidSubdomain(subdomain: string): boolean {
  const config = getSubdomainConfig(subdomain);
  return config !== null && config.enabled;
}
`;

    const configDir = path.join(__dirname, '..', 'src', 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(configDir, 'subdomains.ts'), siteInfoTemplate);
    console.log('📝 Updated subdomain configuration files');
  }

  generateCloudflareConfig() {
    const subdomains = Object.keys(this.config.subdomains);
    
    const cloudflareConfig = {
      _headers: [],
      _redirects: []
    };

    // Generate header rules for each subdomain
    subdomains.forEach(subdomain => {
      cloudflareConfig._headers.push(`https://${subdomain}.near-me.us/*`);
      cloudflareConfig._headers.push('  X-Subdomain: ' + subdomain);
      cloudflareConfig._headers.push('');
    });

    console.log('\n📋 Cloudflare Configuration:');
    console.log('Add these to your _headers file:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cloudflareConfig._headers.forEach(line => console.log(line));
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node scripts/manage-subdomains.js <action> [category] [city]');
    console.error('');
    console.error('Actions:');
    console.error('  add <category> [city]  - Add a new subdomain');
    console.error('  remove <subdomain>     - Remove a subdomain');
    console.error('  list                   - List all subdomains');
    console.error('  cloudflare             - Generate Cloudflare configuration');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/manage-subdomains.js add nail-salons frisco');
    console.error('  node scripts/manage-subdomains.js add restaurants');
    console.error('  node scripts/manage-subdomains.js remove nail-salons-frisco');
    console.error('  node scripts/manage-subdomains.js list');
    process.exit(1);
  }
  
  const [action, category, city] = args;
  const manager = new SubdomainManager();
  
  try {
    switch (action) {
      case 'add':
        if (!category) {
          throw new Error('Category is required for add action');
        }
        manager.addSubdomain(category, city);
        break;
        
      case 'remove':
        if (!category) {
          throw new Error('Subdomain is required for remove action');
        }
        manager.removeSubdomain(category);
        break;
        
      case 'list':
        manager.listSubdomains();
        break;
        
      case 'cloudflare':
        manager.generateCloudflareConfig();
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
