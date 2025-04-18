
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1F3D] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            Mess with Time
          </h1>
          <p className="text-gray-300">Manipulate time at your will</p>
        </header>
        
        <div className="bg-black/20 backdrop-blur-lg border border-purple-500/10 rounded-xl shadow-lg shadow-purple-500/10 p-6">
          <Tabs defaultValue="converter" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              <TabsTrigger value="converter">Time Zone</TabsTrigger>
              <TabsTrigger value="timestamp">Timestamp</TabsTrigger>
              <TabsTrigger value="calculator">Time Tools</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="converter">
              <TimeConverter />
            </TabsContent>
            
            <TabsContent value="timestamp">
              <TimestampConverter />
            </TabsContent>
            
            <TabsContent value="calculator">
              <Tabs defaultValue="calc" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <TabsTrigger value="calc">Calculator</TabsTrigger>
                  <TabsTrigger value="format">Format</TabsTrigger>
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="relative">Relative</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calc">
                  <TimeCalculator />
                </TabsContent>
                
                <TabsContent value="format">
                  <TimeFormatter />
                </TabsContent>
                
                <TabsContent value="current">
                  <CurrentTime />
                </TabsContent>
                
                <TabsContent value="relative">
                  <RelativeTime />
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="api">
              <ApiInfo />
            </TabsContent>
          </Tabs>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Mess with Time. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
