export async function onRequest(context) {
  console.log('🔥 MIDDLEWARE IS RUNNING!');
  console.log('Hostname:', context.request.url);
  
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  
  console.log('Parsed hostname:', hostname);
  
  // Parse subdomain: nail-salons.dallas.near-me.us
  const parts = hostname.split('.');
  console.log('Hostname parts:', parts);
  
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const category = parts[0];
    const city = parts[1];
    const htmlFileName = `${category}.${city}.html`;
    
    console.log('🎯 SUBDOMAIN DETECTED:', category, city);
    console.log('Looking for file:', htmlFileName);
    
    // Add a debug header so you can see in browser dev tools
    return new Response('MIDDLEWARE WORKING - SUBDOMAIN DETECTED', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'X-Debug': `category=${category}, city=${city}, file=${htmlFileName}`
      }
    });
  }
  
  console.log('❌ No subdomain match, continuing...');
  return context.next();
}