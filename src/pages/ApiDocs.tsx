import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

const ApiDocs = () => {
  const [baseUrl, setBaseUrl] = useState<string>(window.location.origin);
  const { toast } = useToast();

  useEffect(() => {
    // Determine the appropriate API URL based on environment
    setBaseUrl(window.location.origin);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1F3D] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            API Documentation
          </h1>
          <p className="text-gray-300">Complete reference for Not Today Time API</p>
        </header>

        <div className="bg-black/20 backdrop-blur-lg border border-purple-500/10 rounded-xl shadow-lg shadow-purple-500/10 p-4 sm:p-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-gray-300 mb-4">
                The Not Today Time API provides a set of endpoints for working with dates, times, and timezones. 
                You can use these endpoints to get the current time, convert between timestamps and human-readable dates, 
                and perform timezone conversions.
              </p>
              <p className="text-gray-300">
                All API endpoints return JSON responses and do not require authentication for basic usage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Endpoints</h2>
              
              <div className="space-y-6">
                <div className="border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white">Current Time</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(`${baseUrl}/api/v1/current`)}
                      className="text-gray-300 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-black/30 p-2 rounded text-sm font-mono text-gray-300 mt-2 mb-4">
                    GET {baseUrl}/api/v1/current
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Returns the current time in various formats, including Unix timestamp, ISO format, and UTC.
                  </p>
                  
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Response Format</h4>
                  <pre className="bg-black/30 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "timestamp": 1682006400,
  "iso": "2023-04-20T12:00:00.000Z",
  "utc": "Thu, 20 Apr 2023 12:00:00 GMT",
  "timezone": "America/New_York"
}`}
                  </pre>
                </div>
                
                <div className="border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white">Convert Timestamp</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(`${baseUrl}/api/v1/convert?timestamp=1618840800`)}
                      className="text-gray-300 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-black/30 p-2 rounded text-sm font-mono text-gray-300 mt-2 mb-4">
                    GET {baseUrl}/api/v1/convert?timestamp=1618840800
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Converts a Unix timestamp to various human-readable formats.
                  </p>
                  
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Parameters</h4>
                  <ul className="list-disc list-inside text-gray-300 mb-4">
                    <li><span className="font-mono text-purple-300">timestamp</span> - Unix timestamp (seconds since epoch)</li>
                  </ul>
                  
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Response Format</h4>
                  <pre className="bg-black/30 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "timestamp": 1618840800,
  "iso": "2021-04-19T12:00:00.000Z",
  "utc": "Mon, 19 Apr 2021 12:00:00 GMT",
  "local": "Mon Apr 19 2021 08:00:00 GMT-0400 (Eastern Daylight Time)",
  "formatted": "2021-04-19 08:00:00"
}`}
                  </pre>
                </div>
                
                <div className="border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white">Timezone Conversion</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(`${baseUrl}/api/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York`)}
                      className="text-gray-300 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-black/30 p-2 rounded text-sm font-mono text-gray-300 mt-2 mb-4 break-all">
                    GET {baseUrl}/api/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Converts a time from one timezone to another.
                  </p>
                  
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Parameters</h4>
                  <ul className="list-disc list-inside text-gray-300 mb-4">
                    <li><span className="font-mono text-purple-300">time</span> - Time in ISO format (YYYY-MM-DDTHH:MM:SS)</li>
                    <li><span className="font-mono text-purple-300">from</span> - Source timezone (e.g., UTC, America/New_York)</li>
                    <li><span className="font-mono text-purple-300">to</span> - Target timezone (e.g., Europe/London, Asia/Tokyo)</li>
                  </ul>
                  
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Response Format</h4>
                  <pre className="bg-black/30 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "original": {
    "time": "2023-04-19T15:30:00.000Z",
    "timezone": "UTC"
  },
  "converted": {
    "time": "2023-04-19T11:30:00.000Z",
    "timezone": "America/New_York",
    "formatted": "2023-04-19 11:30:00"
  }
}`}
                  </pre>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Error Handling</h2>
              <p className="text-gray-300 mb-4">
                In case of an error, the API will return a JSON response with an error message and status.
              </p>
              
              <pre className="bg-black/30 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "error": "Invalid API endpoint",
  "status": "error"
}`}
              </pre>
            </section>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Not Today. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ApiDocs; 