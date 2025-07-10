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
  
  // Handle API requests from subdomains - proxy to main domain
  if (pathname.startsWith('/api/')) {
    const parts = hostname.split('.');
    if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
      // This is a subdomain API request - proxy to main domain
      const targetUrl = `https://near-me-32q.pages.dev${pathname}${url.search}`;
      const newRequest = new Request(targetUrl, {
        method: context.request.method,
        headers: context.request.headers,
        body: context.request.body
      });
      return fetch(newRequest);
    }
  }
  
  // Handle subdomain routing
  const parts = hostname.split('.');
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0];
    const city = parts[1];
    
    // Known subdomains - check if HTML file exists
    const knownCombinations = [
      'nail-salons.dallas',
      'auto-repair.denver',
      'nail-salons.austin',
      'nail-salons.frisco',
      'nail-salons.garland'
    ];
    
    const combination = `${category}.${city}`;
    
    if (knownCombinations.includes(combination)) {
      const htmlFileName = `${combination}.html`;
      
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
    
    // For unknown subdomains, redirect to services.near-me.us
    const targetUrl = `https://services.near-me.us${pathname}${url.search}`;
    return Response.redirect(targetUrl, 301);
  }
  
  // Special handling for services subdomain
  if (hostname === 'services.near-me.us') {
    return context.next();
  }
  
  return context.next();
}