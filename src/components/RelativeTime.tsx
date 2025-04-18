
import { useState, useEffect } from "react";
import { formatDistanceToNow, formatRelative } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { History, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RelativeTime = () => {
  const [inputTime, setInputTime] = useState<string>("");
  const [unixTimestamp, setUnixTimestamp] = useState<string>("");
  const [relativeTimeStr, setRelativeTimeStr] = useState<string>("");
  const [distanceTimeStr, setDistanceTimeStr] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateRelativeTimes();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update relative times when input changes
  useEffect(() => {
    updateRelativeTimes();
  }, [inputTime, unixTimestamp, currentTime]);

  const updateRelativeTimes = () => {
    try {
      let dateToUse: Date;
      
      if (inputTime) {
        dateToUse = new Date(inputTime);
      } else if (unixTimestamp) {
        // Convert Unix timestamp to Date
        dateToUse = new Date(parseInt(unixTimestamp) * 1000);
      } else {
        return;
      }
      
      if (!isNaN(dateToUse.getTime())) {
        setRelativeTimeStr(formatRelative(dateToUse, currentTime));
        setDistanceTimeStr(formatDistanceToNow(dateToUse, { addSuffix: true }));
      }
    } catch (error) {
      // Handle errors
    }
  };

  const handleInputTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(e.target.value);
    setUnixTimestamp("");
  };

  const handleUnixTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnixTimestamp(e.target.value);
    setInputTime("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const useCurrentTime = () => {
    const now = new Date();
    setInputTime(now.toISOString().slice(0, 16));
    setUnixTimestamp("");
    updateRelativeTimes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <History className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Relative Time</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date and Time
          </label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={inputTime}
              onChange={handleInputTimeChange}
              className="flex-1"
            />
            <Button variant="outline" onClick={useCurrentTime} className="shrink-0">
              <RefreshCw className="h-4 w-4 mr-1" />
              Now
            </Button>
          </div>
        </div>

        <div className="py-2 border-t border-b border-gray-100 my-4">
          <div className="text-center text-gray-500 text-sm">OR</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unix Timestamp
          </label>
          <Input
            type="number"
            value={unixTimestamp}
            onChange={handleUnixTimestampChange}
            placeholder="Enter Unix timestamp in seconds"
            className="w-full"
          />
        </div>

        {(relativeTimeStr || distanceTimeStr) && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Relative to now</div>
                  <div className="text-lg">{distanceTimeStr}</div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => copyToClipboard(distanceTimeStr)}
                  size="sm"
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Formatted relative</div>
                  <div className="text-lg">{relativeTimeStr}</div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => copyToClipboard(relativeTimeStr)}
                  size="sm"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelativeTime;
