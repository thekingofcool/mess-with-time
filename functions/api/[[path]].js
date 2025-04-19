
/**
 * Not Today API - Cloudflare Pages Functions
 * Handles API requests for time-related functions
 */

// Helper for formatting dates
function formatDate(date, format) {
  if (!date) return '';
  
  const pad = (num) => String(num).padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// Helper for parsing date-time strings
function parseDateTime(dateTimeString) {
  if (!dateTimeString) return null;
  
  // Try to parse as ISO format
  const date = new Date(dateTimeString);
  
  // Check if valid
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Main request handler for Cloudflare Pages Functions
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '').replace('/api', '');
  
  // Debug info
  console.log("API Request:", {
    url: request.url,
    path: path,
    fullPath: url.pathname
  });
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // API endpoints
  if (path === 'v1/current' || path === '/v1/current') {
    const now = new Date();
    return jsonResponse({
      timestamp: Math.floor(now.getTime() / 1000),
      iso: now.toISOString(),
      utc: now.toUTCString(),
      timezone: 'UTC', // Functions run in UTC
    });
  } 
  else if (path === 'v1/convert' || path === '/v1/convert') {
    const timestamp = url.searchParams.get('timestamp');
    
    if (!timestamp) {
      return jsonResponse({ 
        error: 'Missing timestamp parameter',
        status: 'error'
      }, 400);
    }
    
    try {
      const timestampNum = parseInt(timestamp);
      const date = new Date(timestampNum * 1000);
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }
      
      return jsonResponse({
        timestamp: timestampNum,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toString(),
        formatted: formatDate(date, 'YYYY-MM-DD HH:mm:ss'),
      });
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        status: 'error'
      }, 400);
    }
  } 
  else if (path === 'v1/timezone' || path === '/v1/timezone') {
    const time = url.searchParams.get('time');
    const fromTz = url.searchParams.get('from');
    const toTz = url.searchParams.get('to');
    
    if (!time || !fromTz || !toTz) {
      return jsonResponse({ 
        error: 'Missing required parameters (time, from, to)',
        status: 'error'
      }, 400);
    }
    
    try {
      const parsedDate = parseDateTime(time);
      if (!parsedDate) {
        throw new Error('Invalid time format');
      }
      
      // Note: Pages Functions environment doesn't natively support timeZone in Intl.DateTimeFormat options
      // This is a simplified implementation
      
      return jsonResponse({
        original: {
          time: parsedDate.toISOString(),
          timezone: fromTz,
        },
        converted: {
          time: parsedDate.toISOString(), // Would be converted in real implementation
          timezone: toTz,
          formatted: formatDate(parsedDate, 'YYYY-MM-DD HH:mm:ss'),
        },
        note: "Note: This is a simplified timezone conversion. A production version would use a full timezone library."
      });
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        status: 'error'
      }, 400);
    }
  }
  
  // Root API path should return available endpoints
  if (path === '' || path === 'v1' || path === '/v1') {
    return jsonResponse({
      name: "Not Today Time API",
      version: "1.0",
      endpoints: [
        "/api/v1/current",
        "/api/v1/convert",
        "/api/v1/timezone"
      ],
      documentation: "/api-docs"
    });
  }
  
  // Not found
  return jsonResponse({ 
    error: 'Invalid API endpoint',
    status: 'error',
    path: path
  }, 404);
}
