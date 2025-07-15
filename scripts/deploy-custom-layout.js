#!/usr/bin/env node

/**
 * Automated Custom Layout Deployment Script
 * Usage: node scripts/deploy-custom-layout.js <category> <city> <data-file.json> [options]
 * 
 * This script automates the creation of custom layout sites based on lessons learned
 * from the senior-care deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CustomLayoutDeployer {
  constructor() {
    this.scriptsDir = __dirname;
    this.rootDir = path.join(__dirname, '..');
  }

  async deployCustomLayout(category, city, dataFile, options = {}) {
    console.log(`🚀 Starting custom layout deployment for ${category} in ${city}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // Step 1: Validate inputs
      await this.validateInputs(category, city, dataFile);
      
      // Step 2: Create configuration files
      await this.createConfigFiles(category, options);
      
      // Step 3: Create React components
      await this.createComponents(category);
      
      // Step 4: Update routing system
      await this.updateRouting(category);
      
      // Step 5: Update subdomain configuration
      await this.updateSubdomainConfig(category);
      
      // Step 6: Prepare and deploy data
      await this.deployData(category, city, dataFile);
      
      // Step 7: Build and verify
      await this.buildAndVerify(category);
      
      console.log('');
      console.log('🎉 Custom layout deployment completed successfully!');
      console.log(`🌐 Your site will be available at: https://${category}.near-me.us`);
      console.log(`📊 Database contains businesses for category: ${category}`);
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  async validateInputs(category, city, dataFile) {
    console.log('🔍 Step 1: Validating inputs...');
    
    // Check if data file exists and is JSON
    if (!fs.existsSync(dataFile)) {
      throw new Error(`Data file not found: ${dataFile}`);
    }
    
    if (!dataFile.endsWith('.json')) {
      throw new Error('Data file must be JSON format (.json), not CSV');
    }
    
    // Validate JSON format
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      if (!Array.isArray(data)) {
        throw new Error('JSON data must be an array of businesses');
      }
      console.log(`   ✓ Found ${data.length} businesses in JSON file`);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
    
    // Check category naming
    if (!/^[a-z-]+$/.test(category)) {
      throw new Error('Category must be lowercase with hyphens only (e.g., "senior-care")');
    }
    
    console.log('   ✅ All inputs validated');
  }

  async createConfigFiles(category, options) {
    console.log('🔧 Step 2: Creating configuration files...');
    
    const categoryPascal = this.toPascalCase(category);
    const categoryWords = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Create layout config
    const configContent = `import type { CustomLayoutConfig } from '../types';

export const ${category.replace(/-/g, '')}Config: CustomLayoutConfig = {
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af', 
    accentColor: '#60a5fa',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    name: '${categoryWords}Finder',
    logo: '/logo.svg'
  },
  hero: {
    headline: 'Find Trusted ${categoryWords} Services Near You',
    description: 'Connect with top-rated ${category.replace(/-/g, ' ')} providers in your area. Compare services, read reviews, and book appointments online.',
    ctaText: 'Find ${categoryWords} Now',
    backgroundImage: '/images/hero-${category}.jpg'
  },
  navigation: {
    items: [
      { label: 'Find ${categoryWords}', href: '/' },
      { label: 'Browse Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  footer: {
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact Us', href: '/contact' }
    ],
    contactInfo: {
      email: 'support@near-me.us',
      phone: '(555) 123-4567'
    }
  },
  features: {
    searchEnabled: true,
    filtersEnabled: true,
    mapEnabled: true,
    reviewsEnabled: true,
    bookingEnabled: false
  },
  statistics: {
    totalBusinesses: '500+',
    averageRating: '4.8',
    citiesCovered: '50+',
    monthlyUsers: '10K+'
  }
};`;

    const configPath = path.join(this.rootDir, 'src/config/customLayouts', `${category.replace(/-/g, '')}Config.ts`);
    fs.writeFileSync(configPath, configContent);
    console.log(`   ✓ Created config: ${configPath}`);
    
    // Update index.ts
    const indexPath = path.join(this.rootDir, 'src/config/customLayouts/index.ts');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add import
    const importLine = `import { ${category.replace(/-/g, '')}Config } from './${category.replace(/-/g, '')}Config';`;
    if (!indexContent.includes(importLine)) {
      indexContent = importLine + '\n' + indexContent;
    }
    
    // Add to exports
    const exportPattern = /export const customLayoutConfigs = \{([^}]+)\}/;
    const match = indexContent.match(exportPattern);
    if (match) {
      const existingConfigs = match[1];
      const newConfig = `  '${category}': ${category.replace(/-/g, '')}Config,`;
      if (!existingConfigs.includes(`'${category}':`)) {
        const newConfigs = existingConfigs + '\n' + newConfig;
        indexContent = indexContent.replace(exportPattern, `export const customLayoutConfigs = {${newConfigs}}`);
      }
    }
    
    fs.writeFileSync(indexPath, indexContent);
    console.log(`   ✓ Updated customLayoutConfigs index`);
  }

  async createComponents(category) {
    console.log('⚛️  Step 3: Creating React components...');
    
    const categoryPascal = this.toPascalCase(category);
    const componentDir = path.join(this.rootDir, 'src/components/layouts', category);
    
    // Create directory
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    // Create Layout component
    const layoutContent = `import React from 'react';
import { CustomLayout } from '../CustomLayout';
import { ${category.replace(/-/g, '')}Config } from '../../../config/customLayouts/${category.replace(/-/g, '')}Config';

export const ${categoryPascal}Layout: React.FC = () => {
  return <CustomLayout config={${category.replace(/-/g, '')}Config} />;
};`;

    const layoutPath = path.join(componentDir, 'Layout.tsx');
    fs.writeFileSync(layoutPath, layoutContent);
    console.log(`   ✓ Created Layout component: ${layoutPath}`);
    
    // Create index.ts
    const indexContent = `export { ${categoryPascal}Layout } from './Layout';`;
    const indexPath = path.join(componentDir, 'index.ts');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`   ✓ Created component index: ${indexPath}`);
    
    // Create World routing component
    const worldContent = `import React from 'react';
import { useLocation } from 'react-router-dom';
import { ${categoryPascal}HomePage } from '../../pages/${category}';

export const ${categoryPascal}World: React.FC = () => {
  const location = useLocation();

  // Homepage route
  if (location.pathname === '/') {
    return <${categoryPascal}HomePage />;
  }

  // Auth routes
  if (location.pathname.startsWith('/auth')) {
    return <${categoryPascal}HomePage />; // For now, redirect to homepage
  }

  // Default fallback
  return <${categoryPascal}HomePage />;
};`;

    const worldPath = path.join(this.rootDir, 'src/components/routing', `${categoryPascal}World.tsx`);
    fs.writeFileSync(worldPath, worldContent);
    console.log(`   ✓ Created World routing component: ${worldPath}`);
  }

  async updateRouting(category) {
    console.log('🛣️  Step 4: Updating routing system...');
    
    const categoryPascal = this.toPascalCase(category);
    const categoryProperty = `is${categoryPascal}`;
    
    // Update SubdomainInfo type
    const typesPath = path.join(this.rootDir, 'src/types/subdomain.ts');
    let typesContent = fs.readFileSync(typesPath, 'utf8');
    
    if (!typesContent.includes(categoryProperty)) {
      // Add property to interface
      const interfacePattern = /(export interface SubdomainInfo \{[^}]+)/;
      const match = typesContent.match(interfacePattern);
      if (match) {
        const newProperty = `  ${categoryProperty}: boolean;`;
        typesContent = typesContent.replace(interfacePattern, `${match[1]}\n${newProperty}`);
        fs.writeFileSync(typesPath, typesContent);
        console.log(`   ✓ Added ${categoryProperty} to SubdomainInfo type`);
      }
    }
    
    // Update subdomain parser
    const parserPath = path.join(this.rootDir, 'src/utils/subdomainParser.ts');
    let parserContent = fs.readFileSync(parserPath, 'utf8');
    
    if (!parserContent.includes(`'${category}':`)) {
      // Add subdomain mapping
      const mappingPattern = /(const subdomainMappings: Record<string, Partial<SubdomainInfo>> = \{[^}]+)/;
      const match = parserContent.match(mappingPattern);
      if (match) {
        const newMapping = `  '${category}': { ${categoryProperty}: true },`;
        parserContent = parserContent.replace(mappingPattern, `${match[1]}\n${newMapping}`);
        fs.writeFileSync(parserPath, parserContent);
        console.log(`   ✓ Added ${category} to subdomain mappings`);
      }
    }
    
    // Update SmartDoor routing
    const smartDoorPath = path.join(this.rootDir, 'src/components/routing/SmartDoor.tsx');
    let smartDoorContent = fs.readFileSync(smartDoorPath, 'utf8');
    
    // Add import
    const importLine = `import { ${categoryPascal}World } from './${categoryPascal}World';`;
    if (!smartDoorContent.includes(importLine)) {
      const importSection = smartDoorContent.match(/(import.*from.*;\n)+/)[0];
      smartDoorContent = smartDoorContent.replace(importSection, importSection + importLine + '\n');
    }
    
    // Add routing condition
    const routingCondition = `  if (subdomainInfo.${categoryProperty}) {
    return <${categoryPascal}World />;
  }`;
    
    if (!smartDoorContent.includes(categoryProperty)) {
      // Find a good place to insert the routing condition
      const defaultReturnPattern = /(  \/\/ Default to main site[\s\S]*?return <MainWorld \/>)/;
      smartDoorContent = smartDoorContent.replace(defaultReturnPattern, routingCondition + '\n\n$1');
      fs.writeFileSync(smartDoorPath, smartDoorContent);
      console.log(`   ✓ Added ${category} routing to SmartDoor`);
    }
  }

  async updateSubdomainConfig(category) {
    console.log('🌐 Step 5: Updating subdomain configuration...');
    
    const configPath = path.join(this.rootDir, 'config/subdomain-generation.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Find or create appropriate layout group
    const layoutKey = category.split('-')[0]; // e.g., "senior" from "senior-care"
    
    if (!config.layouts[layoutKey]) {
      config.layouts[layoutKey] = {
        description: `${category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} services layout`,
        categories: [category],
        generateHTML: true
      };
    } else if (!config.layouts[layoutKey].categories.includes(category)) {
      config.layouts[layoutKey].categories.push(category);
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`   ✓ Added ${category} to subdomain generation config`);
  }

  async deployData(category, city, dataFile) {
    console.log('💾 Step 6: Deploying data to database...');
    
    // Generate migration
    console.log('   📝 Generating migration...');
    await execAsync(`node ${path.join(this.scriptsDir, 'generate-migration.js')} ${category} ${city} ${dataFile}`);
    
    // Find the generated migration file
    const migrationsDir = path.join(this.rootDir, 'migrations/d1');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.includes(`data_${category.replace(/-/g, '_')}_businesses`))
      .sort()
      .reverse();
    
    if (migrationFiles.length === 0) {
      throw new Error('Migration file not found');
    }
    
    const migrationFile = migrationFiles[0];
    const migrationPath = path.join(migrationsDir, migrationFile);
    
    console.log(`   📄 Found migration: ${migrationFile}`);
    
    // Check and fix schema issues
    let migrationContent = fs.readFileSync(migrationPath, 'utf8');
    if (migrationContent.includes('image,')) {
      console.log('   🔧 Fixing image → image_url column mapping...');
      migrationContent = migrationContent.replace(/image,/g, 'image_url,');
      fs.writeFileSync(migrationPath, migrationContent);
    }
    
    // Apply migration
    console.log('   🚀 Applying migration to database...');
    await execAsync(`wrangler d1 execute nearme-db --file=${migrationPath} --remote`);
    
    // Verify data
    console.log('   ✅ Verifying data...');
    const { stdout } = await execAsync(`wrangler d1 execute nearme-db --command="SELECT COUNT(*) as count FROM businesses WHERE category='${category}';" --remote`);
    console.log(`   📊 Data verification: ${stdout}`);
  }

  async buildAndVerify(category) {
    console.log('🏗️  Step 7: Building and verifying...');
    
    // Build project
    console.log('   📦 Building project...');
    await execAsync('npm run build');
    
    // Check if HTML file was generated
    const htmlPath = path.join(this.rootDir, 'dist', `${category}.html`);
    if (fs.existsSync(htmlPath)) {
      console.log(`   ✅ Generated HTML file: ${category}.html`);
      
      // Quick check of content
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      if (htmlContent.includes(`<title>Best ${category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Near You</title>`)) {
        console.log('   ✅ HTML file has correct title');
      }
    } else {
      throw new Error(`HTML file not generated: ${category}.html`);
    }
  }

  toPascalCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
}

// Main execution
if (process.argv.length < 5) {
  console.log('Usage: node scripts/deploy-custom-layout.js <category> <city> <data-file.json>');
  console.log('Example: node scripts/deploy-custom-layout.js senior-care plano ./data/senior-care-plano.json');
  process.exit(1);
}

const [,, category, city, dataFile] = process.argv;
const deployer = new CustomLayoutDeployer();
deployer.deployCustomLayout(category, city, dataFile).catch(console.error);
