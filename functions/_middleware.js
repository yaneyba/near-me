export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;
  
  // Don't intercept asset files (CSS, JS, images, etc.)
  if (pathname.startsWith('/assets/') || 
      pathname.startsWith('/favicon') || 
      pathname.endsWith('.css') || 
      pathname.endsWith('.js') || 
      pathname.endsWith('.ico') || 
      pathname.endsWith('.png') || 
      pathname.endsWith('.jpg') || 
      pathname.endsWith('.svg')) {
    return context.next();
  }
  
  // Only handle the main page request
  const parts = hostname.split('.');
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0];
    const city = parts[1];
    const htmlFileName = `${category}.${city}.html`;
    
    try {
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
  
  return context.next();
}