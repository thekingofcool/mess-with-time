import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { formatDate, parseDateTime } from '@/utils/dateTimeUtils';

/**
 * API Routes component that handles all API requests
 * This component doesn't render anything visible but processes API requests
 * and returns JSON responses
 */
const ApiRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Extract the API endpoint from the URL
    const apiPath = location.pathname.replace('/api/', '');
    const searchParams = new URLSearchParams(location.search);
    
    // Process the API request based on the endpoint
    const processRequest = async () => {
      try {
        let response;
        
        if (apiPath === 'v1/current') {
          // Current time endpoint
          response = {
            timestamp: Math.floor(Date.now() / 1000),
            iso: new Date().toISOString(),
            utc: new Date().toUTCString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };
        } 
        else if (apiPath === 'v1/convert') {
          // Convert timestamp endpoint
          const timestamp = searchParams.get('timestamp');
          if (!timestamp) {
            throw new Error('Missing timestamp parameter');
          }
          
          const date = new Date(parseInt(timestamp) * 1000);
          response = {
            timestamp: parseInt(timestamp),
            iso: date.toISOString(),
            utc: date.toUTCString(),
            local: date.toString(),
            formatted: formatDate(date, 'YYYY-MM-DD HH:mm:ss'),
          };
        } 
        else if (apiPath === 'v1/timezone') {
          // Timezone conversion endpoint
          const time = searchParams.get('time');
          const fromTz = searchParams.get('from');
          const toTz = searchParams.get('to');
          
          if (!time || !fromTz || !toTz) {
            throw new Error('Missing required parameters (time, from, to)');
          }
          
          const parsedDate = parseDateTime(time);
          if (!parsedDate) {
            throw new Error('Invalid time format');
          }
          
          // Perform timezone conversion
          const convertedTime = new Date(
            new Date(parsedDate.toLocaleString('en-US', { timeZone: fromTz }))
              .toLocaleString('en-US', { timeZone: toTz })
          );
          
          response = {
            original: {
              time: parsedDate.toISOString(),
              timezone: fromTz,
            },
            converted: {
              time: convertedTime.toISOString(),
              timezone: toTz,
              formatted: formatDate(convertedTime, 'YYYY-MM-DD HH:mm:ss'),
            },
          };
        } 
        else {
          throw new Error('Invalid API endpoint');
        }
        
        // Return JSON response
        document.body.innerHTML = JSON.stringify(response, null, 2);
        document.body.style.whiteSpace = 'pre';
        document.body.style.fontFamily = 'monospace';
        document.title = 'API Response';
      } catch (error) {
        // Handle errors
        const errorResponse = {
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'error',
        };
        
        document.body.innerHTML = JSON.stringify(errorResponse, null, 2);
        document.body.style.whiteSpace = 'pre';
        document.body.style.fontFamily = 'monospace';
        document.title = 'API Error';
      }
    };
    
    processRequest();
  }, [location]);
  
  // This component doesn't render anything visible
  return null;
};

export default ApiRoutes; 