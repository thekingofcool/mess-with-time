
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ApiInfo = () => {
  const baseUrl = window.location.origin;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Current Time API */}
        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Get Current Time</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-300 mb-2">Endpoint:</p>
              <div className="flex items-center gap-2">
                <code className="bg-black/40 px-3 py-2 rounded text-purple-300 flex-1">
                  GET {baseUrl}/api/v1/current
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`${baseUrl}/api/v1/current`, "Endpoint URL")}
                  className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Example Response:</p>
              <div className="relative">
                <pre className="bg-black/40 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "timestamp": ${Math.floor(Date.now() / 1000)},
  "iso": "${new Date().toISOString()}",
  "utc": "${new Date().toUTCString()}",
  "timezone": "UTC"
}`}
                </pre>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`fetch('${baseUrl}/api/v1/current')
  .then(response => response.json())
  .then(data => console.log(data));`, "Example Code")}
                  className="absolute top-2 right-2 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Example Usage:</p>
              <div className="relative">
                <pre className="bg-black/40 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`fetch('${baseUrl}/api/v1/current')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Convert Timestamp API */}
        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Convert Timestamp</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-300 mb-2">Endpoint:</p>
              <div className="flex items-center gap-2">
                <code className="bg-black/40 px-3 py-2 rounded text-purple-300 flex-1">
                  GET {baseUrl}/api/v1/convert?timestamp=1618840800
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`${baseUrl}/api/v1/convert?timestamp=1618840800`, "Endpoint URL")}
                  className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Parameters:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
                <li><code className="text-purple-300">timestamp</code> - Unix timestamp (seconds since epoch)</li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Example Response:</p>
              <div className="relative">
                <pre className="bg-black/40 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "timestamp": 1618840800,
  "iso": "2021-04-19T12:00:00.000Z",
  "utc": "Mon, 19 Apr 2021 12:00:00 GMT",
  "local": "Mon Apr 19 2021 08:00:00",
  "formatted": "2021-04-19 08:00:00"
}`}
                </pre>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(`fetch('${baseUrl}/api/v1/convert?timestamp=1618840800')
  .then(response => response.json())
  .then(data => console.log(data));`, "Example Code")}
                  className="absolute top-2 right-2 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Example Usage:</p>
              <div className="relative">
                <pre className="bg-black/40 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`fetch('${baseUrl}/api/v1/convert?timestamp=1618840800')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiInfo;
