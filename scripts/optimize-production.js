import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Production optimization script
 * Runs after build to optimize files for production deployment
 */
function optimizeProduction() {
  const distDir = path.join(__dirname, '../dist');
  
  console.log('🚀 Optimizing production build...');
  
  // 1. Generate build manifest with cache keys
  generateBuildManifest(distDir);
  
  // 2. Create cache control headers file
  createCacheControlHeaders(distDir);
  
  // 3. Generate deployment info
  generateDeploymentInfo(distDir);
  
  console.log('✅ Production optimization complete!');
}

function generateBuildManifest(distDir) {
  const buildTime = new Date().toISOString();
  const version = process.env.npm_package_version || '1.0.0';
  const buildId = `${version}-${Date.now()}`;
  
  // Scan assets directory for files
  const assetsDir = path.join(distDir, 'assets');
  const assets = {};
  
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    files.forEach(file => {
      const filePath = `/assets/${file}`;
      const stats = fs.statSync(path.join(assetsDir, file));
      
      assets[file] = {
        path: filePath,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        hash: file.match(/-([a-f0-9]+)\./)?.[1] || 'no-hash'
      };
    });
  }
  
  const manifest = {
    buildId,
    buildTime,
    version,
    assets,
    cacheStrategy: {
      html: 'max-age=3600', // 1 hour
      assets: 'max-age=31536000,immutable', // 1 year
      api: 'no-cache'
    }
  };
  
  fs.writeFileSync(
    path.join(distDir, 'build-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`📦 Generated build manifest: ${buildId}`);
}

function createCacheControlHeaders(distDir) {
  const headers = `# Cache Control Headers for Production
/*
  Cache-Control: public, max-age=0, must-revalidate

# Static assets with versioning
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Images and media
/*.png
  Cache-Control: public, max-age=86400
/*.jpg
  Cache-Control: public, max-age=86400
/*.jpeg
  Cache-Control: public, max-age=86400
/*.svg
  Cache-Control: public, max-age=86400
/*.webp
  Cache-Control: public, max-age=86400

# Fonts
/*.woff
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
/*.ttf
  Cache-Control: public, max-age=31536000, immutable

# HTML files
/*.html
  Cache-Control: public, max-age=3600, s-maxage=86400

# API endpoints
/api/*
  Cache-Control: no-cache, no-store, must-revalidate

# Manifest and service worker
/manifest.json
  Cache-Control: public, max-age=0, must-revalidate
/sw.js
  Cache-Control: public, max-age=0, must-revalidate
`;

  fs.writeFileSync(path.join(distDir, '_headers'), headers);
  console.log('📝 Generated _headers file for Cloudflare Pages');
}

function generateDeploymentInfo(distDir) {
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    buildId: `${process.env.npm_package_version || '1.0.0'}-${Date.now()}`,
    cacheStrategy: {
      description: 'Aggressive caching for static assets, moderate for HTML',
      staticAssets: '1 year (immutable)',
      htmlFiles: '1 hour browser, 1 day CDN',
      apiEndpoints: 'No cache'
    },
    deployment: {
      platform: 'Cloudflare Pages',
      cacheInvalidation: 'Automatic via file hashing',
      rollback: 'Available via Cloudflare dashboard'
    }
  };
  
  fs.writeFileSync(
    path.join(distDir, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log('🚀 Generated deployment info');
}

// Run optimization
optimizeProduction();