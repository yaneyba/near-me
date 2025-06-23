export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Parse subdomain structure: category.city.near-me.us
  const parts = hostname.split('.');
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0];
    const city = parts[1];
    
    // Rewrite to the appropriate HTML file
    const htmlFile = `/${category}.${city}.html`;
    
    // Fetch the HTML file
    const response = await context.env.ASSETS.fetch(
      new Request(url.origin + htmlFile, request)
    );
    
    if (response.status === 200) {
      return response;
    }
  }
  
  // Fallback to original request
  return context.next();
}
