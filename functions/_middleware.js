export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  
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
        let html = await response.text();
        
        // Inject subdomain data for React app
        const subdomainData = `
          <script>
            window.SUBDOMAIN_CONFIG = {
              category: "${category}",
              city: "${city}",
              hostname: "${hostname}"
            };
          </script>
        `;
        
        html = html.replace('</head>', `${subdomainData}</head>`);
        
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        });
      }
    } catch (error) {
      console.error('Asset fetch error:', error);
    }
  }
  
  return context.next();
}