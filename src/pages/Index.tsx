
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeConverter from "@/components/TimeConverter";
import TimestampConverter from "@/components/TimestampConverter";
import CurrentTime from "@/components/CurrentTime";
import RelativeTime from "@/components/RelativeTime";
import TimeCalculator from "@/components/TimeCalculator";
import TimeFormatter from "@/components/TimeFormatter";
import ApiInfo from "@/components/ApiInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Time Utility Tools</h1>
          <p className="text-gray-600">All-in-one time conversion and manipulation tools</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Tabs defaultValue="converter" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              <TabsTrigger value="converter">Time Zone</TabsTrigger>
              <TabsTrigger value="timestamp">Timestamp</TabsTrigger>
              <TabsTrigger value="current">Current Time</TabsTrigger>
              <TabsTrigger value="relative">Relative Time</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="formatter">Formatter</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="converter">
              <TimeConverter />
            </TabsContent>
            
            <TabsContent value="timestamp">
              <TimestampConverter />
            </TabsContent>
            
            <TabsContent value="current">
              <CurrentTime />
            </TabsContent>
            
            <TabsContent value="relative">
              <RelativeTime />
            </TabsContent>
            
            <TabsContent value="calculator">
              <TimeCalculator />
            </TabsContent>
            
            <TabsContent value="formatter">
              <TimeFormatter />
            </TabsContent>
            
            <TabsContent value="api">
              <ApiInfo />
            </TabsContent>
            
            <TabsContent value="premium">
              <div className="space-y-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
                <h2 className="text-xl font-semibold text-gray-800">Premium Services</h2>
                <p className="text-gray-700">Upgrade to Premium for enhanced features:</p>
                <ul className="list-disc ml-5 text-gray-600 space-y-2">
                  <li>API access with higher rate limits</li>
                  <li>Bulk time conversions</li>
                  <li>No advertisements</li>
                  <li>Advanced formatting options</li>
                  <li>Email support</li>
                </ul>
                <div className="pt-4">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Time Utility Tools. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
