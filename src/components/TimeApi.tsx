
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Copy, Clock, CalendarClock } from "lucide-react";

const TimeApi = () => {
  const [currentTimeData, setCurrentTimeData] = useState<any>(null);
  const [convertTimestamp, setConvertTimestamp] = useState<string>("");
  const [convertedData, setConvertedData] = useState<any>(null);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState<boolean>(false);
  const [isLoadingConvert, setIsLoadingConvert] = useState<boolean>(false);

  // Mock API function for current time
  const fetchCurrentTime = async () => {
    setIsLoadingCurrent(true);
    try {
      const now = new Date();
      const data = {
        timestamp: Math.floor(now.getTime() / 1000),
        iso: now.toISOString(),
        utc: now.toUTCString()
      };
      setCurrentTimeData(data);
      toast({
        title: "Success",
        description: "Current time fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching current time:", error);
      toast({
        title: "Error",
        description: "Failed to fetch current time",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCurrent(false);
    }
  };

  // Mock API function for converting timestamp
  const handleConvertTimestamp = async () => {
    if (!convertTimestamp) {
      toast({
        title: "Error",
        description: "Please enter a timestamp",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingConvert(true);
    try {
      const timestamp = parseInt(convertTimestamp);
      const date = new Date(timestamp * 1000);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp");
      }
      
      const data = {
        timestamp: timestamp,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        formatted: date.toLocaleString()
      };
      
      setConvertedData(data);
      toast({
        title: "Success",
        description: "Timestamp converted successfully",
      });
    } catch (error) {
      console.error("Error converting timestamp:", error);
      toast({
        title: "Error",
        description: "Failed to convert timestamp",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConvert(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Clock className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Time API</h2>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/20">
          <TabsTrigger value="current">Current Time</TabsTrigger>
          <TabsTrigger value="convert">Convert Timestamp</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Current Time API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={fetchCurrentTime} 
                disabled={isLoadingCurrent}
                className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
              >
                {isLoadingCurrent ? "Loading..." : "Get Current Time"}
              </Button>

              {currentTimeData && (
                <div className="space-y-3 mt-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Unix Timestamp:</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={currentTimeData.timestamp} 
                        readOnly 
                        className="bg-black/20 border-purple-500/20 text-gray-100"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(currentTimeData.timestamp.toString(), "Timestamp")}
                        className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-300 mb-1">ISO 8601:</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={currentTimeData.iso} 
                        readOnly 
                        className="bg-black/20 border-purple-500/20 text-gray-100"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(currentTimeData.iso, "ISO time")}
                        className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-300 mb-1">UTC:</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={currentTimeData.utc} 
                        readOnly 
                        className="bg-black/20 border-purple-500/20 text-gray-100"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(currentTimeData.utc, "UTC time")}
                        className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">Convert Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-1">Unix Timestamp:</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value={convertTimestamp} 
                    onChange={(e) => setConvertTimestamp(e.target.value)}
                    placeholder="Enter Unix timestamp (seconds)" 
                    className="bg-black/20 border-purple-500/20 text-gray-100"
                  />
                </div>
              </div>

              <Button 
                onClick={handleConvertTimestamp} 
                disabled={isLoadingConvert}
                className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
              >
                {isLoadingConvert ? "Converting..." : "Convert Timestamp"}
              </Button>

              {convertedData && (
                <div className="space-y-3 mt-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">ISO 8601:</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={convertedData.iso} 
                        readOnly 
                        className="bg-black/20 border-purple-500/20 text-gray-100"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(convertedData.iso, "ISO time")}
                        className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-300 mb-1">UTC:</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={convertedData.utc} 
                        readOnly 
                        className="bg-black/20 border-purple-500/20 text-gray-100"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(convertedData.utc, "UTC time")}
                        className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Formatted:</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={convertedData.formatted} 
                        readOnly 
                        className="bg-black/20 border-purple-500/20 text-gray-100"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(convertedData.formatted, "Formatted time")}
                        className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeApi;
