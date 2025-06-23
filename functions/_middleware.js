export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  
  // Parse subdomain: nail-salons.frisco.near-me.us
  const parts = hostname.split('.');
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0]; // nail-salons
    const city = parts[1];     // frisco
    
    // Build the filename: nail-salons.frisco.html
    const htmlFileName = `${category}.${city}.html`;
    
    try {
      // Try fetching with a proper URL object
      const assetUrl = new URL(htmlFileName, url.origin);
      const response = await context.env.ASSETS.fetch(assetUrl);
      
      if (response.ok) {
        // Return the HTML content with proper headers
        const html = await response.text();
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } else {
        return new Response(`File not found: ${htmlFileName} (Status: ${response.status})`, {
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
    } catch (error) {
      return new Response(`Error: ${error.message}`, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
  
  return context.next();
}