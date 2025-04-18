
import { useState } from "react";
import { format, fromUnixTime } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Copy, RefreshCcw, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectTrigger, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("");
  const [timestampType, setTimestampType] = useState<string>("seconds");
  const [convertedResult, setConvertedResult] = useState<string>("");
  const [pythonCode, setPythonCode] = useState<string>("");
  const { toast } = useToast();

  const formatDateInput = (input: string) => {
    // Remove non-numeric characters except hyphens
    let formattedInput = input.replace(/[^\d-]/g, '');
    
    // Split by hyphens to get year, month, day
    const parts = formattedInput.split('-');
    let year = parts[0] || '';
    let month = parts.length > 1 ? parts[1] : '';
    let day = parts.length > 2 ? parts[2] : '';
    
    // Ensure year, month and day don't exceed their limits
    if (year.length > 4) year = year.slice(0, 4);
    if (month.length > 2) month = month.slice(0, 2);
    if (day.length > 2) day = day.slice(0, 2);
    
    // Format month
    if (month) {
      const monthNum = parseInt(month);
      if (monthNum > 12) month = '12';
      else if (monthNum === 0) month = '01';
      else if (month.length === 1 && monthNum > 0) month = monthNum.toString().padStart(2, '0');
    }
    
    // Format day based on month
    if (day) {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month) || 0;
      let maxDays = 31;
      
      // Determine max days for the month
      if (monthNum === 2) {
        // February (simple leap year check)
        const yearNum = parseInt(year) || new Date().getFullYear();
        maxDays = ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0) ? 29 : 28;
      } else if ([4, 6, 9, 11].includes(monthNum)) {
        // April, June, September, November have 30 days
        maxDays = 30;
      }
      
      if (dayNum > maxDays) day = maxDays.toString();
      else if (dayNum === 0) day = '01';
      else if (day.length === 1 && dayNum > 0) day = dayNum.toString().padStart(2, '0');
    }
    
    // Reconstruct the formatted date
    let result = year;
    if (month) result += result ? '-' + month : month;
    if (day) result += result && month ? '-' + day : day;
    
    return result;
  };

  const formatTimeInput = (input: string) => {
    // Remove non-numeric characters except colons
    let formattedInput = input.replace(/[^\d:]/g, '');
    
    // Split by colons to get hours, minutes, seconds
    const parts = formattedInput.split(':');
    let hours = parts[0] || '';
    let minutes = parts.length > 1 ? parts[1] : '';
    let seconds = parts.length > 2 ? parts[2] : '';
    
    // Ensure hours, minutes, seconds don't exceed their limits
    if (hours.length > 2) hours = hours.slice(0, 2);
    if (minutes.length > 2) minutes = minutes.slice(0, 2);
    if (seconds.length > 2) seconds = seconds.slice(0, 2);
    
    // Format hours
    if (hours) {
      const hoursNum = parseInt(hours);
      if (hoursNum > 23) hours = '23';
      else if (hours.length === 1 && hoursNum >= 0) hours = hoursNum.toString().padStart(2, '0');
    }
    
    // Format minutes
    if (minutes) {
      const minutesNum = parseInt(minutes);
      if (minutesNum > 59) minutes = '59';
      else if (minutes.length === 1 && minutesNum >= 0) minutes = minutesNum.toString().padStart(2, '0');
    }
    
    // Format seconds
    if (seconds) {
      const secondsNum = parseInt(seconds);
      if (secondsNum > 59) seconds = '59';
      else if (seconds.length === 1 && secondsNum >= 0) seconds = secondsNum.toString().padStart(2, '0');
    }
    
    // Reconstruct the formatted time
    let result = hours;
    if (minutes) result += result ? ':' + minutes : minutes;
    if (seconds) result += result && minutes ? ':' + seconds : seconds;
    
    return result;
  };

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
      <div className="flex items-center justify-center space-x-2">
        <ArrowUpDown className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Timestamp Converter</h2>
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
              placeholder={timestampType === "iso8601" ? "YYYY-MM-DDTHH:MM:SSZ" : "Enter timestamp"}
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
              Date (YYYY-MM-DD)
            </label>
            <Input
              type="text"
              placeholder="YYYY-MM-DD"
              value={dateInput}
              onChange={handleDateChange}
              onBlur={() => setDateInput(formatDateInput(dateInput))}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time (HH:MM:SS)
            </label>
            <Input
              type="text"
              placeholder="HH:MM:SS"
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
              <pre className="bg-black/30 rounded-md p-4 text-gray-200 text-xs overflow-auto">
                {pythonCode}
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
