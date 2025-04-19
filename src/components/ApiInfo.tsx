import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Key, Copy, ChevronRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const ApiInfo = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>(window.location.origin);
  const { toast } = useToast();

  useEffect(() => {
    // Determine the appropriate API URL based on environment
    // For Cloudflare Pages, this would be your domain or API-specific subdomain
    setBaseUrl(window.location.origin);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const generateDemoKey = () => {
    const demoKey = `demo_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(demoKey);
    toast({
      title: "Demo API key generated",
      description: "This is a demo key with limited usage.",
      duration: 3000,
    });
  };
  
  const openEndpoint = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Globe className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">API Access</h2>
      </div>

      <div className="p-4 bg-black/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">API Endpoints</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-gray-200">Current Time</div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openEndpoint(`${baseUrl}/api/v1/current`)}
                  className="text-gray-300 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(`${baseUrl}/api/v1/current`)}
                  className="text-gray-300 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-black/30 p-2 rounded text-sm font-mono text-gray-300">
              GET {baseUrl}/api/v1/current
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-gray-200">Convert Timestamp</div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openEndpoint(`${baseUrl}/api/v1/convert?timestamp=1618840800`)}
                  className="text-gray-300 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(`${baseUrl}/api/v1/convert?timestamp=1618840800`)}
                  className="text-gray-300 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-black/30 p-2 rounded text-sm font-mono text-gray-300">
              GET {baseUrl}/api/v1/convert?timestamp=1618840800
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-gray-200">Time Zone Conversion</div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openEndpoint(`${baseUrl}/api/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York`)}
                  className="text-gray-300 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(`${baseUrl}/api/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York`)}
                  className="text-gray-300 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-black/30 p-2 rounded text-sm font-mono break-all text-gray-300">
              GET {baseUrl}/api/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Key className="text-purple-400 mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold text-white">Your API Key</h3>
        </div>
        
        {!apiKey ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Generate a demo API key to test our endpoints with limited usage, or upgrade to Premium for increased limits.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={generateDemoKey} className="border-purple-500/20 text-gray-100 hover:bg-purple-500/20">
                Generate Demo Key
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Upgrade to Premium
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={apiKey} 
                readOnly 
                className="font-mono text-sm bg-black/20 border-purple-500/20 text-gray-100"
              />
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(apiKey)}
                className="border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </Button>
            </div>
            <div className="text-sm text-gray-300">
              <p className="mb-1">Usage limits:</p>
              <ul className="list-disc list-inside">
                <li>60 requests/hour</li>
                <li>Basic endpoints only</li>
                <li>No commercial use</li>
              </ul>
            </div>
            <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Upgrade to Premium
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-purple-500/20 pt-4">
        <h3 className="text-lg font-semibold mb-3 text-white">Documentation</h3>
        <p className="text-sm text-gray-300 mb-4">
          For detailed API documentation, including all endpoints, parameters, and response formats, 
          please visit our comprehensive API reference.
        </p>
        <Link to="/api-docs">
          <Button variant="outline" className="w-full border-purple-500/20 text-gray-100 hover:bg-purple-500/20">
            View Full API Documentation
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ApiInfo;
