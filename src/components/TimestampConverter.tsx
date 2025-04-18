
import { useState } from "react";
import { format, fromUnixTime } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Copy, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectTrigger, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";
import { formatDateInput, formatTimeInput, highlightPythonCode } from "@/utils/dateTimeUtils";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("");
  const [timestampType, setTimestampType] = useState<string>("seconds");
  const [convertedResult, setConvertedResult] = useState<string>("");
  const [pythonCode, setPythonCode] = useState<string>("");
  const { toast } = useToast();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const convertToTimestamp = () => {
    try {
      const formattedDate = formatDateInput(dateInput);
      const formattedTime = formatTimeInput(timeInput);
      
      if (formattedDate.length < 10 || !formattedTime) {
        setConvertedResult("Please enter valid date and time");
        setPythonCode("");
        return;
      }
      
      const dateStr = `${formattedDate} ${formattedTime}`;
      const date = new Date(dateStr.replace(/-/g, '/'));
      
      if (isNaN(date.getTime())) {
        setConvertedResult("Invalid date or time format");
        setPythonCode("");
        return;
      }
      
      let ts = Math.floor(date.getTime() / 1000);
      let result = String(ts);
      
      if (timestampType === "milliseconds") {
        result = String(ts * 1000);
      } else if (timestampType === "iso8601") {
        result = date.toISOString();
      }
      
      setConvertedResult(result);
      setTimestamp(result);
      generatePythonCode(true, formattedDate, formattedTime);
    } catch (error) {
      setConvertedResult("Error converting to timestamp");
      setPythonCode("");
    }
  };

  const convertFromTimestamp = () => {
    if (!timestamp) {
      setConvertedResult("Please enter a timestamp");
      setPythonCode("");
      return;
    }
    
    try {
      let date: Date;
      
      if (timestampType === "seconds") {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) {
          setConvertedResult("Invalid timestamp");
          setPythonCode("");
          return;
        }
        date = fromUnixTime(ts);
      } else if (timestampType === "milliseconds") {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) {
          setConvertedResult("Invalid timestamp");
          setPythonCode("");
          return;
        }
        date = fromUnixTime(ts / 1000);
      } else { // iso8601
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        setConvertedResult("Invalid timestamp");
        setPythonCode("");
        return;
      }
      
      const formattedDate = format(date, "yyyy-MM-dd");
      const formattedTime = format(date, "HH:mm:ss");
      
      setDateInput(formattedDate);
      setTimeInput(formattedTime);
      setConvertedResult(`${formattedDate} ${formattedTime}`);
      generatePythonCode(false, formattedDate, formattedTime);
    } catch (error) {
      setConvertedResult("Error converting from timestamp");
      setPythonCode("");
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    
    if (timestampType === "milliseconds") {
      setTimestamp(String(now.getTime()));
    } else if (timestampType === "seconds") {
      setTimestamp(String(Math.floor(now.getTime() / 1000)));
    } else if (timestampType === "iso8601") {
      setTimestamp(now.toISOString());
    }
    
    const formattedDate = format(now, "yyyy-MM-dd");
    const formattedTime = format(now, "HH:mm:ss");
    
    setDateInput(formattedDate);
    setTimeInput(formattedTime);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const generatePythonCode = (toTimestamp: boolean, date: string, time: string) => {
    let pythonCode = '';
    
    if (toTimestamp) {
      pythonCode = `
from datetime import datetime

def datetime_to_timestamp(date_str="${date}", time_str="${time}", output_format="${timestampType}"):
    # Combine date and time
    dt_str = f"{date_str} {time_str}"
    
    # Create datetime object
    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    
    # Convert to timestamp based on format
    if output_format == "seconds":
        return int(dt.timestamp())
    elif output_format == "milliseconds":
        return int(dt.timestamp() * 1000)
    elif output_format == "iso8601":
        return dt.isoformat()

# Example usage
result = datetime_to_timestamp()
print(f"Timestamp: {result}")
`.trim();
    } else {
      pythonCode = `
from datetime import datetime

def timestamp_to_datetime(timestamp="${timestamp}", type="${timestampType}"):
    if type == "seconds":
        dt = datetime.fromtimestamp(int(timestamp))
    elif type == "milliseconds":
        dt = datetime.fromtimestamp(int(timestamp) / 1000)
    else:  # ISO 8601
        dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    
    return dt.strftime("%Y-%m-%d %H:%M:%S")

# Example usage
result = timestamp_to_datetime()
print(f"Datetime: {result}")
`.trim();
    }
    
    setPythonCode(pythonCode);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <ArrowUpDown className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Timestamp Converter</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={timestampType} onValueChange={setTimestampType}>
            <SelectTrigger className="w-40 bg-black/20 border-purple-500/20 text-gray-100">
              <SelectValue placeholder="Timestamp type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Unix (seconds)</SelectItem>
              <SelectItem value="milliseconds">Milliseconds</SelectItem>
              <SelectItem value="iso8601">ISO 8601</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={getCurrentTimestamp} 
            size="sm" 
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Current
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Timestamp
          </label>
          <div className="flex gap-2">
            <Input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder={timestampType === "iso8601" ? "YYYY-MM-DDTHH:mm:ssZ" : "Enter timestamp"}
              className="flex-1 bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(timestamp)}
              className="shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
            >
              <Copy className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date (yyyy-MM-dd)
            </label>
            <Input
              type="text"
              placeholder="yyyy-MM-dd"
              value={dateInput}
              onChange={handleDateChange}
              onBlur={() => setDateInput(formatDateInput(dateInput))}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time (HH:mm:ss)
            </label>
            <Input
              type="text"
              placeholder="HH:mm:ss"
              value={timeInput}
              onChange={handleTimeChange}
              onBlur={() => setTimeInput(formatTimeInput(timeInput))}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={convertToTimestamp}
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            Date/Time ➔ Timestamp
          </Button>
          <Button
            onClick={convertFromTimestamp}
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            Timestamp ➔ Date/Time
          </Button>
        </div>

        {convertedResult && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Converted Result
            </label>
            <div className="flex gap-2">
              <Input
                value={convertedResult}
                readOnly
                className="flex-1 bg-black/20 border-purple-500/20 text-gray-100"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(convertedResult)}
                className="shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </Button>
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

export default TimestampConverter;
