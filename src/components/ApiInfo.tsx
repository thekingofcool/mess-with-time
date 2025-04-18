
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Key, Copy, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ApiInfo = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Globe className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">API Access</h2>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">API Endpoints</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">Current Time</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard("https://api.timetools.io/v1/current")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-100 p-2 rounded text-sm font-mono">
              GET https://api.timetools.io/v1/current
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">Convert Timestamp</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard("https://api.timetools.io/v1/convert?timestamp=1618840800")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-100 p-2 rounded text-sm font-mono">
              GET https://api.timetools.io/v1/convert?timestamp=1618840800
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">Time Zone Conversion</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard("https://api.timetools.io/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-100 p-2 rounded text-sm font-mono break-all">
              GET https://api.timetools.io/v1/timezone?time=2023-04-19T15:30:00&from=UTC&to=America/New_York
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Key className="text-purple-600 mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold">Your API Key</h3>
        </div>
        
        {!apiKey ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Generate a demo API key to test our endpoints with limited usage, or upgrade to Premium for increased limits.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={generateDemoKey}>
                Generate Demo Key
              </Button>
              <Button>
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
                className="font-mono text-sm bg-white"
              />
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(apiKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-1">Usage limits:</p>
              <ul className="list-disc list-inside">
                <li>60 requests/hour</li>
                <li>Basic endpoints only</li>
                <li>No commercial use</li>
              </ul>
            </div>
            <Button variant="default">
              Upgrade to Premium
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold mb-3">Documentation</h3>
        <p className="text-sm text-gray-600 mb-4">
          For detailed API documentation, including all endpoints, parameters, and response formats, 
          please visit our comprehensive API reference.
        </p>
        <Button variant="outline" className="w-full">
          View Full API Documentation
        </Button>
      </div>
    </div>
  );
};

export default ApiInfo;
