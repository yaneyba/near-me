import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from subdomain-generation.json
const configPath = path.join(__dirname, '../config/subdomain-generation.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('🔧 Loaded configuration:', JSON.stringify(config, null, 2));

// Extract categories from configuration
function getCategoriesFromConfig() {
  const allCategories = [];
  
  // Get categories from each layout
  Object.values(config.layouts).forEach(layout => {
    if (layout.generateHTML) {
      allCategories.push(...layout.categories);
    }
  });
  
  return allCategories;
}

// Generate footer links from configuration
function generateFooterLinks() {
  const serviceLinks = [];
  const waterLinks = [];
  
  // Services layout
  if (config.layouts.services?.generateHTML) {
    config.layouts.services.categories.forEach(category => {
      serviceLinks.push({
        label: formatCategoryLabel(category),
        url: `https://${category}.near-me.us`,
        category
      });
    });
  }
  
  // Water layout
  if (config.layouts.water?.generateHTML) {
    config.layouts.water.categories.forEach(category => {
      waterLinks.push({
        label: formatCategoryLabel(category),
        url: `https://${category}.near-me.us`,
        category
      });
    });
  }
  
  return { serviceLinks, waterLinks };
}

function formatCategoryLabel(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Determine which pages to generate based on configuration
function getPagesToGenerate() {
  const pages = [];
  
  if (config.generationRules.categoryOnly.enabled) {
    // Generate category-only pages
    const allCategories = getCategoriesFromConfig();
    allCategories.forEach(category => {
      pages.push({
        type: 'category',
        category: formatCategoryLabel(category),
        categoryUrl: category,
        title: `Best ${formatCategoryLabel(category)} Near You`,
        description: `Find top-rated ${formatCategoryLabel(category).toLowerCase()} businesses. Compare local providers, read reviews, and book services online.`,
        businessCount: 100 // Static count for category pages
      });
    });
  }
  
  // Note: categoryWithCity is disabled in config, so no city-specific pages
  
  return pages;
}

// Get asset filenames from manifest
function getAssetFilenames() {
  const manifestPath = path.join(__dirname, '../dist/.vite/manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Find the main entry point
    const mainEntry = manifest['src/main.tsx'] || manifest['index.html'];
    
    if (mainEntry) {
      return {
        js: mainEntry.file ? `/assets/${mainEntry.file}` : '/assets/index.js',
        css: mainEntry.css && mainEntry.css.length > 0 ? `/assets/${mainEntry.css[0]}` : '/assets/index.css'
      };
    }
  }
  
  // Fallback to scanning dist/assets directory
  const assetsDir = path.join(__dirname, '../dist/assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));
    
    return {
      js: jsFile ? `/assets/${jsFile}` : '/assets/index.js',
      css: cssFile ? `/assets/${cssFile}` : '/assets/index.css'
    };
  }
  
  // Final fallback
  return {
    js: '/assets/index.js',
    css: '/assets/index.css'
  };
}

// Generate HTML template with proper meta tags, cache busting, and SEO footer
function generateHTML(page) {
  const buildTime = new Date().toISOString();
  const version = process.env.npm_package_version || '1.0.0';
  const cacheKey = Date.now();
  const assets = getAssetFilenames();
  const { serviceLinks, waterLinks } = generateFooterLinks();

  const title = page.title;
  const description = page.description;
  const keywords = page.categoryUrl ? 
    `${page.categoryUrl.replace('-', ' ')}, ${page.categoryUrl.replace('-', ' ')} near me, local ${page.categoryUrl.replace('-', ' ')}` :
    'local business directory, near me';

  // Google Analytics & Tag Manager IDs from env
  const GA_ID = process.env.VITE_GOOGLE_ANALYTICS_ID || '';
  const GTM_ID = process.env.VITE_GOOGLE_TAG_MANAGER_ID || '';

  // Try to use /og-{categoryUrl}.png if it exists, otherwise fall back to /og-image.png
  let ogImage = '/og-image.png';
  if (page.categoryUrl) {
    const categoryOgImage = `/og-${page.categoryUrl}.png`;
    const publicDir = path.join(__dirname, '../public');
    const categoryOgImagePath = path.join(publicDir, `og-${page.categoryUrl}.png`);
    if (fs.existsSync(categoryOgImagePath)) {
      ogImage = categoryOgImage;
    }
  }

  const canonicalUrl = page.categoryUrl ? 
    `https://${page.categoryUrl}.near-me.us/` : 
    'https://near-me.us/';

  // Generate hardcoded footer for SEO
  const seoFooter = `
    <!-- SEO Footer - Hardcoded for static HTML -->
    <footer class="bg-gray-900 text-white py-16" style="display: none;" id="seo-footer">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">Near Me Directory</h3>
            <p class="text-gray-400">
              Find trusted local businesses across the United States. 
              Connecting you with verified services in your area.
            </p>
          </div>

          <!-- Popular Services -->
          <div class="space-y-4">
            <h4 class="font-semibold text-white">Popular Services</h4>
            <ul class="space-y-2">
              ${serviceLinks.map(link => `
              <li>
                <a href="${link.url}" class="text-gray-400 hover:text-white transition-colors">
                  ${link.label}
                </a>
              </li>`).join('')}
            </ul>
          </div>

          <!-- Water Refill Stations -->
          <div class="space-y-4">
            <h4 class="font-semibold text-white">Water Refill Stations</h4>
            <ul class="space-y-2">
              ${waterLinks.map(link => `
              <li>
                <a href="${link.url}" class="text-gray-400 hover:text-white transition-colors">
                  ${link.label}
                </a>
              </li>`).join('')}
            </ul>
          </div>

          <!-- Resources -->
          <div class="space-y-4">
            <h4 class="font-semibold text-white">Resources</h4>
            <ul class="space-y-2">
              <li>
                <a href="/business-owners" class="text-gray-400 hover:text-white transition-colors">
                  For Business Owners
                </a>
              </li>
              <li>
                <a href="/contact" class="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/sitemap" class="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-700">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="text-gray-400 text-sm mb-4 md:mb-0">
              © ${new Date().getFullYear()} Near Me Directory. All rights reserved.
            </div>
            <div class="flex flex-wrap items-center space-x-6 text-sm">
              <a href="/privacy-policy" class="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" class="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/sitemap" class="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </a>
              <a href="/business-owners" class="text-gray-400 hover:text-white transition-colors">
                For Business Owners
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>`;

  return `<!doctype html>
<!-- Generated: ${buildTime} | Version: ${version} | Cache: ${cacheKey} -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=${cacheKey}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=${cacheKey}" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=${cacheKey}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Cache Control for Production -->
    <meta http-equiv="Cache-Control" content="public, max-age=31536000, immutable" />
    <meta name="build-time" content="${buildTime}" />
    <meta name="build-version" content="${version}" />
    
    <!-- SEO Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "${page.category || 'Near Me Directory'}",
      "url": "${canonicalUrl}",
      "description": "${description}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${canonicalUrl}?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <!-- Google Tag Manager -->
    ${GTM_ID ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');</script>` : ''}
    <!-- End Google Tag Manager -->

    <!-- Google Analytics -->
    ${GA_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    </script>` : ''}
    <!-- End Google Analytics -->

    <!-- Vite Build Assets with Cache Busting -->
    <script type="module" crossorigin src="${assets.js}"></script>
    <link rel="stylesheet" crossorigin href="${assets.css}">
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    ${GTM_ID ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
    <!-- End Google Tag Manager (noscript) -->
    
    <div id="root"></div>
    
    ${seoFooter}
    
    <!-- Build Info -->
    <script>
      window.__BUILD_INFO__ = {
        time: "${buildTime}",
        version: "${version}",
        cache: "${cacheKey}"
      };
    </script>
  </body>
</html>`;
}

// Main function to generate all HTML files
function generateSubdomainHTML() {
  const pages = getPagesToGenerate();
  const distDir = path.join(__dirname, '../dist');
  
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log(`🚀 Generating HTML files for ${pages.length} pages based on configuration...`);
  console.log(`📋 Configuration: categoryOnly=${config.generationRules.categoryOnly.enabled}, categoryWithCity=${config.generationRules.categoryWithCity.enabled}`);

  pages.forEach(page => {
    const html = generateHTML(page);
    const filename = `${page.categoryUrl}.html`;
    const filepath = path.join(distDir, filename);
    
    fs.writeFileSync(filepath, html);
    console.log(`✓ Generated: ${filename} - "${page.title}"`);
  });

  // Generate a mapping file for deployment
  const mapping = pages.map(page => ({
    subdomain: `${page.categoryUrl}.near-me.us`,
    file: `${page.categoryUrl}.html`,
    title: page.title,
    description: page.description,
    buildTime: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    type: page.type
  }));

  fs.writeFileSync(
    path.join(distDir, 'subdomain-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`\n✅ Generated ${pages.length} HTML files with configuration-driven SEO footer`);
  console.log('📄 Created subdomain-mapping.json for deployment configuration');
  
  // Show what was generated
  console.log('\n📋 Generated files:');
  pages.forEach(page => {
    console.log(`   • ${page.categoryUrl}.html → "${page.title}"`);
  });

  console.log('\n🔗 Footer links included in all pages:');
  const { serviceLinks, waterLinks } = generateFooterLinks();
  serviceLinks.forEach(link => console.log(`   • ${link.label}: ${link.url}`));
  waterLinks.forEach(link => console.log(`   • ${link.label}: ${link.url}`));
}

// Run the generator
generateSubdomainHTML();