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
  'houston': 'Texas'
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
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
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
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
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
    console.log(`✓ Generated: ${filename}`);
  });

  // Generate a mapping file for deployment
  const mapping = combinations.map(combo => ({
    subdomain: `${combo.categoryUrl}.${combo.cityUrl}.near-me.us`,
    file: `${combo.categoryUrl}.${combo.cityUrl}.html`,
    title: `Best ${combo.category} in ${combo.city}, ${combo.state}`
  }));

  fs.writeFileSync(
    path.join(distDir, 'subdomain-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`\n✅ Generated ${combinations.length} HTML files`);
  console.log('📄 Created subdomain-mapping.json for deployment configuration');
}

// Run the generator
generateSubdomainHTML();