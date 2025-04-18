import { useState, useEffect } from "react";
import { formatDistanceToNow, formatRelative, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { History, RefreshCw, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatDateInput, formatTimeInput, highlightPythonCode } from "@/utils/dateTimeUtils";

const RelativeTime = () => {
  const [inputTime, setInputTime] = useState<string>("");
  const [unixTimestamp, setUnixTimestamp] = useState<string>("");
  const [relativeTimeStr, setRelativeTimeStr] = useState<string>("");
  const [distanceTimeStr, setDistanceTimeStr] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateInput, setDateInput] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("");
  const [pythonCode, setPythonCode] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateRelativeTimes = () => {
    try {
      let dateToUse: Date;
      
      if (dateInput && timeInput) {
        const formattedDate = formatDateInput(dateInput);
        const formattedTime = formatTimeInput(timeInput);
        
        if (formattedDate.length < 10 || !formattedTime) {
          setRelativeTimeStr("");
          setDistanceTimeStr("");
          setPythonCode("");
          return;
        }
        
        const dateTimeStr = `${formattedDate} ${formattedTime}`;
        dateToUse = new Date(dateTimeStr.replace(/-/g, '/'));
        setInputTime(dateTimeStr);
        setUnixTimestamp("");
      } else if (unixTimestamp) {
        dateToUse = new Date(parseInt(unixTimestamp) * 1000);
      } else {
        setRelativeTimeStr("");
        setDistanceTimeStr("");
        setPythonCode("");
        return;
      }
      
      if (!isNaN(dateToUse.getTime())) {
        const relTime = formatRelative(dateToUse, currentTime);
        const distTime = formatDistanceToNow(dateToUse, { addSuffix: true });
        
        setRelativeTimeStr(relTime);
        setDistanceTimeStr(distTime);
        
        generatePythonCode(dateToUse);
      } else {
        setRelativeTimeStr("");
        setDistanceTimeStr("");
        setPythonCode("");
      }
    } catch (error) {
      setRelativeTimeStr("");
      setDistanceTimeStr("");
      setPythonCode("");
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const handleUnixTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnixTimestamp(e.target.value);
    setDateInput("");
    setTimeInput("");
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
    setDateInput(format(now, "yyyy-MM-dd"));
    setTimeInput(format(now, "HH:mm:ss"));
    setUnixTimestamp("");
  };
  
  const copyPythonCode = () => {
    if (pythonCode) {
      navigator.clipboard.writeText(pythonCode);
      toast({
        title: "Python code copied to clipboard",
        description: "The code has been copied and can be used in your Python environment.",
        duration: 3000,
      });
    }
  };
  
  const generatePythonCode = (date: Date) => {
    const timestampSeconds = Math.floor(date.getTime() / 1000);
    const dateTimeStr = format(date, "yyyy-MM-dd HH:mm:ss");
    
    const code = `
from datetime import datetime, timezone
import pytz
from dateutil.relativedelta import relativedelta

def get_relative_time(input_datetime="${dateTimeStr}", timestamp=${timestampSeconds}):
    """
    Calculate relative time from either a datetime string or timestamp
    """
    # Parse input datetime or use timestamp
    if input_datetime:
        dt = datetime.strptime(input_datetime, "%Y-%m-%d %H:%M:%S")
    else:
        dt = datetime.fromtimestamp(timestamp)
    
    # Get current time
    now = datetime.now()
    
    # Calculate difference
    diff = now - dt if now > dt else dt - now
    
    # Format as relative time
    is_past = now > dt
    
    # Calculate components
    years = diff.days // 365
    remaining_days = diff.days % 365
    months = remaining_days // 30
    days = remaining_days % 30
    hours = diff.seconds // 3600
    minutes = (diff.seconds % 3600) // 60
    seconds = diff.seconds % 60
    
    # Format "time ago" string
    if years > 0:
        relative = f"{years} year{'s' if years > 1 else ''}"
    elif months > 0:
        relative = f"{months} month{'s' if months > 1 else ''}"
    elif days > 0:
        relative = f"{days} day{'s' if days > 1 else ''}"
    elif hours > 0:
        relative = f"{hours} hour{'s' if hours > 1 else ''}"
    elif minutes > 0:
        relative = f"{minutes} minute{'s' if minutes > 1 else ''}"
    else:
        relative = f"{seconds} second{'s' if seconds > 1 else ''}"
    
    # Add suffix
    if is_past:
        formatted = f"{relative} ago"
    else:
        formatted = f"in {relative}"
    
    # More detailed format
    if is_past:
        detailed = dt.strftime("%A, %B %d, %Y at %H:%M")
    else:
        detailed = dt.strftime("%A, %B %d, %Y at %H:%M")
    
    return {
        "relative_time": formatted,
        "detailed_format": detailed,
    }

# Example usage
result = get_relative_time()
print(f"Relative time: {result['relative_time']}")
print(f"Formatted time: {result['detailed_format']}")
`.trim();

    setPythonCode(code);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <History className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Relative Time</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date (yyyy-MM-dd)
            </label>
            <Input
              type="text"
              placeholder="yyyy-MM-dd"
              value={dateInput}
              onChange={handleDateInputChange}
              onBlur={() => setDateInput(formatDateInput(dateInput))}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time (HH:mm:ss)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="HH:mm:ss"
                value={timeInput}
                onChange={handleTimeInputChange}
                onBlur={() => setTimeInput(formatTimeInput(timeInput))}
                className="flex-1 bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
              <Button variant="outline" onClick={useCurrentTime} className="shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20">
                <RefreshCw className="h-4 w-4 mr-1" />
                Now
              </Button>
            </div>
          </div>
        </div>

        <div className="py-2 border-t border-b border-gray-700 my-4">
          <div className="text-center text-gray-300 text-sm">OR</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Unix Timestamp
          </label>
          <Input
            type="number"
            value={unixTimestamp}
            onChange={handleUnixTimestampChange}
            placeholder="Enter Unix timestamp in seconds"
            className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
          />
        </div>
        
        <Button 
          onClick={updateRelativeTimes} 
          className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
        >
          Calculate Relative Time
        </Button>

        {(relativeTimeStr || distanceTimeStr) && (
          <div className="mt-6 space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Relative to now</div>
                  <div className="text-lg text-gray-100">{distanceTimeStr}</div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => copyToClipboard(distanceTimeStr)}
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Formatted relative</div>
                  <div className="text-lg text-gray-100">{relativeTimeStr}</div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => copyToClipboard(relativeTimeStr)}
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {pythonCode && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Python Code
            </label>
            <div className="relative">
              <pre className="bg-black/30 rounded-md p-4 overflow-auto">
                <div className="text-gray-200 text-xs" dangerouslySetInnerHTML={{ __html: highlightPythonCode(pythonCode) }} />
              </pre>
              <Button
                onClick={copyPythonCode}
                variant="outline"
                className="absolute top-2 right-2 h-8 py-1 px-2 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelativeTime;
