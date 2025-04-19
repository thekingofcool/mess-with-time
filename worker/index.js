/**
 * Not Today API Worker
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

// Handle CORS preflight
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Current time endpoint
async function handleCurrentTime() {
  const now = new Date();
  
  const response = {
    timestamp: Math.floor(now.getTime() / 1000),
    iso: now.toISOString(),
    utc: now.toUTCString(),
    timezone: 'UTC', // Workers run in UTC
  };
  
  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Convert timestamp endpoint
async function handleConvert(url) {
  const timestamp = url.searchParams.get('timestamp');
  
  if (!timestamp) {
    return new Response(JSON.stringify({ 
      error: 'Missing timestamp parameter',
      status: 'error'
    }, null, 2), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  try {
    const timestampNum = parseInt(timestamp);
    const date = new Date(timestampNum * 1000);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid timestamp');
    }
    
    const response = {
      timestamp: timestampNum,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toString(),
      formatted: formatDate(date, 'YYYY-MM-DD HH:mm:ss'),
    };
    
    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error'
    }, null, 2), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Timezone conversion endpoint
async function handleTimezone(url) {
  const time = url.searchParams.get('time');
  const fromTz = url.searchParams.get('from');
  const toTz = url.searchParams.get('to');
  
  if (!time || !fromTz || !toTz) {
    return new Response(JSON.stringify({ 
      error: 'Missing required parameters (time, from, to)',
      status: 'error'
    }, null, 2), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  try {
    const parsedDate = parseDateTime(time);
    if (!parsedDate) {
      throw new Error('Invalid time format');
    }
    
    // Note: Worker environment doesn't natively support timeZone in Intl.DateTimeFormat options
    // This is a simplified implementation
    // For accurate timezone conversion, consider using date-fns-tz or other libraries
    
    // For this example, we'll do a basic conversion
    // In a real implementation, you would use a timezone library
    const response = {
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
    };
    
    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error'
    }, null, 2), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Main request handler
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCORS();
  }
  
  // API endpoints
  if (path.startsWith('/api/v1/current')) {
    return handleCurrentTime();
  } else if (path.startsWith('/api/v1/convert')) {
    return handleConvert(url);
  } else if (path.startsWith('/api/v1/timezone')) {
    return handleTimezone(url);
  }
  
  // Not found
  return new Response(JSON.stringify({ 
    error: 'Invalid API endpoint',
    status: 'error'
  }, null, 2), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Worker event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
}); 