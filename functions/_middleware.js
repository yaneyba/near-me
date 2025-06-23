export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  
  // Parse subdomain: nail-salons.frisco.near-me.us
  const parts = hostname.split('.');
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0];
    const city = parts[1];
    const htmlFileName = `${category}.${city}.html`;
    
    try {
      // Use the correct method to fetch static assets
      const response = await context.env.ASSETS.fetch(
        new Request(url.origin + '/' + htmlFileName)
      );
      
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error('Asset fetch error:', error);
    }
  }
  
  // Let Cloudflare handle normal routing (static files, React app, etc.)
  return context.next();
}