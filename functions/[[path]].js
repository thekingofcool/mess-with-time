
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  if (url.pathname.startsWith('/api/')) {
    // Handle API requests directly here instead of using a separate handler
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Only allow GET requests
    if (context.request.method !== 'GET') {
      return new Response(JSON.stringify({
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: corsHeaders
      });
    }

    // Simple API endpoints
    if (url.pathname === '/api/time') {
      const now = new Date();
      return new Response(JSON.stringify({
        timestamp: Math.floor(now.getTime() / 1000),
        iso: now.toISOString(),
        utc: now.toUTCString()
      }), {
        headers: corsHeaders
      });
    }

    // Return 404 for unknown endpoints
    return new Response(JSON.stringify({
      error: 'Not found'
    }), {
      status: 404,
      headers: corsHeaders
    });
  }

  // Serve the main application for non-API requests
  return context.env.ASSETS.fetch(new Request(url));
}
