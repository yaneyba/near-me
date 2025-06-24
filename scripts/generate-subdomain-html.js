import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import business data
const businessesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/businesses.json'), 'utf8')
);

// City-state mapping
const cityStateMap = {
  'dallas': 'Texas',
  'denver': 'Colorado',
  'austin': 'Texas',
  'houston': 'Texas',
  'frisco': 'Texas'
};

// Get unique combinations from business data
function getUniqueCombinations() {
  const combinations = new Set();
  const result = [];

  businessesData.forEach(business => {
    const key = `${business.category}-${business.city}`;
    if (!combinations.has(key)) {
      combinations.add(key);
      
      const categoryDisplay = business.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const cityDisplay = business.city
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      result.push({
        category: categoryDisplay,
        city: cityDisplay,
        state: cityStateMap[business.city] || 'Unknown',
        categoryUrl: business.category,
        cityUrl: business.city,
        businessCount: businessesData.filter(b => 
          b.category === business.category && b.city === business.city
        ).length
      });
    }
  });

  return result;
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

// Generate HTML template with proper meta tags and cache busting
function generateHTML(combo) {
  const { category, city, state, businessCount } = combo;
  const buildTime = new Date().toISOString();
  const version = process.env.npm_package_version || '1.0.0';
  const cacheKey = Date.now();
  const assets = getAssetFilenames();

  const title = `Best ${category} in ${city}, ${state} (${businessCount}+ Options)`;
  const description = `Find top-rated ${category.toLowerCase()} in ${city}, ${state}. Compare ${businessCount}+ local businesses, read reviews, get contact info, and book services online.`;
  const keywords = [
    `${category.toLowerCase()} ${city.toLowerCase()}`,
    `${city.toLowerCase()} ${category.toLowerCase()}`,
    `best ${category.toLowerCase()} ${city.toLowerCase()}`,
    `${category.toLowerCase()} near me`,
    `${city.toLowerCase()} ${state.toLowerCase()} ${category.toLowerCase()}`
  ].join(', ');

  // Google Analytics & Tag Manager IDs from env
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';
  const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '';

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
    <link rel="canonical" href="https://${combo.categoryUrl}.${combo.cityUrl}.near-me.us/" />
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="https://${combo.categoryUrl}.${combo.cityUrl}.near-me.us/" />
    <meta property="og:image" content="https://near-me.us/og-images/${combo.categoryUrl}-${combo.cityUrl}.jpg" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="https://near-me.us/og-images/${combo.categoryUrl}-${combo.cityUrl}.jpg" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "${category} in ${city}, ${state}",
      "url": "https://${combo.categoryUrl}.${combo.cityUrl}.near-me.us/",
      "description": "${description}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://${combo.categoryUrl}.${combo.cityUrl}.near-me.us/?search={search_term_string}",
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
  const combinations = getUniqueCombinations();
  const distDir = path.join(__dirname, '../dist');
  
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log(`Generating HTML files for ${combinations.length} subdomain combinations...`);

  combinations.forEach(combo => {
    const html = generateHTML(combo);
    const filename = `${combo.categoryUrl}.${combo.cityUrl}.html`;
    const filepath = path.join(distDir, filename);
    
    fs.writeFileSync(filepath, html);
    console.log(`✓ Generated: ${filename} - "${combo.category} in ${combo.city}, ${combo.state}"`);
  });

  // Generate a mapping file for deployment
  const mapping = combinations.map(combo => ({
    subdomain: `${combo.categoryUrl}.${combo.cityUrl}.near-me.us`,
    file: `${combo.categoryUrl}.${combo.cityUrl}.html`,
    title: `Best ${combo.category} in ${combo.city}, ${combo.state}`,
    description: `Find top-rated ${combo.category.toLowerCase()} in ${combo.city}, ${combo.state}. Compare ${combo.businessCount}+ local businesses.`,
    buildTime: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  }));

  fs.writeFileSync(
    path.join(distDir, 'subdomain-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`\n✅ Generated ${combinations.length} HTML files with production cache busting`);
  console.log('📄 Created subdomain-mapping.json for deployment configuration');
  
  // Show what was generated
  console.log('\n📋 Generated files:');
  combinations.forEach(combo => {
    console.log(`   • ${combo.categoryUrl}.${combo.cityUrl}.html → "${combo.category} in ${combo.city}, ${combo.state}"`);
  });
}

// Run the generator
generateSubdomainHTML();