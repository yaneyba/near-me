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

// Generate HTML template with proper meta tags
function generateHTML(combo) {
  const { category, city, state, businessCount } = combo;
  
  const title = `Best ${category} in ${city}, ${state} (${businessCount}+ Options)`;
  const description = `Find top-rated ${category.toLowerCase()} in ${city}, ${state}. Compare ${businessCount}+ local businesses, read reviews, get contact info, and book services online.`;
  const keywords = [
    `${category.toLowerCase()} ${city.toLowerCase()}`,
    `${city.toLowerCase()} ${category.toLowerCase()}`,
    `best ${category.toLowerCase()} ${city.toLowerCase()}`,
    `${category.toLowerCase()} near me`,
    `${city.toLowerCase()} ${state.toLowerCase()} ${category.toLowerCase()}`
  ].join(', ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
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
    
    <!-- Vite Build Assets -->
    <script type="module" crossorigin src="/assets/index-BmqmcbZP.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-DQN5rLq0.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Generate custom 404 page for each subdomain
function generate404HTML(combo) {
  const { category, city, state } = combo;
  
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>Page Not Found - ${category} in ${city}, ${state}</title>
    <meta name="description" content="The page you're looking for doesn't exist. Find ${category.toLowerCase()} in ${city}, ${state} with our directory." />
    <meta name="robots" content="noindex, nofollow" />
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
      
      .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .glass-effect {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    </style>
  </head>
  <body class="min-h-screen gradient-bg">
    <div class="relative min-h-screen flex items-center justify-center px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="mb-8">
          <h1 class="text-8xl font-bold text-white mb-4 opacity-90">404</h1>
          <h2 class="text-3xl font-bold text-white mb-6">Page Not Found</h2>
          <p class="text-xl text-white/80 mb-8">
            The page you're looking for doesn't exist, but we have great ${category.toLowerCase()} in ${city}!
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onclick="window.history.back()" 
            class="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold text-white transition-all duration-300"
          >
            Go Back
          </button>
          
          <a 
            href="https://${combo.categoryUrl}.${combo.cityUrl}.near-me.us" 
            class="px-8 py-4 bg-white text-purple-600 hover:bg-white/90 rounded-xl font-semibold transition-all duration-300"
          >
            Browse ${category}
          </a>
        </div>
      </div>
    </div>
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
    // Generate main HTML file
    const html = generateHTML(combo);
    const filename = `${combo.categoryUrl}.${combo.cityUrl}.html`;
    const filepath = path.join(distDir, filename);
    
    fs.writeFileSync(filepath, html);
    console.log(`✓ Generated: ${filename} - "${combo.category} in ${combo.city}, ${combo.state}"`);
    
    // Generate 404 HTML file for this subdomain
    const html404 = generate404HTML(combo);
    const filename404 = `${combo.categoryUrl}.${combo.cityUrl}.404.html`;
    const filepath404 = path.join(distDir, filename404);
    
    fs.writeFileSync(filepath404, html404);
    console.log(`✓ Generated: ${filename404} - "404 for ${combo.category} in ${combo.city}"`);
  });

  // Generate a mapping file for deployment
  const mapping = combinations.map(combo => ({
    subdomain: `${combo.categoryUrl}.${combo.cityUrl}.near-me.us`,
    file: `${combo.categoryUrl}.${combo.cityUrl}.html`,
    notFoundFile: `${combo.categoryUrl}.${combo.cityUrl}.404.html`,
    title: `Best ${combo.category} in ${combo.city}, ${combo.state}`,
    description: `Find top-rated ${combo.category.toLowerCase()} in ${combo.city}, ${combo.state}. Compare ${combo.businessCount}+ local businesses.`
  }));

  fs.writeFileSync(
    path.join(distDir, 'subdomain-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`\n✅ Generated ${combinations.length} HTML files with SEO meta tags`);
  console.log(`✅ Generated ${combinations.length} custom 404 pages`);
  console.log('📄 Created subdomain-mapping.json for deployment configuration');
  
  // Show what was generated
  console.log('\n📋 Generated files:');
  combinations.forEach(combo => {
    console.log(`   • ${combo.categoryUrl}.${combo.cityUrl}.html → "${combo.category} in ${combo.city}, ${combo.state}"`);
    console.log(`   • ${combo.categoryUrl}.${combo.cityUrl}.404.html → "404 for ${combo.category} in ${combo.city}"`);
  });
}

// Run the generator
generateSubdomainHTML();