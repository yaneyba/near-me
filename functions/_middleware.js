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
    if (parts.length >= 3 && parts[parts.length-2] === 'near-me' && parts[parts.length-1] === 'us') {
      // This is a subdomain API request - proxy to main domain
      const targetUrl = `https://near-me.us${pathname}${url.search}`;
      const newRequest = new Request(targetUrl, {
        method: context.request.method,
        headers: context.request.headers,
        body: context.request.body
      });
      
      // Handle CORS preflight
      if (context.request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          }
        });
      }
      
      const response = await fetch(newRequest);
      
      // Add CORS headers to the response
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return newResponse;
    }
  }
  
  // Handle subdomain routing for category-only subdomains
  const parts = hostname.split('.');
  
  // Category-only subdomains: nail-salons.near-me.us, auto-repair.near-me.us, water-refill.near-me.us
  if (parts.length === 3 && parts[1] === 'near-me' && parts[2] === 'us') {
    const category = parts[0];
    
    // Known category-only subdomains
    const knownCategories = ['nail-salons', 'auto-repair', 'water-refill', 'senior-care', 'specialty-pet'];
    
    if (knownCategories.includes(category)) {
      const htmlFileName = `${category}.html`;
      
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
  }
  
  // Legacy: Handle old city-specific subdomains (if any still exist)
  if (parts.length >= 5 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0];
    const city = parts[1];
    
    // Known old combinations - redirect to category-only
    const categoryRedirects = {
      'nail-salons': 'https://nail-salons.near-me.us',
      'auto-repair': 'https://auto-repair.near-me.us',
      'water-refill': 'https://water-refill.near-me.us',
      'senior-care': 'https://senior-care.near-me.us',
      'specialty-pet': 'https://specialty-pet.near-me.us'
    };
    
    if (categoryRedirects[category]) {
      return Response.redirect(categoryRedirects[category] + pathname + url.search, 301);
    }
    
    // For unknown subdomains, redirect to main domain
    return Response.redirect(`https://near-me.us${pathname}${url.search}`, 301);
  }
  
  return context.next();
}