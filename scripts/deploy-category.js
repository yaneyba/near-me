#!/usr/bin/env node

/**
 * Automated deployment script for new categories
 * Usage: node scripts/deploy-category.js <category> <city> [data-source]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CategoryDeployer {
  constructor() {
    this.scriptsDir = __dirname;
    this.migrationsDir = path.join(__dirname, '..', 'migrations', 'd1');
  }

  async deployCategory(category, city, dataSource = null) {
    console.log(`🚀 Starting deployment for ${category} in ${city}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // Step 1: Import data (if data source provided)
      if (dataSource) {
        await this.importData(dataSource, category, city);
      }

      // Step 2: Generate migration
      await this.generateMigration(category, city, dataSource);

      // Step 3: Run migration
      await this.runMigration(category, city);

      // Step 4: Add subdomain
      await this.addSubdomain(category, city);

      // Step 5: Update routing
      await this.updateRouting(category, city);

      // Step 6: Verify deployment
      await this.verifyDeployment(category, city);

      console.log('');
      console.log('🎉 Deployment completed successfully!');
      console.log(`✅ Subdomain: https://${category}-${city}.near-me.us`);
      console.log(`✅ API: https://near-me.us/api/businesses?category=${category}&city=${city}`);
      
    } catch (error) {
      console.error(`❌ Deployment failed: ${error.message}`);
      throw error;
    }
  }

  async importData(dataSource, category, city) {
    console.log('\n📂 Step 1: Importing data...');
    
    const sourceType = this.detectSourceType(dataSource);
    const importScript = path.join(this.scriptsDir, 'business-importer.js');
    
    const command = `node ${importScript} ${sourceType} ${dataSource} ${category} ${city}`;
    console.log(`Running: ${command}`);
    
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) console.error(stderr);
  }

  async generateMigration(category, city, dataSource) {
    console.log('\n📝 Step 2: Generating migration...');
    
    const migrationScript = path.join(this.scriptsDir, 'generate-migration.js');
    let command = `node ${migrationScript} ${category} ${city}`;
    
    if (dataSource) {
      command += ` ${dataSource}`;
    }
    
    console.log(`Running: ${command}`);
    
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) console.error(stderr);
  }

  async runMigration(category, city) {
    console.log('\n🗄️  Step 3: Running database migration...');
    
    // Find the most recent migration file for this category
    const migrationFiles = fs.readdirSync(this.migrationsDir)
      .filter(file => file.includes(`_data_${category.replace('-', '_')}_businesses.sql`))
      .sort()
      .reverse();
    
    if (migrationFiles.length === 0) {
      throw new Error(`No migration file found for ${category}`);
    }
    
    const migrationFile = migrationFiles[0];
    const migrationPath = path.join(this.migrationsDir, migrationFile);
    
    console.log(`Running migration: ${migrationFile}`);
    
    const command = `wrangler d1 execute nearme-db --file=./migrations/d1/${migrationFile} --remote`;
    console.log(`Running: ${command}`);
    
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) console.error(stderr);
  }

  async addSubdomain(category, city) {
    console.log('\n🌐 Step 4: Adding subdomain...');
    
    const subdomainScript = path.join(this.scriptsDir, 'manage-subdomains.js');
    const command = `node ${subdomainScript} add ${category} ${city}`;
    
    console.log(`Running: ${command}`);
    
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) console.error(stderr);
  }

  async updateRouting(category, city) {
    console.log('\n🔄 Step 5: Updating application routing...');
    
    // This would update your routing configuration
    // For now, just log what needs to be done
    console.log('📝 Manual steps required:');
    console.log(`   1. Update Cloudflare DNS if needed`);
    console.log(`   2. Update _headers file with subdomain configuration`);
    console.log(`   3. Deploy to Cloudflare Pages if auto-deploy is disabled`);
  }

  async verifyDeployment(category, city) {
    console.log('\n✅ Step 6: Verifying deployment...');
    
    // Test database
    const dbCommand = `wrangler d1 execute nearme-db --command="SELECT COUNT(*) FROM businesses WHERE category = '${category}' AND city = '${city}';" --remote`;
    console.log('Testing database...');
    
    try {
      const { stdout } = await execAsync(dbCommand);
      const match = stdout.match(/│\s*(\d+)\s*│/);
      const count = match ? parseInt(match[1]) : 0;
      
      if (count > 0) {
        console.log(`✅ Database: ${count} businesses found`);
      } else {
        console.log('⚠️  Database: No businesses found');
      }
    } catch (error) {
      console.log(`⚠️  Database test failed: ${error.message}`);
    }

    // Test API
    const apiUrl = `https://near-me.us/api/businesses?category=${category}&city=${city}`;
    console.log(`Testing API: ${apiUrl}`);
    
    try {
      const curlCommand = `curl -s "${apiUrl}" | jq '. | length'`;
      const { stdout } = await execAsync(curlCommand);
      const apiCount = parseInt(stdout.trim());
      
      if (apiCount > 0) {
        console.log(`✅ API: ${apiCount} businesses returned`);
      } else {
        console.log('⚠️  API: No businesses returned');
      }
    } catch (error) {
      console.log(`⚠️  API test failed: ${error.message}`);
    }

    // Test subdomain (would require the subdomain to be live)
    const subdomainUrl = `https://${category}-${city}.near-me.us`;
    console.log(`📝 Manual verification needed: ${subdomainUrl}`);
  }

  detectSourceType(dataSource) {
    if (dataSource.endsWith('.csv')) return 'csv';
    if (dataSource.endsWith('.json')) return 'json';
    return 'places'; // Assume Google Places search
  }

  async rollback(category, city) {
    console.log(`🔄 Rolling back deployment for ${category} in ${city}`);
    
    try {
      // Remove subdomain
      const subdomainScript = path.join(this.scriptsDir, 'manage-subdomains.js');
      await execAsync(`node ${subdomainScript} remove ${category}-${city}`);
      
      // Note: Database rollback would need more sophisticated migration tracking
      console.log('⚠️  Database rollback not implemented - manual cleanup required');
      console.log(`   Run: DELETE FROM businesses WHERE category = '${category}' AND city = '${city}';`);
      
    } catch (error) {
      console.error(`❌ Rollback failed: ${error.message}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/deploy-category.js <category> <city> [data-source]');
    console.error('       node scripts/deploy-category.js rollback <category> <city>');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/deploy-category.js nail-salons frisco ./data/nail-salons.csv');
    console.error('  node scripts/deploy-category.js restaurants downtown ./data/restaurants.json');
    console.error('  node scripts/deploy-category.js auto-repair oakland "auto repair shops"');
    console.error('  node scripts/deploy-category.js rollback nail-salons frisco');
    process.exit(1);
  }
  
  const deployer = new CategoryDeployer();
  
  try {
    if (args[0] === 'rollback') {
      if (args.length < 3) {
        console.error('Usage: node scripts/deploy-category.js rollback <category> <city>');
        process.exit(1);
      }
      await deployer.rollback(args[1], args[2]);
    } else {
      if (args.length < 2) {
        console.error('Usage: node scripts/deploy-category.js <category> <city> [data-source]');
        process.exit(1);
      }
      await deployer.deployCategory(args[0], args[1], args[2]);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
