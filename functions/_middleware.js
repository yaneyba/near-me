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
      // Fetch the pre-built SEO HTML file
      const response = await context.env.ASSETS.fetch(`/${htmlFileName}`);
      
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error('Error fetching SEO file:', htmlFileName);
    }
  }
  
  // Fallback to normal React app
  return context.next();
}