
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Earth } from "lucide-react";
import TimeConverter from "@/components/TimeConverter";
import TimestampConverter from "@/components/TimestampConverter";
import CurrentTime from "@/components/CurrentTime";
import RelativeTime from "@/components/RelativeTime";
import TimeCalculator from "@/components/TimeCalculator";
import TimeFormatter from "@/components/TimeFormatter";
import ApiInfo from "@/components/ApiInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1F3D] p-2 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 mb-2">
            Mess with Time
          </h1>
          <p className="text-sm sm:text-base text-gray-300/80">Manipulate time at your will</p>
        </header>
        
        <div className="bg-black/20 backdrop-blur-lg border border-purple-500/10 rounded-xl shadow-lg shadow-purple-500/10 p-3 sm:p-4 md:p-6">
          <Tabs defaultValue="converter" className="w-full">
            <div className="overflow-x-auto -mx-3 px-3 pb-2">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-4 sm:mb-6 min-w-[300px] bg-black/20 p-1">
                <TabsTrigger 
                  value="converter"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                >
                  Time Zone
                </TabsTrigger>
                <TabsTrigger 
                  value="timestamp"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                >
                  Timestamp
                </TabsTrigger>
                <TabsTrigger 
                  value="calculator"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                >
                  Time Tools
                </TabsTrigger>
                <TabsTrigger 
                  value="api"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                >
                  API
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="converter">
              <TimeConverter />
            </TabsContent>
            
            <TabsContent value="timestamp">
              <TimestampConverter />
            </TabsContent>
            
            <TabsContent value="calculator">
              <Tabs defaultValue="calc" className="w-full">
                <div className="overflow-x-auto -mx-3 px-3 pb-2">
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-4 min-w-[300px] bg-black/20 p-1">
                    <TabsTrigger 
                      value="calc"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                    >
                      Calculator
                    </TabsTrigger>
                    <TabsTrigger 
                      value="format"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                    >
                      Format
                    </TabsTrigger>
                    <TabsTrigger 
                      value="current"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                    >
                      Current
                    </TabsTrigger>
                    <TabsTrigger 
                      value="relative"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-sm"
                    >
                      Relative
                    </TabsTrigger>
                  </TabsList>
                </div>
                
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
        
        <footer className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400/80">
          &copy; {new Date().getFullYear()} Not Today. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
