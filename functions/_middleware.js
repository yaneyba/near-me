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
      // Try different ways to fetch the file
      const response1 = await context.env.ASSETS.fetch(`/${htmlFileName}`);
      const response2 = await context.env.ASSETS.fetch(htmlFileName);
      const response3 = await context.env.ASSETS.fetch(new URL(`/${htmlFileName}`, url.origin));
      
      return new Response(`
DEBUG INFO:
Looking for: ${htmlFileName}
Method 1 (/${htmlFileName}): ${response1.status}
Method 2 (${htmlFileName}): ${response2.status}
Method 3 (URL object): ${response3.status}

Available files: Check your dist/ folder for ${htmlFileName}
      `, {
        headers: { 'Content-Type': 'text/plain' }
      });
      
    } catch (error) {
      return new Response(`Error: ${error.message}`, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
  
  return context.next();
}