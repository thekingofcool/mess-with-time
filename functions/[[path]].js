
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  if (url.pathname.startsWith('/api/')) {
    // Handle API requests directly here
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

    // API endpoints
    if (url.pathname === '/api/time/current') {
      // Current time endpoint
      const now = new Date();
      return new Response(JSON.stringify({
        timestamp: Math.floor(now.getTime() / 1000),
        iso: now.toISOString(),
        utc: now.toUTCString()
      }), {
        headers: corsHeaders
      });
    } 
    else if (url.pathname === '/api/time/convert') {
      // Convert timestamp endpoint
      const timestamp = url.searchParams.get('timestamp');
      
      if (!timestamp) {
        return new Response(JSON.stringify({
          error: 'Missing timestamp parameter'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      try {
        const timestampNum = parseInt(timestamp);
        const date = new Date(timestampNum * 1000);
        
        if (isNaN(date.getTime())) {
          throw new Error('Invalid timestamp');
        }
        
        return new Response(JSON.stringify({
          timestamp: timestampNum,
          iso: date.toISOString(),
          utc: date.toUTCString(),
          formatted: formatDate(date)
        }), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
    }
    
    // API info endpoint
    if (url.pathname === '/api/info') {
      return new Response(JSON.stringify({
        name: "Simple Time API",
        endpoints: [
          {
            path: "/api/time/current",
            description: "Get current time in various formats"
          },
          {
            path: "/api/time/convert?timestamp=1234567890",
            description: "Convert Unix timestamp to various formats"
          }
        ]
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

// Helper function to format dates
function formatDate(date) {
  if (!date) return '';
  
  const pad = (num) => String(num).padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
